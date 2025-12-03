import { query } from '../config/database';
import { Order, OrderItem } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';

export const generateOrderId = (): string => {
  return `ORD-${Date.now().toString().slice(-9)}`;
};

export const createOrder = async (orderData: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_notes?: string;
  items: Array<{ product_id: string; quantity: number; size?: string; color?: string; price: number }>;
  total_amount: number;
  payment_proof_url?: string;
}): Promise<Order> => {
  // Validate input
  if (!orderData.customer_name || !orderData.customer_phone || !orderData.delivery_address || !orderData.items || orderData.items.length === 0) {
    throw new ValidationError('Missing required order fields');
  }

  const orderId = generateOrderId();
  const { customer_name, customer_phone, delivery_address, delivery_notes, items, total_amount, payment_proof_url } = orderData;

  try {
    // Insert order
    const orderResult = await query(
      `INSERT INTO orders (id, customer_name, customer_phone, delivery_address, delivery_notes, total_amount, payment_proof_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [orderId, customer_name, customer_phone, delivery_address, delivery_notes || null, total_amount, payment_proof_url || null],
    );

    const order = orderResult.rows[0];

    // Insert order items - fetch product name from database
    for (const item of items) {
      // Get product details - must have product_id
      if (!item.product_id) {
        throw new ValidationError('Product ID is required for each item');
      }

      const productResult = await query('SELECT name FROM products WHERE id = $1', [item.product_id]);
      
      if (productResult.rows.length === 0) {
        // Use a default name if product not found
        console.warn(`Product not found: ${item.product_id}, using generic name`);
      }
      
      const productName = productResult.rows[0]?.name || 'Product';

      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, size, color, price)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.product_id, productName, item.quantity, item.size || null, item.color || null, item.price],
      );
    }

    // Fetch complete order with items
    return getOrderById(orderId);
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const orderResult = await query('SELECT * FROM orders WHERE id = $1', [orderId]);

  if (orderResult.rows.length === 0) {
    throw new NotFoundError('Order');
  }

  const order = orderResult.rows[0];

  // Fetch order items
  const itemsResult = await query('SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC', [orderId]);

  return {
    ...order,
    items: itemsResult.rows,
  };
};

export const getSellerOrders = async (
  sellerId: string,
  status?: string,
  searchQuery?: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ orders: Order[]; total: number; page: number; limit: number }> => {
  // Note: In a real system, you'd link orders to sellers through products
  // For now, we'll return all orders (you can modify this based on your business logic)

  let sql = 'SELECT DISTINCT o.* FROM orders o';
  const params: any[] = [];
  let paramIndex = 1;

  let whereClause = 'WHERE 1=1';

  if (status) {
    whereClause += ` AND o.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (searchQuery) {
    whereClause += ` AND (o.id ILIKE $${paramIndex} OR o.customer_name ILIKE $${paramIndex})`;
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  // Get total count
  const countSql = `SELECT COUNT(DISTINCT o.id) as count FROM orders o ${whereClause}`;
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].count, 10);

  // Get paginated results
  const offset = (page - 1) * limit;
  const orderSql = `${sql} ${whereClause} ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(orderSql, params);

  // Fetch items for each order
  const orders = await Promise.all(
    result.rows.map(async (order: any) => {
      const itemsResult = await query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      return {
        ...order,
        items: itemsResult.rows,
      };
    }),
  );

  return {
    orders,
    total,
    page,
    limit,
  };
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<Order> => {
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];

  if (!validStatuses.includes(newStatus)) {
    throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await getOrderById(orderId);
  const currentIndex = validStatuses.indexOf(order.status);
  const newIndex = validStatuses.indexOf(newStatus);

  if (newIndex < currentIndex) {
    throw new ValidationError('Cannot revert order status to a previous state');
  }

  const result = await query(
    'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [newStatus, orderId],
  );

  return getOrderById(orderId);
};

export const updateOrderCourier = async (
  orderId: string,
  courierCompany: string,
  courierTracking: string,
): Promise<Order> => {
  // Verify order exists
  await getOrderById(orderId);

  const result = await query(
    'UPDATE orders SET courier_company = $1, courier_tracking = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [courierCompany, courierTracking, orderId],
  );

  return getOrderById(orderId);
};

export const getOrderStats = async (sellerId?: string): Promise<{ total: number; pending: number; processing: number; shipped: number; delivered: number }> => {
  const sql = 'SELECT status, COUNT(*) as count FROM orders GROUP BY status';
  const result = await query(sql);

  const stats = {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  };

  result.rows.forEach((row: any) => {
    stats[row.status as keyof typeof stats] = parseInt(row.count, 10);
    stats.total += parseInt(row.count, 10);
  });

  return stats;
};

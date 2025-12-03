import { query } from '../config/database';
import { Product, Order } from '../types';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors';

export const getProducts = async (
  searchQuery?: string,
  category?: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ products: Product[]; total: number; page: number; limit: number }> => {
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];
  let paramIndex = 1;

  if (searchQuery) {
    sql += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  if (category) {
    sql += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  // Get total count
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
  const countResult = await query(countSql, params);
  const total = parseInt(countResult.rows[0].count, 10);

  // Add pagination
  const offset = (page - 1) * limit;
  sql += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await query(sql, params);

  return {
    products: result.rows,
    total,
    page,
    limit,
  };
};

export const getProductById = async (productId: string): Promise<Product> => {
  const result = await query('SELECT * FROM products WHERE id = $1', [productId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('Product');
  }

  return result.rows[0];
};

export const createProduct = async (
  sellerId: string,
  productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    gallery_urls?: string[];
    sizes?: string[];
    colors?: string[];
  },
): Promise<Product> => {
  // Validate input
  if (!productData.name || !productData.price || !productData.category) {
    throw new ValidationError('Name, price, and category are required');
  }

  const { name, description, price, category, image_url, gallery_urls = [], sizes = [], colors = [] } =
    productData;

  const result = await query(
    `INSERT INTO products (seller_id, name, description, price, category, image_url, gallery_urls, sizes, colors)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      sellerId,
      name,
      description,
      price,
      category,
      image_url,
      gallery_urls,
      sizes,
      colors,
    ],
  );

  return result.rows[0];
};

export const updateProduct = async (
  productId: string,
  sellerId: string,
  productData: Partial<Product>,
): Promise<Product> => {
  // Check if product exists and belongs to seller
  const product = await getProductById(productId);

  if (product.seller_id !== sellerId) {
    throw new AuthorizationError('You can only edit your own products');
  }

  const updateFields: string[] = [];
  const updateValues: any[] = [];
  let paramIndex = 1;

  const updatableFields = [
    'name',
    'description',
    'price',
    'category',
    'image_url',
    'gallery_urls',
    'sizes',
    'colors',
    'in_stock',
  ];

  for (const field of updatableFields) {
    if (field in productData && productData[field as keyof Product] !== undefined) {
      updateFields.push(`${field} = $${paramIndex}`);
      updateValues.push(productData[field as keyof Product]);
      paramIndex++;
    }
  }

  if (updateFields.length === 0) {
    return product;
  }

  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  updateValues.push(productId);

  const sql = `UPDATE products SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

  const result = await query(sql, updateValues);

  return result.rows[0];
};

export const deleteProduct = async (productId: string, sellerId: string): Promise<void> => {
  // Check if product exists and belongs to seller
  const product = await getProductById(productId);

  if (product.seller_id !== sellerId) {
    throw new AuthorizationError('You can only delete your own products');
  }

  await query('DELETE FROM products WHERE id = $1', [productId]);
};

export const getSellerProducts = async (
  sellerId: string,
  page: number = 1,
  limit: number = 20,
): Promise<{ products: Product[]; total: number; page: number; limit: number }> => {
  const countResult = await query('SELECT COUNT(*) as count FROM products WHERE seller_id = $1', [
    sellerId,
  ]);
  const total = parseInt(countResult.rows[0].count, 10);

  const offset = (page - 1) * limit;

  const result = await query(
    'SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [sellerId, limit, offset],
  );

  return {
    products: result.rows,
    total,
    page,
    limit,
  };
};

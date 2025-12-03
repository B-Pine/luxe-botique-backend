import bcrypt from 'bcryptjs';
import pool from './config/database';

const seedDatabase = async () => {
  console.log('Seeding database...');

  try {
    // Create default seller
    const passwordHash = await bcrypt.hash('admin123', 10);

    const sellerResult = await pool.query(
      `INSERT INTO sellers (email, password_hash, name) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id`,
      ['admin@luxeboutique.com', passwordHash, 'Luxe Admin'],
    );

    const sellerId = sellerResult.rows[0]?.id;
    if (!sellerId) {
      throw new Error('Failed to create or retrieve seller');
    }
    console.log('✓ Default seller created with ID:', sellerId);

    // Insert sample products
    const products = [
      {
        name: 'Silk Wrap Dress',
        price: 189,
        category: 'Dresses',
        description: 'Elegant silk wrap dress perfect for any occasion',
        image_url: 'https://images.unsplash.com/photo-1595777707802-21b287d3e86d?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Blush', 'Navy', 'Emerald'],
      },
      {
        name: 'Cashmere Sweater',
        price: 249,
        category: 'Knitwear',
        description: 'Luxurious cashmere sweater for ultimate comfort',
        image_url: 'https://images.unsplash.com/photo-1582033432646-f0b341c6113e?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Cream', 'Charcoal', 'Camel'],
      },
      {
        name: 'Tailored Blazer',
        price: 279,
        category: 'Outerwear',
        description: 'Perfectly tailored blazer for a polished look',
        image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Burgundy'],
      },
      {
        name: 'Leather Handbag',
        price: 349,
        category: 'Accessories',
        description: 'Premium leather handbag with elegant design',
        image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
        sizes: [],
        colors: ['Black', 'Brown', 'Cognac'],
      },
      {
        name: 'Satin Blouse',
        price: 134,
        category: 'Dresses',
        description: 'Luxurious satin blouse for everyday elegance',
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Ivory', 'Blush', 'Sage'],
      },
      {
        name: 'Wide Leg Trousers',
        price: 179,
        category: 'Outerwear',
        description: 'Comfortable and stylish wide-leg trousers',
        image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Beige', 'Navy'],
      },
      {
        name: 'Evening Gown',
        price: 589,
        category: 'Dresses',
        description: 'Stunning evening gown for special occasions',
        image_url: 'https://images.unsplash.com/photo-1564690721039-d0a5c4a5b9f5?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Gold', 'Burgundy'],
      },
      {
        name: 'Pleated Midi Skirt',
        price: 159,
        category: 'Dresses',
        description: 'Elegant pleated midi skirt for a sophisticated look',
        image_url: 'https://images.unsplash.com/photo-1606777261328-c800edd1e5a7?w=400',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Gray', 'Cream', 'Black'],
      },
    ];

    for (const product of products) {
      // Convert arrays to PostgreSQL format: {"item1","item2"}
      const sizesArray = product.sizes.length > 0 ? `{${product.sizes.map(s => `"${s}"`).join(',')}}` : '{}';
      const colorsArray = product.colors.length > 0 ? `{${product.colors.map(c => `"${c}"`).join(',')}}` : '{}';
      
      await pool.query(
        `INSERT INTO products (seller_id, name, description, price, category, image_url, sizes, colors)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          sellerId,
          product.name,
          product.description,
          product.price,
          product.category,
          product.image_url,
          sizesArray,
          colorsArray,
        ],
      );
    }

    console.log(`✓ ${products.length} sample products inserted`);

    // Insert sample orders
    const orderData = [
      {
        id: 'ORD-001',
        customer_name: 'Sarah Johnson',
        customer_phone: '+1 234-567-8900',
        delivery_address: '123 Main St, New York, NY 10001',
        total_amount: 567.89,
        status: 'delivered',
        courier_company: 'FedEx',
        courier_tracking: 'FX123456789',
      },
      {
        id: 'ORD-002',
        customer_name: 'Emma Wilson',
        customer_phone: '+1 345-678-9012',
        delivery_address: '456 Oak Ave, Los Angeles, CA 90001',
        total_amount: 289.50,
        status: 'shipped',
        courier_company: 'UPS',
        courier_tracking: 'UP987654321',
      },
      {
        id: 'ORD-003',
        customer_name: 'Jessica Davis',
        customer_phone: '+1 456-789-0123',
        delivery_address: '789 Pine Rd, Chicago, IL 60601',
        total_amount: 145.25,
        status: 'processing',
        courier_company: null,
        courier_tracking: null,
      },
      {
        id: 'ORD-004',
        customer_name: 'Rachel Martinez',
        customer_phone: '+1 567-890-1234',
        delivery_address: '321 Elm St, Houston, TX 77001',
        total_amount: 423.75,
        status: 'pending',
        courier_company: null,
        courier_tracking: null,
      },
    ];

    for (const order of orderData) {
      await pool.query(
        `INSERT INTO orders (id, customer_name, customer_phone, delivery_address, total_amount, status, courier_company, courier_tracking)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          order.id,
          order.customer_name,
          order.customer_phone,
          order.delivery_address,
          order.total_amount,
          order.status,
          order.courier_company,
          order.courier_tracking,
        ],
      );
    }

    console.log(`✓ ${orderData.length} sample orders inserted`);

    console.log('✓ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

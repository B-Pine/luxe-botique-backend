import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Luxe Boutique API',
      version: '1.0.0',
      description: 'Complete REST API for Luxe Boutique e-commerce platform with product management, order handling, and file uploads',
      contact: {
        name: 'Luxe Boutique',
        url: 'https://luxeboutique.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://api.luxeboutique.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token. Obtain via POST /api/auth/seller/login',
        },
      },
      schemas: {
        Seller: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'seller@example.com',
            },
            name: {
              type: 'string',
              example: 'John Seller',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            seller_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'Silk Wrap Dress',
            },
            description: {
              type: 'string',
              example: 'Elegant silk wrap dress for any occasion',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 189.99,
            },
            category: {
              type: 'string',
              example: 'Dresses',
            },
            image_url: {
              type: 'string',
              format: 'uri',
            },
            sizes: {
              type: 'array',
              items: { type: 'string' },
              example: ['XS', 'S', 'M', 'L', 'XL'],
            },
            colors: {
              type: 'array',
              items: { type: 'string' },
              example: ['Black', 'White', 'Blue'],
            },
            in_stock: {
              type: 'boolean',
              example: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'ORD-1701617600000',
            },
            customer_name: {
              type: 'string',
              example: 'Jane Smith',
            },
            customer_phone: {
              type: 'string',
              example: '+234 801 234 5678',
            },
            delivery_address: {
              type: 'string',
              example: '123 Main Street, Lagos',
            },
            total_amount: {
              type: 'number',
              format: 'decimal',
              example: 499.99,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered'],
              example: 'processing',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
            courier_name: {
              type: 'string',
              nullable: true,
              example: 'DHL',
            },
            courier_phone: {
              type: 'string',
              nullable: true,
              example: '+234 700 000 0001',
            },
            tracking_number: {
              type: 'string',
              nullable: true,
              example: 'DHL123456789',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            order_id: {
              type: 'string',
            },
            product_id: {
              type: 'string',
              format: 'uuid',
            },
            product_name: {
              type: 'string',
              example: 'Silk Wrap Dress',
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            size: {
              type: 'string',
              nullable: true,
              example: 'M',
            },
            color: {
              type: 'string',
              nullable: true,
              example: 'Black',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 189.99,
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            seller: {
              $ref: '#/components/schemas/Seller',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'object',
            },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: { type: 'array' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/swagger-docs.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;

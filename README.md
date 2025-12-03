# Luxe Boutique Backend API

A full-featured backend API for the Luxe Boutique e-commerce platform built with Node.js, Express, and PostgreSQL.

## Features

- ✅ Seller authentication with JWT tokens
- ✅ Product catalog management (CRUD operations)
- ✅ Order management and tracking
- ✅ Order status updates and courier tracking
- ✅ Database migrations and seeding
- ✅ Type-safe with TypeScript
- ✅ Comprehensive error handling
- ✅ CORS support for frontend integration

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- A running PostgreSQL server

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secrets:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/luxe_boutique_dev
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=5000
FRONTEND_URL=http://localhost:8081
```

### 3. Create Database

Create a PostgreSQL database:

```bash
createdb luxe_boutique_dev
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Sample Data

```bash
npm run seed
```

Or run both in sequence:

```bash
npm run setup
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Production Build

Build TypeScript to JavaScript:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/seller/login` - Seller login
- `POST /api/auth/seller/register` - Create new seller account
- `POST /api/auth/seller/refresh-token` - Refresh access token
- `GET /api/auth/seller/profile` - Get seller profile (protected)

### Products

- `GET /api/products` - List all products (pagination, search, filter by category)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (protected, multipart form-data)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `GET /api/products/seller/:sellerId/products` - Get seller's products

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - List seller's orders (protected)
- `PATCH /api/orders/:id/status` - Update order status (protected)
- `PATCH /api/orders/:id/courier` - Update courier tracking info (protected)
- `GET /api/orders/seller/stats` - Get order statistics (protected)

## Response Format

All endpoints return a standardized JSON response:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Customer name is required",
    "details": [...]
  }
}
```

## Authentication

Protected endpoints require an Authorization header with a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Schema

### Sellers Table
- id (UUID)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Products Table
- id (UUID)
- seller_id (UUID, FK to sellers)
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- category (VARCHAR)
- image_url (VARCHAR)
- gallery_urls (TEXT[])
- sizes (TEXT[])
- colors (TEXT[])
- in_stock (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Orders Table
- id (VARCHAR, PRIMARY KEY) - Format: ORD-{timestamp}
- customer_name (VARCHAR)
- customer_phone (VARCHAR)
- delivery_address (TEXT)
- delivery_notes (TEXT)
- total_amount (DECIMAL)
- payment_proof_url (VARCHAR)
- status (VARCHAR) - pending, processing, shipped, delivered
- courier_company (VARCHAR)
- courier_tracking (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Order Items Table
- id (UUID)
- order_id (VARCHAR, FK to orders)
- product_id (UUID, FK to products)
- product_name (VARCHAR)
- quantity (INT)
- size (VARCHAR)
- color (VARCHAR)
- price (DECIMAL)
- created_at (TIMESTAMP)

## Default Credentials

For testing, the seed script creates a default seller account:

- **Email**: admin@luxeboutique.com
- **Password**: admin123

Change these credentials in production!

## Error Handling

The API uses custom error classes for consistent error responses:

- `ValidationError` (400) - Invalid request data
- `AuthenticationError` (401) - Missing or invalid authentication
- `AuthorizationError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource already exists
- `InternalServerError` (500) - Unexpected server error

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | - | PostgreSQL connection string |
| JWT_SECRET | - | Secret key for signing access tokens |
| JWT_REFRESH_SECRET | - | Secret key for signing refresh tokens |
| JWT_EXPIRY | 15m | Access token expiration time |
| REFRESH_TOKEN_EXPIRY | 7d | Refresh token expiration time |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment (development/production) |
| FRONTEND_URL | http://localhost:8081 | Frontend origin for CORS |
| CLOUDINARY_CLOUD_NAME | - | Cloudinary cloud name for image uploads |
| CLOUDINARY_API_KEY | - | Cloudinary API key |
| CLOUDINARY_API_SECRET | - | Cloudinary API secret |

## File Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Business logic
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── app.ts          # Express app setup
│   ├── index.ts        # Server entry point
│   ├── migrate.ts      # Database migration runner
│   └── seed.ts         # Database seeding script
├── migrations/         # SQL migration files
├── .env                # Environment variables
├── .env.example        # Example environment file
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Next Steps

- [ ] Add file upload endpoints with Cloudinary integration
- [ ] Implement email notifications for orders
- [ ] Add comprehensive API documentation with Swagger
- [ ] Write unit and integration tests
- [ ] Set up GitHub Actions CI/CD pipeline
- [ ] Deploy to production environment

## License

ISC

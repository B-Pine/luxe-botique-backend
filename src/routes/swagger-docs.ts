/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Health check endpoints
 *   - name: Authentication
 *     description: Seller authentication (login, register, token refresh)
 *   - name: Products
 *     description: Product management (CRUD operations)
 *   - name: Orders
 *     description: Order management and tracking
 *   - name: File Upload
 *     description: Upload product images and payment proofs to Railways
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if the API is running
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/auth/seller/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Seller login
 *     description: Authenticate seller with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@luxeboutique.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     seller:
 *                       $ref: '#/components/schemas/Seller'
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/seller/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Seller registration
 *     description: Create a new seller account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seller created successfully
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/auth/seller/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 */

/**
 * @swagger
 * /api/auth/seller/profile:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get seller profile
 *     description: Retrieve authenticated seller's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Seller profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Seller'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Retrieve all products with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Products list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *   post:
 *     tags:
 *       - Products
 *     summary: Create product
 *     description: Create a new product (seller only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image_url:
 *                 type: string
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *   put:
 *     tags:
 *       - Products
 *     summary: Update product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete product
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get seller orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Orders list
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - customer_phone
 *               - delivery_address
 *               - items
 *               - total_amount
 *             properties:
 *               customer_name:
 *                 type: string
 *               customer_phone:
 *                 type: string
 *               delivery_address:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     price:
 *                       type: number
 *               total_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *   put:
 *     tags:
 *       - Orders
 *     summary: Update order status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered]
 *               courier_name:
 *                 type: string
 *               courier_phone:
 *                 type: string
 *               tracking_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload product image
 *     description: Upload a product image to Railways S3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - productId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: https://s3.amazonaws.com/bucket/products/id/file.jpg
 *                     fileName:
 *                       type: string
 *                     fileSize:
 *                       type: integer
 *                     mimeType:
 *                       type: string
 *       400:
 *         description: Invalid file or missing productId
 */

/**
 * @swagger
 * /api/upload/payment-proof:
 *   post:
 *     tags:
 *       - File Upload
 *     summary: Upload payment proof
 *     description: Upload a payment proof (image or PDF) to Railways S3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - orderId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment proof uploaded successfully
 *       400:
 *         description: Invalid file or missing orderId
 */

export default {};

import { Router, Response } from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const router = Router();

// Public endpoints
router.get(
  '/',
  asyncHandler(async (req: any, res: Response) => {
    const { search, category, page = 1, limit = 20 } = req.query;

    const result = await productController.getProducts(search, category, parseInt(page), parseInt(limit));

    const response: ApiResponse<any> = {
      success: true,
      data: { products: result.products },
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        },
      },
    };

    res.json(response);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: any, res: Response) => {
    const product = await productController.getProductById(req.params.id);

    const response: ApiResponse<any> = {
      success: true,
      data: product,
    };

    res.json(response);
  }),
);

// Protected endpoints (seller only)
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productController.createProduct(req.seller!.id, req.body);

    const response: ApiResponse<any> = {
      success: true,
      data: product,
    };

    res.status(201).json(response);
  }),
);

router.put(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const product = await productController.updateProduct(req.params.id, req.seller!.id, req.body);

    const response: ApiResponse<any> = {
      success: true,
      data: product,
    };

    res.json(response);
  }),
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await productController.deleteProduct(req.params.id, req.seller!.id);

    const response: ApiResponse<null> = {
      success: true,
    };

    res.json(response);
  }),
);

// Get seller's products
router.get(
  '/seller/:sellerId/products',
  asyncHandler(async (req: any, res: Response) => {
    const { page = 1, limit = 20 } = req.query;

    const result = await productController.getSellerProducts(
      req.params.sellerId,
      parseInt(page),
      parseInt(limit),
    );

    const response: ApiResponse<any> = {
      success: true,
      data: { products: result.products },
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        },
      },
    };

    res.json(response);
  }),
);

export default router;

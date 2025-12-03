import { Router, Response } from 'express';
import * as orderController from '../controllers/orderController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const router = Router();

// Public endpoints
router.post(
  '/',
  asyncHandler(async (req: any, res: Response) => {
    const order = await orderController.createOrder(req.body);

    const response: ApiResponse<any> = {
      success: true,
      data: order,
    };

    res.status(201).json(response);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: any, res: Response) => {
    const order = await orderController.getOrderById(req.params.id);

    const response: ApiResponse<any> = {
      success: true,
      data: order,
    };

    res.json(response);
  }),
);

// Protected endpoints (seller only)
router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, search, page, limit } = req.query;

    const result = await orderController.getSellerOrders(
      req.seller!.id,
      status as string | undefined,
      search as string | undefined,
      parseInt((page as string) || '1'),
      parseInt((limit as string) || '20'),
    );

    const response: ApiResponse<any> = {
      success: true,
      data: { orders: result.orders },
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

router.patch(
  '/:id/status',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const order = await orderController.updateOrderStatus(req.params.id, status);

    const response: ApiResponse<any> = {
      success: true,
      data: order,
    };

    res.json(response);
  }),
);

router.patch(
  '/:id/courier',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { courierCompany, courierTracking } = req.body;
    const order = await orderController.updateOrderCourier(
      req.params.id,
      courierCompany,
      courierTracking,
    );

    const response: ApiResponse<any> = {
      success: true,
      data: order,
    };

    res.json(response);
  }),
);

router.get(
  '/seller/stats',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await orderController.getOrderStats(req.seller!.id);

    const response: ApiResponse<any> = {
      success: true,
      data: stats,
    };

    res.json(response);
  }),
);

export default router;

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';
import { Response } from 'express';

const router = Router();

router.post(
  '/seller/login',
  asyncHandler(async (req: any, res: Response) => {
    const { email, password } = req.body;

    const result = await authController.sellerLogin(email, password);

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    res.json(response);
  }),
);

router.post(
  '/seller/register',
  asyncHandler(async (req: any, res: Response) => {
    const { email, password, name } = req.body;

    const result = await authController.sellerRegister(email, password, name);

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    res.status(201).json(response);
  }),
);

router.post(
  '/seller/refresh-token',
  asyncHandler(async (req: any, res: Response) => {
    const { refreshToken } = req.body;

    const result = await authController.refreshAccessToken(refreshToken);

    const response: ApiResponse<any> = {
      success: true,
      data: result,
    };

    res.json(response);
  }),
);

router.get(
  '/seller/profile',
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const profile = await authController.getSellerProfile(req.seller!.id);

    const response: ApiResponse<any> = {
      success: true,
      data: profile,
    };

    res.json(response);
  }),
);

export default router;

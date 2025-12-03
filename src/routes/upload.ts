import { Router, Request, Response } from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler';
import * as uploadController from '../controllers/uploadController';
import { ApiResponse } from '../types';

const router = Router();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

/**
 * POST /api/upload/image
 * Upload product image
 * No authentication required
 */
router.post(
  '/image',
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Product ID is required',
        },
      });
    }

    const result = await uploadController.uploadProductImage(req.file!, productId);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      },
    };

    res.json(response);
  }),
);

/**
 * POST /api/upload/payment-proof
 * Upload payment proof for an order
 * No authentication required
 */
router.post(
  '/payment-proof',
  upload.single('file'),
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Order ID is required',
        },
      });
    }

    const result = await uploadController.uploadPaymentProof(req.file!, orderId);

    const response: ApiResponse<any> = {
      success: true,
      data: {
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      },
    };

    res.json(response);
  }),
);

export default router;

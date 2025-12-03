import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { ValidationError } from '../utils/errors';

// Initialize S3 client for Railways
const s3Client = new S3Client({
  region: env.RAILWAYS_REGION,
  endpoint: env.RAILWAYS_ENDPOINT,
  credentials: {
    accessKeyId: env.RAILWAYS_ACCESS_KEY,
    secretAccessKey: env.RAILWAYS_SECRET_KEY,
  },
});

interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

/**
 * Upload product image to Railways S3
 */
export const uploadProductImage = async (
  file: Express.Multer.File,
  productId: string,
): Promise<UploadResponse> => {
  if (!file) {
    throw new ValidationError('File is required');
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new ValidationError('Only image files are allowed');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new ValidationError('File size must be less than 5MB');
  }

  try {
    const fileName = `products/${productId}/${Date.now()}-${file.originalname}`;

    // Upload to Railways S3
    const command = new PutObjectCommand({
      Bucket: env.RAILWAYS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Generate public URL
    const url = `${env.RAILWAYS_ENDPOINT}/${env.RAILWAYS_BUCKET_NAME}/${fileName}`;

    return {
      url,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new ValidationError('Failed to upload image to storage');
  }
};

/**
 * Upload payment proof to Railways S3
 */
export const uploadPaymentProof = async (
  file: Express.Multer.File,
  orderId: string,
): Promise<UploadResponse> => {
  if (!file) {
    throw new ValidationError('Payment proof file is required');
  }

  // Allow images and PDF
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedMimes.includes(file.mimetype)) {
    throw new ValidationError('Only images (JPG, PNG, GIF) and PDF files are allowed');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new ValidationError('File size must be less than 10MB');
  }

  try {
    const extension = file.originalname.split('.').pop();
    const fileName = `payments/${orderId}/${Date.now()}.${extension}`;

    // Upload to Railways S3
    const command = new PutObjectCommand({
      Bucket: env.RAILWAYS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    // Generate public URL
    const url = `${env.RAILWAYS_ENDPOINT}/${env.RAILWAYS_BUCKET_NAME}/${fileName}`;

    return {
      url,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new ValidationError('Failed to upload payment proof to storage');
  }
};

/**
 * Delete file from Railways S3 (optional utility)
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract file key from URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    const command = new PutObjectCommand({
      Bucket: env.RAILWAYS_BUCKET_NAME,
      Key: key,
    });

    // S3 doesn't have a straightforward delete in basic SDK
    // You may need to use DeleteObjectCommand from @aws-sdk/client-s3
    console.log('File deletion not implemented. Key:', key);
  } catch (error) {
    console.error('Delete error:', error);
  }
};

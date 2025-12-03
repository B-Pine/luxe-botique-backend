import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';
import { Seller } from '../types';

const SALT_ROUNDS = 10;

export const sellerLogin = async (
  email: string,
  password: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  seller: { id: string; email: string; name: string };
}> => {
  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find seller by email
  const result = await query('SELECT * FROM sellers WHERE email = $1', [email.toLowerCase()]);

  if (result.rows.length === 0) {
    throw new AuthenticationError('Invalid email or password');
  }

  const seller: Seller = result.rows[0];

  // Verify password
  const passwordMatch = await bcrypt.compare(password, seller.password_hash);

  if (!passwordMatch) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    id: seller.id,
    email: seller.email,
    name: seller.name,
  });

  const refreshToken = generateRefreshToken({
    id: seller.id,
    email: seller.email,
    name: seller.name,
  });

  return {
    accessToken,
    refreshToken,
    seller: {
      id: seller.id,
      email: seller.email,
      name: seller.name,
    },
  };
};

export const sellerRegister = async (
  email: string,
  password: string,
  name: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  seller: { id: string; email: string; name: string };
}> => {
  // Validate input
  if (!email || !password || !name) {
    throw new ValidationError('Email, password, and name are required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  // Check if seller already exists
  const existingResult = await query('SELECT id FROM sellers WHERE email = $1', [
    email.toLowerCase(),
  ]);

  if (existingResult.rows.length > 0) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create seller
  const result = await query(
    'INSERT INTO sellers (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
    [email.toLowerCase(), passwordHash, name],
  );

  const seller = result.rows[0];

  // Generate tokens
  const accessToken = generateAccessToken({
    id: seller.id,
    email: seller.email,
    name: seller.name,
  });

  const refreshToken = generateRefreshToken({
    id: seller.id,
    email: seller.email,
    name: seller.name,
  });

  return {
    accessToken,
    refreshToken,
    seller: {
      id: seller.id,
      email: seller.email,
      name: seller.name,
    },
  };
};

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken({
      id: payload.id,
      email: payload.email,
      name: payload.name,
    });

    return { accessToken };
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
};

export const getSellerProfile = async (
  sellerId: string,
): Promise<{ id: string; email: string; name: string; createdAt: string }> => {
  const result = await query('SELECT id, email, name, created_at FROM sellers WHERE id = $1', [
    sellerId,
  ]);

  if (result.rows.length === 0) {
    throw new NotFoundError('Seller');
  }

  const seller = result.rows[0];

  return {
    id: seller.id,
    email: seller.email,
    name: seller.name,
    createdAt: seller.created_at,
  };
};

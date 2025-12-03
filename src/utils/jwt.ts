import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload } from '../types';

const jwtSecret = env.JWT_SECRET;
const jwtRefreshSecret = env.JWT_REFRESH_SECRET;

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, jwtSecret, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, jwtSecret) as AuthPayload;
};

export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, jwtRefreshSecret) as AuthPayload;
};

export const decodeToken = (token: string): AuthPayload | null => {
  try {
    return jwt.decode(token) as AuthPayload;
  } catch {
    return null;
  }
};

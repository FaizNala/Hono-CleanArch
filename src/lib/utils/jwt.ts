import { sign, verify } from 'hono/jwt';
import type { JWTPayload } from '../../core/domain/auth.entity.js';

/**
 * JWT Utility functions
 */

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

function parseExpiresIn(expiresIn: string): number {
  // Mendukung format: '1h', '24h', '7d', '30m', dst
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 24 * 60 * 60; // default 24 jam
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 24 * 60 * 60;
  }
}

export async function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresInSec = parseExpiresIn(JWT_EXPIRES_IN);
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  };
  return await sign(jwtPayload, JWT_SECRET);
}

export function getJWTSecret(): string {
  return JWT_SECRET;
}
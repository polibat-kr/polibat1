import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * JWT Payload 타입
 */
export interface TokenPayload {
  userId: string;
  memberId: string;
  email: string;
  memberType: 'NORMAL' | 'POLITICIAN' | 'ASSISTANT' | 'ADMIN';
  status: 'APPROVED' | 'PENDING' | 'WITHDRAWN' | 'SUSPENDED' | 'BANNED';
}

/**
 * JWT 토큰 생성 및 검증 유틸리티
 */
export class JwtUtil {
  /**
   * Access Token 생성 (15분)
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      issuer: 'polibat-api',
      audience: 'polibat-client',
    });
  }

  /**
   * Refresh Token 생성 (7일)
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
      issuer: 'polibat-api',
      audience: 'polibat-client',
    });
  }

  /**
   * Access Token 검증
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        issuer: 'polibat-api',
        audience: 'polibat-client',
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('TOKEN_INVALID');
      }
      throw new Error('TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * Refresh Token 검증
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
        issuer: 'polibat-api',
        audience: 'polibat-client',
      }) as TokenPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('REFRESH_TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('REFRESH_TOKEN_INVALID');
      }
      throw new Error('REFRESH_TOKEN_VERIFICATION_FAILED');
    }
  }

  /**
   * 토큰에서 Payload 추출 (검증 없이)
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.decode(token) as TokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * 토큰 만료 시간 확인
   */
  static getTokenExpiration(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !('exp' in decoded)) return null;
    return new Date((decoded as any).exp * 1000);
  }
}

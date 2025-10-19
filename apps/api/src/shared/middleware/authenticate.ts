import { Request, Response, NextFunction } from 'express';
import { JwtUtil, TokenPayload } from '../utils/jwt';
import { ApiError } from './error-handler';
import { ERROR_CODES } from '../utils/error-codes';
import { MemberType, MemberStatus } from '@prisma/client';

/**
 * Request 타입 확장 (user 속성 추가)
 */
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 JWT 토큰 추출 및 검증
 */
export const authenticateJwt = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    // 1. Authorization 헤더 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ApiError(401, '인증 토큰이 제공되지 않았습니다.', ERROR_CODES.TOKEN_MISSING);
    }

    // 2. Bearer 토큰 형식 확인
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new ApiError(401, '잘못된 토큰 형식입니다.', ERROR_CODES.TOKEN_INVALID);
    }

    const token = parts[1];

    // 3. JWT 토큰 검증
    let payload: TokenPayload;
    try {
      payload = JwtUtil.verifyAccessToken(token);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'TOKEN_EXPIRED') {
          throw new ApiError(401, 'Access Token이 만료되었습니다.', ERROR_CODES.TOKEN_EXPIRED);
        }
        if (error.message === 'TOKEN_INVALID') {
          throw new ApiError(401, '유효하지 않은 토큰입니다.', ERROR_CODES.TOKEN_INVALID);
        }
      }
      throw new ApiError(401, '토큰 검증에 실패했습니다.', ERROR_CODES.TOKEN_VERIFICATION_FAILED);
    }

    // 4. Request 객체에 사용자 정보 추가
    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 선택적 JWT 인증 미들웨어
 * 토큰이 있으면 검증하고, 없으면 통과
 */
export const optionalAuthenticateJwt = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // 토큰이 없으면 통과
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      // 잘못된 형식이면 통과
      return next();
    }

    const token = parts[1];

    try {
      const payload = JwtUtil.verifyAccessToken(token);
      req.user = payload;
    } catch {
      // 검증 실패 시 통과
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 회원 상태 검증 미들웨어
 * @param allowedStatuses 허용할 회원 상태 목록
 */
export const requireMemberStatus = (...allowedStatuses: MemberStatus[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, '인증이 필요합니다.', ERROR_CODES.UNAUTHORIZED);
      }

      if (!allowedStatuses.includes(req.user.status)) {
        throw new ApiError(403, '접근 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 회원 유형 검증 미들웨어
 * @param allowedTypes 허용할 회원 유형 목록
 */
export const requireMemberType = (...allowedTypes: MemberType[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, '인증이 필요합니다.', ERROR_CODES.UNAUTHORIZED);
      }

      if (!allowedTypes.includes(req.user.memberType)) {
        throw new ApiError(403, '접근 권한이 없습니다.', ERROR_CODES.FORBIDDEN);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 관리자 권한 검증 미들웨어
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new ApiError(401, '인증이 필요합니다.', ERROR_CODES.UNAUTHORIZED);
    }

    if (req.user.memberType !== 'ADMIN') {
      throw new ApiError(403, '관리자만 접근 가능합니다.', ERROR_CODES.FORBIDDEN);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 정치인 권한 검증 미들웨어
 */
export const requirePolitician = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new ApiError(401, '인증이 필요합니다.', ERROR_CODES.UNAUTHORIZED);
    }

    if (req.user.memberType !== 'POLITICIAN' && req.user.memberType !== 'ASSISTANT') {
      throw new ApiError(403, '정치인 또는 보좌관만 접근 가능합니다.', ERROR_CODES.FORBIDDEN);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 본인 확인 미들웨어
 * @param paramName URL 파라미터 이름 (기본값: 'userId')
 */
export const requireSelf = (paramName: string = 'userId') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError(401, '인증이 필요합니다.', ERROR_CODES.UNAUTHORIZED);
      }

      const targetUserId = req.params[paramName];
      if (req.user.userId !== targetUserId) {
        // 관리자는 모든 사용자 접근 가능
        if (req.user.memberType !== 'ADMIN') {
          throw new ApiError(403, '본인만 접근 가능합니다.', ERROR_CODES.FORBIDDEN);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

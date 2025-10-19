import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errorCode?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 전역 에러 핸들러 미들웨어
 *
 * @description
 * - API 에러, Zod 검증 에러, Prisma 에러 처리
 * - 개발/프로덕션 환경별 에러 응답 구성
 * - 표준화된 에러 응답 형식
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // 1. ApiError (커스텀 에러)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode || 'API_ERROR',
        message: err.message,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Zod 검증 에러
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력값 검증에 실패했습니다.',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Prisma 에러
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_ERROR',
          message: '이미 존재하는 데이터입니다.',
          details: {
            fields: err.meta?.target,
          },
        },
        timestamp: new Date().toISOString(),
      });
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '요청한 데이터를 찾을 수 없습니다.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 4. 기타 서버 에러
  console.error('❌ Unhandled Error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? '서버 오류가 발생했습니다.'
          : err.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * 404 Not Found 핸들러
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    },
    timestamp: new Date().toISOString(),
  });
}

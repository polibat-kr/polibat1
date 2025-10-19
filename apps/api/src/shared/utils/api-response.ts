import { Response } from 'express';

/**
 * 표준 API 응답 인터페이스
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

/**
 * 성공 응답 생성
 *
 * @param res - Express Response 객체
 * @param data - 응답 데이터
 * @param statusCode - HTTP 상태 코드 (기본: 200)
 */
export function successResponse<T>(
  res: Response,
  data: T,
  statusCode = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  } as ApiResponse<T>);
}

/**
 * 페이지네이션 포함 성공 응답 생성
 *
 * @param res - Express Response 객체
 * @param data - 응답 데이터 배열
 * @param pagination - 페이지네이션 정보
 */
export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): Response {
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages,
    },
    timestamp: new Date().toISOString(),
  } as ApiResponse<T[]>);
}

/**
 * 생성 성공 응답 (201 Created)
 *
 * @param res - Express Response 객체
 * @param data - 생성된 데이터
 */
export function createdResponse<T>(res: Response, data: T): Response {
  return successResponse(res, data, 201);
}

/**
 * 삭제 성공 응답 (204 No Content)
 *
 * @param res - Express Response 객체
 */
export function deletedResponse(res: Response): Response {
  return res.status(204).send();
}

/**
 * 에러 응답 생성
 *
 * @param res - Express Response 객체
 * @param statusCode - HTTP 상태 코드
 * @param code - 에러 코드
 * @param message - 에러 메시지
 * @param details - 추가 에러 상세 정보
 */
export function errorResponse(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  } as ApiResponse);
}

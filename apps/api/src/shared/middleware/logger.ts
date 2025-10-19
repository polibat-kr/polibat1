import { Request, Response, NextFunction } from 'express';

/**
 * 요청 로깅 미들웨어
 *
 * @description
 * - 모든 HTTP 요청 로깅
 * - 요청 시간, 메서드, URL, 상태 코드, 응답 시간 기록
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  // 응답 완료 시 로그 출력
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // 색상 코드 (터미널 출력용)
    const statusColor =
      statusCode >= 500
        ? '\x1b[31m' // Red (5xx)
        : statusCode >= 400
          ? '\x1b[33m' // Yellow (4xx)
          : statusCode >= 300
            ? '\x1b[36m' // Cyan (3xx)
            : '\x1b[32m'; // Green (2xx)

    const resetColor = '\x1b[0m';

    console.log(
      `${new Date().toISOString()} | ` +
        `${statusColor}${statusCode}${resetColor} | ` +
        `${req.method.padEnd(6)} | ` +
        `${req.originalUrl.padEnd(50)} | ` +
        `${duration}ms`
    );
  });

  next();
}

/**
 * 에러 로깅 미들웨어
 *
 * @description
 * - 에러 발생 시 상세 정보 로깅
 * - 개발 환경에서는 스택 트레이스 포함
 */
export function errorLogger(
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
) {
  console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Error occurred:');
  console.error('Time:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('Body:', JSON.stringify(req.body, null, 2));
  console.error('Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }

  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  next(err);
}

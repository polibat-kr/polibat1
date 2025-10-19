import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from '../shared/config/env';
import { requestLogger, errorLogger } from '../shared/middleware/logger';
import {
  errorHandler,
  notFoundHandler,
} from '../shared/middleware/error-handler';
import { healthRoutes } from '../features/health';
import { authRoutes } from '../features/auth';
import { memberRoutes } from '../features/member';

/**
 * Express 애플리케이션 생성 및 설정
 *
 * @description
 * - 보안 미들웨어 (Helmet)
 * - CORS 설정
 * - Rate Limiting
 * - Body Parser
 * - 로깅 미들웨어
 * - 라우트 등록
 * - 에러 핸들링
 */
export function createApp(): Application {
  const app = express();

  // 1. 로깅 미들웨어 (요청 로그)
  app.use(requestLogger);

  // 2. 보안 미들웨어
  app.use(helmet());

  // 3. CORS 설정
  const allowedOrigins = env.CORS_ORIGIN.split(',');

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 4. Rate Limiting (API 엔드포인트에만 적용)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', limiter);

  // 5. Body Parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. 라우트 등록
  app.use('/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/members', memberRoutes);

  // API 버전 확인
  app.get('/api', (_req, res) => {
    res.json({
      name: '정치방망이 API',
      version: '1.0.0',
      description: 'PoliBAT Backend API Server',
      environment: env.NODE_ENV,
    });
  });

  // 7. 404 핸들러 (라우트가 없는 경우)
  app.use(notFoundHandler);

  // 8. 에러 로깅 미들웨어
  app.use(errorLogger);

  // 9. 전역 에러 핸들러 (마지막에 등록)
  app.use(errorHandler);

  return app;
}

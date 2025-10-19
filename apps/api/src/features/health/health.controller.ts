import { Request, Response } from 'express';
import { successResponse } from '../../shared/utils/api-response';
import { prisma } from '../../core/database';

/**
 * Health Check 컨트롤러
 */
export class HealthController {
  /**
   * 기본 Health Check
   *
   * @description
   * - 서버 상태 확인
   * - Uptime 정보
   */
  static async getHealth(_req: Request, res: Response) {
    return successResponse(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  }

  /**
   * 상세 Health Check (데이터베이스 연결 확인 포함)
   *
   * @description
   * - 서버 상태 + 데이터베이스 연결 확인
   * - 시스템 메모리 정보
   */
  static async getDetailedHealth(_req: Request, res: Response) {
    try {
      // 데이터베이스 연결 확인
      await prisma.$queryRaw`SELECT 1`;
      const dbStatus = 'connected';

      // 메모리 정보
      const memoryUsage = process.memoryUsage();

      return successResponse(res, {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: {
          status: dbStatus,
        },
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
      });
    } catch (error) {
      return res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: '서비스를 일시적으로 사용할 수 없습니다.',
          details: {
            database: 'disconnected',
          },
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

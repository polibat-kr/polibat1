import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './database';
import { redisClient } from './redis';
import { env } from '../shared/config/env';

/**
 * 서버 시작
 *
 * @description
 * - 데이터베이스 연결 확인
 * - Express 앱 시작
 * - Graceful Shutdown 처리
 */
async function startServer() {
  try {
    // 1. 환경 변수 확인
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 정치방망이(PoliBAT) API Server Starting...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📌 Environment: ${env.NODE_ENV}`);
    console.log(`📌 Port: ${env.PORT}`);
    console.log(`📌 CORS Origins: ${env.CORS_ORIGIN}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 2. 데이터베이스 연결
    await connectDatabase();

    // 3. Redis 연결 (옵션 - 실패해도 서버 시작)
    try {
      await redisClient.connect();
    } catch (error) {
      console.warn('⚠️  Redis 연결 실패 (서버는 계속 실행됩니다):', error);
    }

    // 4. Express 앱 생성 및 시작
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ Server is running!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 Server URL: http://localhost:${env.PORT}`);
      console.log(`🏥 Health Check: http://localhost:${env.PORT}/health`);
      console.log(`📚 API Info: http://localhost:${env.PORT}/api`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });

    // 5. Graceful Shutdown 처리
    const shutdown = async (signal: string) => {
      console.log(`\n\n⚠️  ${signal} received. Starting graceful shutdown...`);

      // 서버 종료 (새 연결 거부)
      server.close(async () => {
        console.log('✅ Server closed');

        // Redis 연결 해제
        if (redisClient.isReady()) {
          await redisClient.disconnect();
        }

        // 데이터베이스 연결 해제
        await disconnectDatabase();

        console.log('✅ Graceful shutdown completed\n');
        process.exit(0);
      });

      // 10초 후 강제 종료
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // 시그널 핸들러 등록
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Uncaught Exception 처리
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      shutdown('uncaughtException');
    });

    // Unhandled Rejection 처리
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('unhandledRejection');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();

export { startServer };

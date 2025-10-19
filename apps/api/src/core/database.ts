import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client 인스턴스
 *
 * @description
 * - 싱글톤 패턴으로 전역에서 재사용
 * - 개발 환경에서 로그 활성화
 * - 에러 로그 항상 활성화
 */
const prismaClientSingleton = () => {
  // Runtime에서 DATABASE_URL 명시적으로 설정
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });
};

// TypeScript용 전역 타입 선언
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 싱글톤 인스턴스 생성
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 개발 환경에서는 Hot Reload 시 인스턴스 재사용
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { prisma };

/**
 * 데이터베이스 연결 확인
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

/**
 * 데이터베이스 연결 해제
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
}

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// .env 파일 로드 (명시적 경로 지정)
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

console.log('📁 .env file path:', envPath);
console.log('🔌 DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No');

/**
 * 환경 변수 스키마 정의
 *
 * @description
 * - Zod를 사용한 환경 변수 검증
 * - 타입 안전성 보장
 * - 필수 환경 변수 체크
 */
const envSchema = z.object({
  // 서버 설정
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('4000').transform(Number),

  // 데이터베이스
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:8000'),
});

/**
 * 환경 변수 타입
 */
export type Env = z.infer<typeof envSchema>;

/**
 * 검증된 환경 변수
 */
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ 환경 변수 검증 실패:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };

/**
 * 환경별 설정 확인
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}

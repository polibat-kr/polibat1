/**
 * Redis 클라이언트 설정
 * 세션 관리 및 토큰 저장용
 */

import { createClient, RedisClientType } from 'redis';

class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  /**
   * Redis 연결 초기화
   */
  public async connect(): Promise<void> {
    if (this.isConnected && this.client) {
      console.log('✅ Redis already connected');
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            // 최대 10번 재연결 시도, 각 시도마다 1초씩 증가
            if (retries > 10) {
              console.error('❌ Redis 재연결 실패 (최대 재시도 초과)');
              return new Error('Redis 재연결 실패');
            }
            return retries * 1000; // 1초, 2초, 3초, ...
          },
        },
      });

      // 에러 핸들러
      this.client.on('error', (err) => {
        console.error('❌ Redis Error:', err);
      });

      this.client.on('connect', () => {
        console.log('🔄 Redis connecting...');
      });

      this.client.on('ready', () => {
        console.log('✅ Redis ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        console.log('⚠️ Redis disconnected');
        this.isConnected = false;
      });

      // 연결 시작
      await this.client.connect();
      console.log('✅ Redis connected successfully');
    } catch (error) {
      console.error('❌ Redis 연결 실패:', error);
      this.client = null;
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Redis 연결 종료
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
      this.isConnected = false;
      console.log('✅ Redis disconnected');
    }
  }

  /**
   * Redis 클라이언트 가져오기
   */
  public getClient(): RedisClientType {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis가 연결되지 않았습니다. connect()를 먼저 호출하세요.');
    }
    return this.client;
  }

  /**
   * Redis 연결 상태 확인
   */
  public isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  // ============================================
  // Refresh Token 관리
  // ============================================

  /**
   * Refresh Token 저장
   * @param userId 사용자 ID
   * @param refreshToken Refresh Token
   * @param expiresIn 만료 시간 (초)
   */
  public async saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresIn: number = 7 * 24 * 60 * 60 // 7일
  ): Promise<void> {
    const key = `refresh:${userId}`;
    await this.getClient().setEx(key, expiresIn, refreshToken);
  }

  /**
   * Refresh Token 조회
   * @param userId 사용자 ID
   * @returns Refresh Token 또는 null
   */
  public async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh:${userId}`;
    return await this.getClient().get(key);
  }

  /**
   * Refresh Token 삭제 (로그아웃)
   * @param userId 사용자 ID
   */
  public async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh:${userId}`;
    await this.getClient().del(key);
  }

  /**
   * Refresh Token 검증
   * @param userId 사용자 ID
   * @param refreshToken Refresh Token
   * @returns 유효 여부
   */
  public async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const storedToken = await this.getRefreshToken(userId);
    return storedToken === refreshToken;
  }

  // ============================================
  // Access Token 블랙리스트 (선택 사항)
  // ============================================

  /**
   * Access Token을 블랙리스트에 추가
   * @param token Access Token
   * @param expiresIn 남은 만료 시간 (초)
   */
  public async blacklistAccessToken(token: string, expiresIn: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.getClient().setEx(key, expiresIn, '1');
  }

  /**
   * Access Token이 블랙리스트에 있는지 확인
   * @param token Access Token
   * @returns 블랙리스트 여부
   */
  public async isAccessTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.getClient().get(key);
    return result !== null;
  }

  // ============================================
  // 캐싱 유틸리티
  // ============================================

  /**
   * 값 저장
   * @param key 키
   * @param value 값
   * @param expiresIn 만료 시간 (초, 선택)
   */
  public async set(key: string, value: string, expiresIn?: number): Promise<void> {
    if (expiresIn) {
      await this.getClient().setEx(key, expiresIn, value);
    } else {
      await this.getClient().set(key, value);
    }
  }

  /**
   * 값 조회
   * @param key 키
   * @returns 값 또는 null
   */
  public async get(key: string): Promise<string | null> {
    return await this.getClient().get(key);
  }

  /**
   * 값 삭제
   * @param key 키
   */
  public async delete(key: string): Promise<void> {
    await this.getClient().del(key);
  }

  /**
   * 만료 시간 설정
   * @param key 키
   * @param seconds 초
   */
  public async expire(key: string, seconds: number): Promise<void> {
    await this.getClient().expire(key, seconds);
  }

  /**
   * 키 존재 여부 확인
   * @param key 키
   * @returns 존재 여부
   */
  public async exists(key: string): Promise<boolean> {
    const result = await this.getClient().exists(key);
    return result === 1;
  }
}

// 싱글톤 인스턴스 export
export const redisClient = RedisClient.getInstance();

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { successResponse, createdResponse } from '../../shared/utils/api-response';
import {
  SignupRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  ChangePasswordRequestDto,
} from './auth.dto';

/**
 * Auth Controller
 * HTTP 요청 처리 및 응답 생성
 */
export class AuthController {
  /**
   * 회원가입
   * POST /api/auth/signup
   */
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: SignupRequestDto = req.body;
      const result = await AuthService.signup(data);
      createdResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 로그인
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginRequestDto = req.body;
      const result = await AuthService.login(data);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 로그아웃
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (userId) {
        await AuthService.logout(userId);
      }

      successResponse(res, { message: '로그아웃되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 토큰 갱신
   * POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken }: RefreshTokenRequestDto = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 현재 사용자 정보 조회
   * GET /api/auth/me
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // req.user는 JWT 미들웨어에서 설정됨
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new Error('User ID not found in request');
      }

      const result = await AuthService.getCurrentUser(userId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * 비밀번호 변경
   * POST /api/auth/change-password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new Error('User ID not found in request');
      }

      const { currentPassword, newPassword }: ChangePasswordRequestDto = req.body;
      await AuthService.changePassword(userId, currentPassword, newPassword);
      successResponse(res, { message: '비밀번호가 변경되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 비밀번호 찾기 (이메일 발송)
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: 이메일 발송 기능 구현
      successResponse(res, {
        message: '비밀번호 재설정 링크가 이메일로 발송되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 비밀번호 재설정
   * POST /api/auth/reset-password
   */
  static async resetPassword(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: 토큰 검증 및 비밀번호 재설정 구현
      successResponse(res, { message: '비밀번호가 재설정되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 이메일 인증
   * POST /api/auth/verify-email
   */
  static async verifyEmail(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: 이메일 인증 구현
      successResponse(res, { message: '이메일 인증이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
}

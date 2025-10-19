import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middleware/validator';
import { authenticateJwt } from '../../shared/middleware/authenticate';
import {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validation';

const router = Router();

/**
 * 회원가입
 * POST /api/auth/signup
 */
router.post('/signup', validate(signupSchema), AuthController.signup);

/**
 * 로그인
 * POST /api/auth/login
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * 로그아웃
 * POST /api/auth/logout
 * @requires JWT 인증
 */
router.post('/logout', authenticateJwt, AuthController.logout);

/**
 * 토큰 갱신
 * POST /api/auth/refresh
 */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);

/**
 * 현재 사용자 정보 조회
 * GET /api/auth/me
 * @requires JWT 인증
 */
router.get('/me', authenticateJwt, AuthController.getCurrentUser);

/**
 * 비밀번호 변경
 * POST /api/auth/change-password
 * @requires JWT 인증
 */
router.post('/change-password', authenticateJwt, validate(changePasswordSchema), AuthController.changePassword);

/**
 * 비밀번호 찾기
 * POST /api/auth/forgot-password
 */
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

/**
 * 비밀번호 재설정
 * POST /api/auth/reset-password
 */
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

/**
 * 이메일 인증
 * POST /api/auth/verify-email
 */
router.post('/verify-email', validate(verifyEmailSchema), AuthController.verifyEmail);

export default router;

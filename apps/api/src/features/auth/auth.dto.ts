import { MemberType, MemberStatus, PoliticianType } from '@prisma/client';

/**
 * 회원가입 요청 DTO
 */
export interface SignupRequestDto {
  email: string;
  password: string;
  nickname: string;
  memberType: MemberType;

  // 정치인/보좌관 전용
  politicianType?: PoliticianType;
  politicianName?: string;
  party?: string;
  district?: string;
  verificationDoc?: string;
}

/**
 * 회원가입 응답 DTO
 */
export interface SignupResponseDto {
  userId: string;
  memberId: string;
  email: string;
  nickname: string;
  memberType: MemberType;
  status: MemberStatus;
  message: string;
}

/**
 * 로그인 요청 DTO
 */
export interface LoginRequestDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * 로그인 응답 DTO
 */
export interface LoginResponseDto {
  user: {
    userId: string;
    memberId: string;
    email: string;
    nickname: string;
    memberType: MemberType;
    status: MemberStatus;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

/**
 * 토큰 갱신 요청 DTO
 */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * 토큰 갱신 응답 DTO
 */
export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * 비밀번호 찾기 요청 DTO
 */
export interface ForgotPasswordRequestDto {
  email: string;
}

/**
 * 비밀번호 재설정 요청 DTO
 */
export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;
}

/**
 * 비밀번호 변경 요청 DTO
 */
export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * 이메일 인증 요청 DTO
 */
export interface VerifyEmailRequestDto {
  token: string;
}

/**
 * 현재 사용자 정보 응답 DTO
 */
export interface CurrentUserResponseDto {
  userId: string;
  memberId: string;
  email: string;
  nickname: string;
  memberType: MemberType;
  status: MemberStatus;
  createdAt: Date;
  lastLoginAt: Date | null;

  // 정치인 전용
  politicianInfo?: {
    politicianType: PoliticianType;
    politicianName: string | null;
    party: string | null;
    district: string | null;
  };
}

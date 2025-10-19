import { z } from 'zod';

/**
 * 회원가입 요청 스키마
 */
export const signupSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('올바른 이메일 형식이 아닙니다.')
      .min(1, '이메일을 입력해주세요.')
      .max(255, '이메일은 최대 255자까지 가능합니다.'),

    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(128, '비밀번호는 최대 128자까지 가능합니다.'),

    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(20, '닉네임은 최대 20자까지 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 밑줄만 사용 가능합니다.'),

    memberType: z.enum(['NORMAL', 'POLITICIAN', 'ASSISTANT', 'ADMIN'], {
      errorMap: () => ({ message: '회원 유형을 선택해주세요.' }),
    }),

    // 정치인/보좌관 전용 필드 (선택)
    politicianType: z.enum(['NATIONAL_ASSEMBLY', 'LOCAL_GOVERNMENT', 'PRESIDENTIAL_OFFICE']).optional(),
    politicianName: z.string().max(50, '본명은 최대 50자까지 가능합니다.').optional(),
    party: z.string().max(50, '정당명은 최대 50자까지 가능합니다.').optional(),
    district: z.string().max(100, '지역구는 최대 100자까지 가능합니다.').optional(),
    verificationDoc: z.string().optional(), // 추후 파일 업로드로 변경
  }),
});

/**
 * 로그인 요청 스키마
 */
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('올바른 이메일 형식이 아닙니다.')
      .min(1, '이메일을 입력해주세요.'),

    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.'),

    rememberMe: z.boolean().optional().default(false),
  }),
});

/**
 * 토큰 갱신 요청 스키마
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh Token을 제공해주세요.'),
  }),
});

/**
 * 비밀번호 찾기 요청 스키마
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('올바른 이메일 형식이 아닙니다.')
      .min(1, '이메일을 입력해주세요.'),
  }),
});

/**
 * 비밀번호 재설정 요청 스키마
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, '재설정 토큰을 제공해주세요.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(128, '비밀번호는 최대 128자까지 가능합니다.'),
  }),
});

/**
 * 비밀번호 변경 요청 스키마
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(128, '비밀번호는 최대 128자까지 가능합니다.'),
  }),
});

/**
 * 이메일 인증 요청 스키마
 */
export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, '인증 토큰을 제공해주세요.'),
  }),
});

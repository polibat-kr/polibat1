import { z } from 'zod';

/**
 * Member Validation Schemas
 */

// Query validation for GET /api/members
export const getMembersQuerySchema = z.object({
  query: z.object({
    page: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === undefined) return 1;
        return typeof val === 'string' ? parseInt(val, 10) : val;
      }),
    limit: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === undefined) return 20;
        return typeof val === 'string' ? parseInt(val, 10) : val;
      }),
    search: z.string().optional(),
    memberType: z.enum(['NORMAL', 'POLITICIAN', 'ASSISTANT', 'ADMIN']).optional(),
    status: z.enum(['APPROVED', 'PENDING', 'WITHDRAWN', 'SUSPENDED', 'BANNED']).optional(),
    sortBy: z.enum(['createdAt', 'lastLoginAt', 'nickname', 'email']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

// Params validation for GET /api/members/:id
export const getMemberByIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
});

// Body validation for PATCH /api/members/:id
export const updateMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
  body: z.object({
    nickname: z
      .string()
      .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
      .max(20, '닉네임은 최대 20자까지 입력 가능합니다.')
      .regex(/^[가-힣a-zA-Z0-9_]+$/, '닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.')
      .optional(),
    politicianType: z.enum(['NATIONAL_ASSEMBLY', 'LOCAL_GOVERNMENT', 'PRESIDENTIAL_OFFICE']).optional(),
    politicianName: z.string().max(50, '정치인 이름은 최대 50자까지 입력 가능합니다.').optional(),
    party: z.string().max(50, '정당명은 최대 50자까지 입력 가능합니다.').optional(),
    district: z.string().max(100, '지역구는 최대 100자까지 입력 가능합니다.').optional(),
  }),
});

// Params validation for DELETE /api/members/:id
export const deleteMemberParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
});

// Body validation for PATCH /api/admin/members/:id/status
export const updateMemberStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'PENDING', 'WITHDRAWN', 'SUSPENDED', 'BANNED'], {
      required_error: '상태는 필수입니다.',
    }),
    reason: z.string().max(500, '사유는 최대 500자까지 입력 가능합니다.').optional(),
  }),
});

// Body validation for POST /api/admin/members/:id/approve
export const approveMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
  body: z.object({
    reason: z.string().max(500, '사유는 최대 500자까지 입력 가능합니다.').optional(),
  }),
});

// Body validation for POST /api/admin/members/:id/reject
export const rejectMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
  body: z.object({
    reason: z.string().min(1, '거절 사유는 필수입니다.').max(500, '사유는 최대 500자까지 입력 가능합니다.'),
  }),
});

// Params validation for GET /api/admin/members/:id/history
export const getMemberStatusHistoryParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('유효하지 않은 사용자 ID 형식입니다.'),
  }),
});

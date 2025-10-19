import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Zod 스키마 검증 미들웨어 생성기
 *
 * @description
 * - 요청 body, query, params 검증
 * - Zod 스키마를 사용한 타입 안전 검증
 *
 * @param schema - Zod 스키마 객체
 * @returns Express 미들웨어 함수
 *
 * @example
 * ```typescript
 * const loginSchema = z.object({
 *   body: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(6),
 *   }),
 * });
 *
 * router.post('/login', validate(loginSchema), loginController);
 * ```
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Update req with validated/transformed values
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new Error('검증 중 오류가 발생했습니다.'));
      }
    }
  };
}

/**
 * Body만 검증하는 간소화된 미들웨어
 *
 * @param schema - Zod 스키마 (body 부분만)
 */
export function validateBody(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(new Error('Body 검증 중 오류가 발생했습니다.'));
      }
    }
  };
}

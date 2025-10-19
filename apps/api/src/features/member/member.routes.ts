import { Router } from 'express';
import { MemberController } from './member.controller';
import { validate } from '../../shared/middleware/validator';
import { authenticateJwt, requireAdmin, requireSelf } from '../../shared/middleware/authenticate';
import {
  getMembersQuerySchema,
  getMemberByIdParamsSchema,
  updateMemberSchema,
  deleteMemberParamsSchema,
  updateMemberStatusSchema,
  approveMemberSchema,
  rejectMemberSchema,
  getMemberStatusHistoryParamsSchema,
} from './member.validation';

const router = Router();

// Public/authenticated member routes
router.get('/', authenticateJwt, validate(getMembersQuerySchema), MemberController.getMembers);
router.get('/:id', authenticateJwt, validate(getMemberByIdParamsSchema), MemberController.getMemberById);
router.patch(
  '/:id',
  authenticateJwt,
  requireSelf('id'),
  validate(updateMemberSchema),
  MemberController.updateMember
);
router.delete(
  '/:id',
  authenticateJwt,
  requireAdmin,
  validate(deleteMemberParamsSchema),
  MemberController.deactivateMember
);

// Admin-only routes (separate router for clarity)
const adminRouter = Router();
adminRouter.use(authenticateJwt, requireAdmin); // All admin routes require authentication and admin role

adminRouter.patch('/:id/status', validate(updateMemberStatusSchema), MemberController.updateMemberStatus);
adminRouter.post('/:id/approve', validate(approveMemberSchema), MemberController.approveMember);
adminRouter.post('/:id/reject', validate(rejectMemberSchema), MemberController.rejectMember);
adminRouter.get('/:id/history', validate(getMemberStatusHistoryParamsSchema), MemberController.getMemberStatusHistory);

// Mount admin routes under /admin prefix
router.use('/admin', adminRouter);

export default router;

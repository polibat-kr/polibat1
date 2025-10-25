import { Request, Response, NextFunction } from 'express';
import { MemberService } from './member.service';
import { successResponse } from '../../shared/utils/api-response';
import {
  GetMembersQueryDto,
  UpdateMemberRequestDto,
  UpdateMemberStatusRequestDto,
  ApproveMemberRequestDto,
  RejectMemberRequestDto,
} from './member.dto';

/**
 * Member Controller
 * HTTP request handling for member management
 */
export class MemberController {
  /**
   * Get members list
   * GET /api/members
   */
  static async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: GetMembersQueryDto = req.query;
      const result = await MemberService.getMembers(query);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get member by ID
   * GET /api/members/:id
   */
  static async getMemberById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MemberService.getMemberById(id);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update member
   * PATCH /api/members/:id
   */
  static async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateMemberRequestDto = req.body;
      const requestorId = req.user?.userId || '';

      const result = await MemberService.updateMember(id, data, requestorId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate member
   * DELETE /api/members/:id
   */
  static async deactivateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = req.user?.userId || '';

      await MemberService.deactivateMember(id, adminId);
      successResponse(res, { message: '회원이 탈퇴 처리되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update member status
   * PATCH /api/admin/members/:id/status
   */
  static async updateMemberStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateMemberStatusRequestDto = req.body;
      const adminId = req.user?.userId || '';

      const result = await MemberService.updateMemberStatus(id, data, adminId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve member
   * POST /api/admin/members/:id/approve
   */
  static async approveMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: ApproveMemberRequestDto = req.body;
      const adminId = req.user?.userId || '';

      const result = await MemberService.approveMember(id, data, adminId);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject member
   * POST /api/admin/members/:id/reject
   */
  static async rejectMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: RejectMemberRequestDto = req.body;
      const adminId = req.user?.userId || '';

      await MemberService.rejectMember(id, data, adminId);
      successResponse(res, { message: '회원 신청이 거절되었습니다.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get member status history
   * GET /api/admin/members/:id/history
   */
  static async getMemberStatusHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await MemberService.getMemberStatusHistory(id);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

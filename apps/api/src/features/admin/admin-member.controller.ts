/**
 * Admin Member Management Controller
 *
 * @description
 * - 회원 관리 HTTP 요청 처리
 * - GET /api/admin/members - 회원 목록 조회
 * - GET /api/admin/members/:memberId - 회원 상세 조회
 * - PATCH /api/admin/members/:memberId/status - 회원 상태 변경
 * - GET /api/admin/members/status-history - 상태 변경 이력 조회
 */

import type { Request, Response } from 'express';
import { AdminMemberService } from './admin-member.service';
import type {
  GetMembersQueryDto,
  UpdateMemberStatusRequestDto,
  GetMemberStatusHistoryQueryDto,
} from './admin-member.dto';

export class AdminMemberController {
  constructor(private service: AdminMemberService) {}

  /**
   * 회원 목록 조회
   * GET /api/admin/members
   */
  getMembers = async (req: Request, res: Response) => {
    try {
      const query: GetMembersQueryDto = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        memberType: req.query.memberType as any,
        status: req.query.status as any,
        politicianType: req.query.politicianType as any,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getMembers(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getMembers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch members',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * 회원 상세 조회
   * GET /api/admin/members/:memberId
   */
  getMemberById = async (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;

      const member = await this.service.getMemberById(memberId);

      res.json({
        success: true,
        data: member,
      });
    } catch (error) {
      console.error('Error in getMemberById:', error);

      if (error instanceof Error && error.message === 'Member not found') {
        res.status(404).json({
          success: false,
          error: 'Member not found',
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to fetch member details',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * 회원 상태 변경
   * PATCH /api/admin/members/:memberId/status
   */
  updateMemberStatus = async (req: Request, res: Response) => {
    try {
      const { memberId } = req.params;
      const statusData: UpdateMemberStatusRequestDto = req.body;

      // req.user는 authenticateJwt 미들웨어에서 설정됨
      const adminId = (req as any).user?.id;

      if (!adminId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // 상태 값 검증
      const validStatuses = ['APPROVED', 'PENDING', 'SUSPENDED', 'BANNED', 'WITHDRAWN'];
      if (!validStatuses.includes(statusData.status)) {
        res.status(400).json({
          success: false,
          error: 'Invalid status value',
        });
        return;
      }

      const result = await this.service.updateMemberStatus(memberId, statusData, adminId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in updateMemberStatus:', error);

      if (error instanceof Error) {
        if (error.message === 'Member not found') {
          res.status(404).json({
            success: false,
            error: 'Member not found',
          });
          return;
        }

        if (error.message === 'Member status is already the same') {
          res.status(400).json({
            success: false,
            error: 'Member status is already the same',
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update member status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  /**
   * 회원 상태 변경 이력 조회
   * GET /api/admin/members/status-history
   */
  getMemberStatusHistory = async (req: Request, res: Response) => {
    try {
      const query: GetMemberStatusHistoryQueryDto = {
        memberId: req.query.memberId as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };

      const result = await this.service.getMemberStatusHistory(query);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getMemberStatusHistory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch member status history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Admin Comment Management Service
 *
 * @description
 * - 댓글 관리 비즈니스 로직
 * - Repository 호출 및 데이터 변환
 */

import type {
  GetCommentsQueryDto,
  GetCommentsResponseDto,
  UpdateCommentStatusRequestDto,
  UpdateCommentStatusResponseDto,
  DeleteCommentResponseDto,
} from './admin-comment.dto';
import type { AdminCommentRepository } from './admin-comment.repository';

export class AdminCommentService {
  constructor(private repository: AdminCommentRepository) {}

  /**
   * 댓글 목록 조회
   */
  async getComments(query: GetCommentsQueryDto): Promise<GetCommentsResponseDto> {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const { comments, total } = await this.repository.getComments(query);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 댓글 상태 변경
   */
  async updateCommentStatus(
    commentId: string,
    data: UpdateCommentStatusRequestDto,
    adminId: string,
  ): Promise<UpdateCommentStatusResponseDto> {
    const result = await this.repository.updateCommentStatus(
      commentId,
      data,
      adminId,
    );

    return {
      ...result,
      reason: data.reason || null,
      changedBy: adminId,
      changedAt: new Date(),
    };
  }

  /**
   * 댓글 삭제 (Soft Delete)
   */
  async deleteComment(
    commentId: string,
    adminId: string,
  ): Promise<DeleteCommentResponseDto> {
    const result = await this.repository.deleteComment(commentId, adminId);

    return {
      ...result,
      deletedBy: adminId,
    };
  }
}

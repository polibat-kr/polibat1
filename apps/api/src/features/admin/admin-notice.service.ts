/**
 * Admin Notice Service
 *
 * 공지사항 관리 비즈니스 로직
 */

import { NoticeCategory } from '@prisma/client';
import { AdminNoticeRepository } from './admin-notice.repository';
import {
  GetNoticesQueryDto,
  NoticeDto,
  GetNoticesResponseDto,
  GetNoticeDetailResponseDto,
  CreateNoticeRequestDto,
  CreateNoticeResponseDto,
  UpdateNoticeRequestDto,
  UpdateNoticeResponseDto,
  DeleteNoticeResponseDto,
  TogglePinRequestDto,
  TogglePinResponseDto,
} from './admin-notice.dto';

export class AdminNoticeService {
  private repository: AdminNoticeRepository;

  constructor() {
    this.repository = new AdminNoticeRepository();
  }

  /**
   * 공지사항 목록 조회
   */
  async getNotices(query: GetNoticesQueryDto): Promise<GetNoticesResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { notices, total } = await this.repository.getNotices(query);

    const noticeDtos: NoticeDto[] = notices.map((notice) => ({
      id: notice.id,
      noticeId: notice.noticeId,
      category: notice.category,
      title: notice.title,
      content: notice.content,
      isPinned: notice.isPinned,
      viewCount: notice.viewCount,
      createdAt: notice.createdAt,
      updatedAt: notice.updatedAt,
    }));

    return {
      success: true,
      data: {
        notices: noticeDtos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * 공지사항 상세 조회
   */
  async getNoticeDetail(noticeId: string): Promise<GetNoticeDetailResponseDto> {
    // noticeId로 조회
    const notice = await this.repository.getNoticeByNoticeId(noticeId);

    if (!notice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    // 조회수 증가
    await this.repository.incrementViewCount(notice.id);

    // 조회수 증가된 데이터 다시 조회
    const updatedNotice = await this.repository.getNoticeById(notice.id);

    if (!updatedNotice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        id: updatedNotice.id,
        noticeId: updatedNotice.noticeId,
        category: updatedNotice.category,
        title: updatedNotice.title,
        content: updatedNotice.content,
        isPinned: updatedNotice.isPinned,
        viewCount: updatedNotice.viewCount,
        createdAt: updatedNotice.createdAt,
        updatedAt: updatedNotice.updatedAt,
      },
    };
  }

  /**
   * 공지사항 생성
   */
  async createNotice(data: CreateNoticeRequestDto): Promise<CreateNoticeResponseDto> {
    const { category, title, content, isPinned = false } = data;

    // noticeId 생성 (NT000001 형식)
    const count = await this.repository.getNoticeCount();
    const noticeId = `NT${String(count + 1).padStart(6, '0')}`;

    // 공지사항 생성
    const notice = await this.repository.createNotice({
      noticeId,
      category,
      title,
      content,
      isPinned,
    });

    return {
      success: true,
      data: {
        id: notice.id,
        noticeId: notice.noticeId,
        category: notice.category,
        title: notice.title,
        isPinned: notice.isPinned,
        createdAt: notice.createdAt,
      },
    };
  }

  /**
   * 공지사항 수정
   */
  async updateNotice(
    noticeId: string,
    data: UpdateNoticeRequestDto
  ): Promise<UpdateNoticeResponseDto> {
    // noticeId로 조회
    const notice = await this.repository.getNoticeByNoticeId(noticeId);

    if (!notice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    // 수정할 데이터 준비
    const updateData: {
      category?: NoticeCategory;
      title?: string;
      content?: string;
      isPinned?: boolean;
    } = {};

    if (data.category !== undefined) updateData.category = data.category;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;

    // 공지사항 수정
    const updatedNotice = await this.repository.updateNotice(notice.id, updateData);

    return {
      success: true,
      data: {
        id: updatedNotice.id,
        noticeId: updatedNotice.noticeId,
        category: updatedNotice.category,
        title: updatedNotice.title,
        isPinned: updatedNotice.isPinned,
        updatedAt: updatedNotice.updatedAt,
      },
    };
  }

  /**
   * 공지사항 삭제
   */
  async deleteNotice(noticeId: string): Promise<DeleteNoticeResponseDto> {
    // noticeId로 조회
    const notice = await this.repository.getNoticeByNoticeId(noticeId);

    if (!notice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    // 공지사항 삭제 (하드 삭제)
    const deletedNotice = await this.repository.deleteNotice(notice.id);

    return {
      success: true,
      data: {
        id: deletedNotice.id,
        noticeId: deletedNotice.noticeId,
        title: deletedNotice.title,
        deletedAt: new Date(),
      },
    };
  }

  /**
   * 공지사항 상단 고정/해제
   */
  async togglePin(noticeId: string, data: TogglePinRequestDto): Promise<TogglePinResponseDto> {
    // noticeId로 조회
    const notice = await this.repository.getNoticeByNoticeId(noticeId);

    if (!notice) {
      throw new Error('공지사항을 찾을 수 없습니다.');
    }

    // 상단 고정/해제
    const updatedNotice = await this.repository.togglePin(notice.id, data.isPinned);

    return {
      success: true,
      data: {
        id: updatedNotice.id,
        noticeId: updatedNotice.noticeId,
        title: updatedNotice.title,
        isPinned: updatedNotice.isPinned,
        updatedAt: updatedNotice.updatedAt,
      },
    };
  }
}

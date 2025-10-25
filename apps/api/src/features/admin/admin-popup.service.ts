/**
 * Admin Popup Service
 *
 * 팝업 관리 비즈니스 로직
 */

import { PopupPosition } from '@prisma/client';
import { AdminPopupRepository } from './admin-popup.repository';
import {
  GetPopupsQueryDto,
  PopupDto,
  GetPopupsResponseDto,
  GetPopupDetailResponseDto,
  CreatePopupRequestDto,
  CreatePopupResponseDto,
  UpdatePopupRequestDto,
  UpdatePopupResponseDto,
  DeletePopupResponseDto,
} from './admin-popup.dto';

export class AdminPopupService {
  private repository: AdminPopupRepository;

  constructor() {
    this.repository = new AdminPopupRepository();
  }

  /**
   * 팝업 목록 조회
   */
  async getPopups(query: GetPopupsQueryDto): Promise<GetPopupsResponseDto> {
    const { page = 1, limit = 20 } = query;

    const { popups, total } = await this.repository.getPopups(query);

    const popupDtos: PopupDto[] = popups.map((popup) => ({
      id: popup.id,
      popupId: popup.popupId,
      title: popup.title,
      content: popup.content,
      imageUrl: popup.imageUrl,
      linkUrl: popup.linkUrl,
      position: popup.position,
      startDate: popup.startDate,
      endDate: popup.endDate,
      isActive: popup.isActive,
      createdAt: popup.createdAt,
      updatedAt: popup.updatedAt,
    }));

    return {
      success: true,
      data: {
        popups: popupDtos,
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
   * 팝업 상세 조회
   */
  async getPopupDetail(popupId: string): Promise<GetPopupDetailResponseDto> {
    // popupId로 조회
    const popup = await this.repository.getPopupByPopupId(popupId);

    if (!popup) {
      throw new Error('팝업을 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        id: popup.id,
        popupId: popup.popupId,
        title: popup.title,
        content: popup.content,
        imageUrl: popup.imageUrl,
        linkUrl: popup.linkUrl,
        position: popup.position,
        startDate: popup.startDate,
        endDate: popup.endDate,
        isActive: popup.isActive,
        createdAt: popup.createdAt,
        updatedAt: popup.updatedAt,
      },
    };
  }

  /**
   * 팝업 생성
   */
  async createPopup(data: CreatePopupRequestDto): Promise<CreatePopupResponseDto> {
    const {
      title,
      content,
      imageUrl,
      linkUrl,
      position = PopupPosition.CENTER,
      startDate,
      endDate,
      isActive = true,
    } = data;

    // 날짜 유효성 검증
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error('노출 종료일은 시작일보다 이후여야 합니다.');
    }

    // popupId 생성 (PU000001 형식)
    const count = await this.repository.getPopupCount();
    const popupId = `PU${String(count + 1).padStart(6, '0')}`;

    // 팝업 생성
    const popup = await this.repository.createPopup({
      popupId,
      title,
      content,
      imageUrl,
      linkUrl,
      position,
      startDate: start,
      endDate: end,
      isActive,
    });

    return {
      success: true,
      data: {
        id: popup.id,
        popupId: popup.popupId,
        title: popup.title,
        position: popup.position,
        startDate: popup.startDate,
        endDate: popup.endDate,
        isActive: popup.isActive,
        createdAt: popup.createdAt,
      },
    };
  }

  /**
   * 팝업 수정
   */
  async updatePopup(
    popupId: string,
    data: UpdatePopupRequestDto
  ): Promise<UpdatePopupResponseDto> {
    // popupId로 조회
    const popup = await this.repository.getPopupByPopupId(popupId);

    if (!popup) {
      throw new Error('팝업을 찾을 수 없습니다.');
    }

    // 수정할 데이터 준비
    const updateData: {
      title?: string;
      content?: string;
      imageUrl?: string;
      linkUrl?: string;
      position?: PopupPosition;
      startDate?: Date;
      endDate?: Date;
      isActive?: boolean;
    } = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.linkUrl !== undefined) updateData.linkUrl = data.linkUrl;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    // 날짜 유효성 검증 (둘 다 수정될 경우)
    if (updateData.startDate && updateData.endDate) {
      if (updateData.startDate >= updateData.endDate) {
        throw new Error('노출 종료일은 시작일보다 이후여야 합니다.');
      }
    }

    // 팝업 수정
    const updatedPopup = await this.repository.updatePopup(popup.id, updateData);

    return {
      success: true,
      data: {
        id: updatedPopup.id,
        popupId: updatedPopup.popupId,
        title: updatedPopup.title,
        position: updatedPopup.position,
        startDate: updatedPopup.startDate,
        endDate: updatedPopup.endDate,
        isActive: updatedPopup.isActive,
        updatedAt: updatedPopup.updatedAt,
      },
    };
  }

  /**
   * 팝업 삭제
   */
  async deletePopup(popupId: string): Promise<DeletePopupResponseDto> {
    // popupId로 조회
    const popup = await this.repository.getPopupByPopupId(popupId);

    if (!popup) {
      throw new Error('팝업을 찾을 수 없습니다.');
    }

    // 팝업 삭제 (하드 삭제)
    const deletedPopup = await this.repository.deletePopup(popup.id);

    return {
      success: true,
      data: {
        id: deletedPopup.id,
        popupId: deletedPopup.popupId,
        title: deletedPopup.title,
        deletedAt: new Date(),
      },
    };
  }
}

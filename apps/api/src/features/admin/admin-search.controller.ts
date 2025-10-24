/**
 * Admin Search Controller
 *
 * 통합 검색 요청/응답 처리
 */

import { Request, Response } from 'express';
import { AdminSearchService } from './admin-search.service';
import { AdminSearchQueryDto, SearchCategory } from './admin-search.dto';

export class AdminSearchController {
  private service: AdminSearchService;

  constructor() {
    this.service = new AdminSearchService();
  }

  /**
   * 통합 검색
   * GET /api/admin/search
   */
  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.query as string;

      // 검색어 필수 검증
      if (!query || query.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Search query is required',
          },
        });
      }

      // 검색어 길이 검증 (최소 2자)
      if (query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Search query must be at least 2 characters',
          },
        });
      }

      const queryDto: AdminSearchQueryDto = {
        query: query.trim(),
        category: (req.query.category as SearchCategory) || 'all',
        limit: req.query.limit ? parseInt(req.query.limit as string) : 5,
      };

      // 카테고리 유효성 검증
      const validCategories = ['all', 'members', 'posts', 'comments', 'reports'];
      if (!validCategories.includes(queryDto.category!)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          },
        });
      }

      const result = await this.service.search(queryDto);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Search error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to perform search',
        },
      });
    }
  };
}

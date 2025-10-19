/**
 * 날짜 유틸리티
 */

/**
 * 날짜 표시 형식 (게시판 시간 표시 기준)
 * - 당일: 최초 등록 시분초
 * - 다음날: 년월일
 * - 상세화면: 최초 등록 년월일시분초
 */
export class DateUtils {
  /**
   * 게시판 목록 날짜 표시
   * @param date 날짜
   * @example
   * DateUtils.formatBoardDate(today) // "12:34:56"
   * DateUtils.formatBoardDate(yesterday) // "2025-10-10"
   */
  static formatBoardDate(date: Date): string {
    const now = new Date();
    const target = new Date(date);

    // 같은 날짜인지 확인
    const isSameDay =
      now.getFullYear() === target.getFullYear() &&
      now.getMonth() === target.getMonth() &&
      now.getDate() === target.getDate();

    if (isSameDay) {
      // 당일: 시분초
      return this.formatTime(target);
    } else {
      // 다음날 이후: 년월일
      return this.formatDate(target);
    }
  }

  /**
   * 상세 화면 날짜 표시
   * @param date 날짜
   * @example
   * DateUtils.formatDetailDate(date) // "2025-10-11 12:34:56"
   */
  static formatDetailDate(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  /**
   * 날짜 형식 (YYYY-MM-DD)
   */
  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 시간 형식 (HH:MM:SS)
   */
  static formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * 기간 계산 (일간/주간/월간/연간)
   */
  static getDateRange(period: '일간' | '주간' | '월간' | '연간'): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (period) {
      case '일간':
        // 당일만 (startDate = endDate = today)
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case '주간':
        // 최근 7일
        startDate.setDate(now.getDate() - 7);
        break;

      case '월간':
        // 최근 1개월
        startDate.setMonth(now.getMonth() - 1);
        break;

      case '연간':
        // 최근 1년
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * 날짜 범위 검증
   */
  static isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }

  /**
   * 상대 시간 표시 (예: "3분 전", "2시간 전")
   */
  static getRelativeTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return '방금 전';
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return this.formatDate(date);
    }
  }
}

/**
 * ID 생성 유틸리티
 */

import { ID_PREFIXES, ID_DIGITS, IdPrefix } from '@polibat/constants';

/**
 * 간단한 ID 생성 함수 (클래스 메서드 래퍼)
 * @param prefix ID 접두사
 * @param number 번호
 * @param digits 자릿수 (기본값: 6)
 */
export function generateId(prefix: string, number: number, digits: number = 6): string {
  const formattedNumber = String(number).padStart(digits, '0');
  return `${prefix}${formattedNumber}`;
}

export class IdGenerator {
  /**
   * ID 생성
   * @param prefix ID 접두사 (NM, PM, FB 등)
   * @param lastNumber 마지막 번호 (없으면 0)
   * @param parentId 상위 ID (댓글, 신고 등)
   * @example
   * IdGenerator.generate('NM', 123) // NM000124
   * IdGenerator.generate('CM', 5, 'FB000001') // FB000001-CM0006
   */
  static generate(prefix: IdPrefix, lastNumber: number = 0, parentId?: string): string {
    const digits = ID_DIGITS[prefix];
    const nextNumber = lastNumber + 1;
    const formattedNumber = String(nextNumber).padStart(digits, '0');

    if (parentId) {
      return `${parentId}-${prefix}${formattedNumber}`;
    }

    return `${prefix}${formattedNumber}`;
  }

  /**
   * ID에서 숫자 부분 추출
   * @param id 전체 ID
   * @example
   * IdGenerator.extractNumber('NM000123') // 123
   * IdGenerator.extractNumber('FB000001-CM0005') // 5
   */
  static extractNumber(id: string): number {
    const parts = id.split('-');
    const lastPart = parts[parts.length - 1];
    const numberMatch = lastPart.match(/\d+/);

    if (!numberMatch) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    return parseInt(numberMatch[0], 10);
  }

  /**
   * ID 유효성 검증
   * @param id 검증할 ID
   * @param expectedPrefix 기대하는 prefix (선택)
   */
  static validate(id: string, expectedPrefix?: IdPrefix): boolean {
    if (!id || typeof id !== 'string') {
      return false;
    }

    const parts = id.split('-');
    const prefixes = Object.values(ID_PREFIXES);

    for (const part of parts) {
      const prefixMatch = part.match(/^([A-Z]{2})/);
      if (!prefixMatch) {
        return false;
      }

      const prefix = prefixMatch[1] as IdPrefix;
      if (!prefixes.includes(prefix)) {
        return false;
      }

      if (expectedPrefix && prefix !== expectedPrefix) {
        return false;
      }

      const numberPart = part.substring(2);
      const expectedLength = ID_DIGITS[prefix];

      if (numberPart.length !== expectedLength || !/^\d+$/.test(numberPart)) {
        return false;
      }
    }

    return true;
  }

  /**
   * ID에서 prefix 추출
   * @param id 전체 ID
   * @example
   * IdGenerator.extractPrefix('NM000123') // 'NM'
   * IdGenerator.extractPrefix('FB000001-CM0005') // 'CM' (마지막 prefix)
   */
  static extractPrefix(id: string): IdPrefix {
    const parts = id.split('-');
    const lastPart = parts[parts.length - 1];
    const prefixMatch = lastPart.match(/^([A-Z]{2})/);

    if (!prefixMatch) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    return prefixMatch[1] as IdPrefix;
  }
}

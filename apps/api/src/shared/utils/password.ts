import bcrypt from 'bcryptjs';

/**
 * 비밀번호 해싱 및 검증 유틸리티
 */
export class PasswordUtil {
  /**
   * Salt rounds (보안 강도)
   * 10 rounds = ~10 hashes/sec (적절한 성능과 보안)
   */
  private static readonly SALT_ROUNDS = 10;

  /**
   * 비밀번호 해싱
   */
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * 비밀번호 검증
   */
  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 비밀번호 강도 검증
   * - 최소 8자
   * - 영문 대소문자, 숫자, 특수문자 중 3가지 이상 포함
   */
  static validateStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
    }

    if (password.length > 128) {
      errors.push('비밀번호는 최대 128자까지 가능합니다.');
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const conditionsMet = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    if (conditionsMet < 3) {
      errors.push('비밀번호는 영문 대소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 일반적인 비밀번호 패턴 확인
   */
  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password',
      '12345678',
      'qwerty123',
      'admin123',
      'password123',
      'test1234',
    ];

    return commonPasswords.some(
      (common) => password.toLowerCase().includes(common)
    );
  }
}

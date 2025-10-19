/**
 * 유효성 검증 유틸리티
 */

/**
 * 이메일 유효성 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검증
 * - 최소 8자 이상
 * - 영문, 숫자, 특수문자 중 2가지 이상 조합
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  let typeCount = 0;

  if (/[a-zA-Z]/.test(password)) typeCount++; // 영문
  if (/[0-9]/.test(password)) typeCount++; // 숫자
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) typeCount++; // 특수문자

  return typeCount >= 2;
}

/**
 * 닉네임 유효성 검증
 * - 2자 이상 20자 이하
 * - 한글, 영문, 숫자만 허용
 */
export function isValidNickname(nickname: string): boolean {
  if (nickname.length < 2 || nickname.length > 20) {
    return false;
  }

  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
  return nicknameRegex.test(nickname);
}

/**
 * URL 유효성 검증
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 전화번호 유효성 검증 (한국 형식)
 * - 010-1234-5678
 * - 01012345678
 * - 02-1234-5678
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(01[0-9]|02|0[3-9][0-9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

/**
 * 파일 크기 검증 (bytes)
 */
export function isValidFileSize(size: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
}

/**
 * 파일 확장자 검증
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * 이미지 파일 확장자 검증
 */
export function isValidImageFile(filename: string): boolean {
  return isValidFileExtension(filename, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
}

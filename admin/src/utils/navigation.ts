/**
 * 관리자 페이지 내부 링크를 새 탭에서 열기
 * @param path - 이동할 경로 (예: '/dashboard', '/members/all')
 * @param target - 창 열기 방식 (기본값: '_blank')
 */
export const openAdminPage = (path: string, target: string = '_blank') => {
  // 이미 /backoffice로 시작하는 경우 그대로 사용
  const fullPath = path.startsWith('/backoffice') ? path : `/backoffice${path}`;
  window.open(fullPath, target);
};

/**
 * 외부 링크 열기
 * @param url - 외부 URL
 * @param target - 창 열기 방식 (기본값: '_blank')
 */
export const openExternalLink = (url: string, target: string = '_blank') => {
  window.open(url, target);
};
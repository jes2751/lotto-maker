export const siteConfig = {
  name: "LOTTO LAB",
  description: "과거 당첨 데이터 기반 추천, 전체 회차 조회, 번호별 통계를 제공하는 무료 로또 웹 서비스",
  defaultUrl: "https://lotto-maker.cloud"
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultUrl;
}

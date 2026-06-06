// ──────────────────────────────────────────────────────────────────────────────
// 시설명 → 카테고리 자동 분류
// DB(facilities)에 category 컬럼이 없어 프론트에서 name 키워드 매칭으로 처리.
// 분류 규칙을 바꾸려면 이 파일만 수정하면 됩니다.
// ──────────────────────────────────────────────────────────────────────────────

export type FacilityCategory =
  | 'building'
  | 'library'
  | 'sports'
  | 'dorm'
  | 'practice'
  | 'club'
  | 'gate'
  | 'other'

export function categorize(name: string): FacilityCategory {
  if (name.includes('도서관')) return 'library'
  if (/(운동장|농구장|풋살|체육)/.test(name)) return 'sports'
  if (/(생활관|기숙)/.test(name)) return 'dorm'
  if (/(실습|B777)/.test(name)) return 'practice'
  if (name.includes('동아리')) return 'club'
  if (/(정문|후문)/.test(name)) return 'gate'
  if (/(호관|본관|평생교육원)/.test(name)) return 'building'
  return 'other'
}

export const CATEGORY_LABELS: Record<FacilityCategory, string> = {
  building: '건물',
  library: '도서관',
  sports: '운동시설',
  dorm: '기숙사',
  practice: '실습장',
  club: '동아리',
  gate: '출입구',
  other: '기타',
}

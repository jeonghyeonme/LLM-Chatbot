import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import { fetchSchedules, type Schedule } from '../lib/api'

/**
 * 공지사항 타입 정의 (DB에 테이블 없음 → 더미 유지)
 */
interface Announcement {
  category: string
  title: string
  date: string
}

// 공지사항 더미 데이터
const ANNOUNCEMENTS: Announcement[] = [
  { category: '학사', title: '2024학년도 2학기 전공교과목 수강 포기 안내', date: '2024.10.10' },
  { category: '장학', title: '2024학년도 2학기 교내장학금 신청 안내', date: '2024.10.08' },
  { category: '행사', title: '2024 인하 테크 페스티벌 개최 안내', date: '2024.10.05' },
]

// ──────────────────────────────────────────────────────────────────────────────
// 날짜 헬퍼
// ──────────────────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, '0')
const toYMD = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`
const toMMDD = (ymd: string) => {
  const [, mm, dd] = ymd.split('-')
  return `${mm}.${dd}`
}
const formatRange = (start: string, end: string) =>
  start === end ? toMMDD(start) : `${toMMDD(start)} - ${toMMDD(end)}`

const daysInMonth = (year: number, monthIdx: number) =>
  new Date(year, monthIdx + 1, 0).getDate()

/**
 * 학사 일정 및 공지사항 페이지
 */
export default function CalendarPage() {
  const days = ['일', '월', '화', '수', '목', '금', '토']

  // 현재 보고 있는 월 (1일로 고정)
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const year = viewDate.getFullYear()
  const monthIdx = viewDate.getMonth() // 0~11

  // 해당 월 범위의 일정 페칭
  useEffect(() => {
    const start = toYMD(year, monthIdx, 1)
    const end = toYMD(year, monthIdx, daysInMonth(year, monthIdx))
    setLoading(true)
    setError(null)
    fetchSchedules({ start, end, limit: 200 })
      .then(setSchedules)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [year, monthIdx])

  // 날짜(YYYY-MM-DD) → 그 날에 해당하는 일정 배열
  const schedulesByDate = useMemo(() => {
    const map = new Map<string, Schedule[]>()
    for (const s of schedules) {
      // start_date ~ end_date 사이 모든 날에 매핑 (문자열 비교가 안전)
      const [sy, sm, sd] = s.start_date.split('-').map(Number)
      const [ey, em, ed] = s.end_date.split('-').map(Number)
      const startMs = new Date(sy, sm - 1, sd).getTime()
      const endMs = new Date(ey, em - 1, ed).getTime()
      for (let t = startMs; t <= endMs; t += 86400000) {
        const d = new Date(t)
        const key = toYMD(d.getFullYear(), d.getMonth(), d.getDate())
        const arr = map.get(key) ?? []
        arr.push(s)
        map.set(key, arr)
      }
    }
    return map
  }, [schedules])

  const firstWeekday = new Date(year, monthIdx, 1).getDay() // 0=일
  const totalDays = daysInMonth(year, monthIdx)
  const dates = Array.from({ length: totalDays }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstWeekday })

  const moveMonth = (dir: -1 | 1) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + dir, 1))
  }

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans text-inha-text-main">
      <Header />

      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            📅 학사일정 및 공지사항
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽 섹션: 캘린더 */}
            <div className="lg:col-span-2 bg-white rounded-inha-card border border-inha-border shadow-inha-card p-6 md:p-8">
              {/* 캘린더 헤더: 월 이동 */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => moveMonth(-1)}
                  className="p-2 hover:bg-inha-bg rounded-full transition-colors"
                  aria-label="이전 달"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-inha-text-main">
                  {year}년 {monthIdx + 1}월
                </h2>
                <button
                  onClick={() => moveMonth(1)}
                  className="p-2 hover:bg-inha-bg rounded-full transition-colors"
                  aria-label="다음 달"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* 요일 표시 */}
              <div className="grid grid-cols-7 gap-px mb-4">
                {days.map(day => (
                  <div key={day} className={`text-center py-2 text-sm font-semibold ${day === '일' ? 'text-red-500' : day === '토' ? 'text-blue-500' : 'text-inha-text-sub'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* 날짜 그리드 */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {blanks.map((_, i) => (
                  <div key={`b-${i}`} className="aspect-square" />
                ))}
                {dates.map(date => {
                  const key = toYMD(year, monthIdx, date)
                  const daySchedules = schedulesByDate.get(key) ?? []
                  const weekday = new Date(year, monthIdx, date).getDay() // 0=일, 6=토
                  const isWeekend = weekday === 0 || weekday === 6
                  // 시험 강조는 평일에만 적용 (시험은 주말에 안 봄)
                  const hasExam = !isWeekend && daySchedules.some(s => s.type === 'exam')
                  const hasInfo = daySchedules.some(s => s.type === 'info')
                  return (
                    <div
                      key={date}
                      title={daySchedules.map(s => s.title).join(', ') || undefined}
                      className={`relative aspect-square flex items-center justify-center rounded-xl text-sm md:text-base border border-transparent transition-all cursor-pointer hover:border-inha-blue/30 ${
                        hasExam ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-inha-bg'
                      }`}
                    >
                      {date}
                      {hasExam && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                      {!hasExam && hasInfo && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-inha-blue rounded-full" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 오른쪽 섹션: 일정 리스트 및 공지사항 */}
            <div className="space-y-6">
              {/* 주요 학사일정 카드 */}
              <div className="bg-white rounded-inha-card border border-inha-border shadow-inha-card p-6">
                <h3 className="text-lg font-bold text-inha-blue mb-4 flex items-center gap-2">
                  📌 주요 학사일정
                </h3>

                {loading && (
                  <p className="text-sm text-inha-text-sub py-4">불러오는 중…</p>
                )}
                {error && (
                  <p className="text-sm text-red-500 py-4">에러: {error}</p>
                )}
                {!loading && !error && schedules.length === 0 && (
                  <p className="text-sm text-inha-text-sub py-4">이 달에는 등록된 일정이 없습니다.</p>
                )}

                <div className="space-y-4">
                  {schedules.map(s => (
                    <div key={s.id} className="flex flex-col gap-1 border-b border-inha-border pb-3 last:border-0 last:pb-0">
                      <span className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded-full ${s.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {s.type === 'exam' ? '시험' : '학사'}
                      </span>
                      <span className="text-sm font-semibold text-inha-text-main">{s.title}</span>
                      <span className="text-xs text-inha-text-sub">{formatRange(s.start_date, s.end_date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 최신 공지사항 카드 (DB에 없음 → 더미 유지) */}
              <div className="bg-white rounded-inha-card border border-inha-border shadow-inha-card p-6">
                <h3 className="text-lg font-bold text-inha-blue mb-4 flex items-center gap-2">
                  📢 최신 공지사항
                </h3>
                <div className="space-y-4">
                  {ANNOUNCEMENTS.map((anno, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] bg-inha-bg border border-inha-border px-1.5 py-0.5 rounded text-inha-text-sub group-hover:bg-inha-blue group-hover:text-white transition-colors">
                          {anno.category}
                        </span>
                        <span className="text-xs text-inha-text-sub">{anno.date}</span>
                      </div>
                      <p className="text-sm text-inha-text-main line-clamp-1 group-hover:text-inha-blue transition-colors">
                        {anno.title}
                      </p>
                    </div>
                  ))}
                </div>
                {/* 공지사항 더보기 버튼 */}
                <button className="w-full mt-6 py-2.5 text-sm font-semibold text-inha-text-sub bg-inha-bg hover:bg-inha-border rounded-lg transition-colors">
                  공지사항 더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import Header from '../components/Header'

/**
 * 학사 일정 타입 정의
 */
interface AcademicEvent {
  date: string;
  title: string;
  type: 'exam' | 'info';
}

/**
 * 공지사항 타입 정의
 */
interface Announcement {
  category: string;
  title: string;
  date: string;
}

// 학사 일정 더미 데이터
const ACADEMIC_EVENTS: AcademicEvent[] = [
  { date: '10.14 - 10.18', title: '중간고사 기간', type: 'exam' },
  { date: '10.21 - 10.25', title: '2학기 전공 심화 신청', type: 'info' },
  { date: '10.28', title: '동계 계절학기 공고', type: 'info' },
]

// 공지사항 더미 데이터
const ANNOUNCEMENTS: Announcement[] = [
  { category: '학사', title: '2024학년도 2학기 전공교과목 수강 포기 안내', date: '2024.10.10' },
  { category: '장학', title: '2024학년도 2학기 교내장학금 신청 안내', date: '2024.10.08' },
  { category: '행사', title: '2024 인하 테크 페스티벌 개최 안내', date: '2024.10.05' },
]

/**
 * 학사 일정 및 공지사항 페이지
 */
export default function CalendarPage() {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)
  
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
                <button className="p-2 hover:bg-inha-bg rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-inha-text-main">2024년 10월</h2>
                <button className="p-2 hover:bg-inha-bg rounded-full transition-colors">
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
                {/* 10월 시작 요일 맞춤용 공백 (화요일 시작 가정) */}
                <div className="aspect-square"></div>
                <div className="aspect-square"></div>
                {dates.map(date => {
                  const isExam = date >= 14 && date <= 18 // 중간고사 기간 강조
                  return (
                    <div key={date} className={`relative aspect-square flex items-center justify-center rounded-xl text-sm md:text-base border border-transparent transition-all cursor-pointer hover:border-inha-blue/30 ${isExam ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-inha-bg'}`}>
                      {date}
                      {isExam && date === 14 && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
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
                <div className="space-y-4">
                  {ACADEMIC_EVENTS.map((event, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-inha-border pb-3 last:border-0 last:pb-0">
                      <span className={`text-[10px] font-bold w-fit px-2 py-0.5 rounded-full ${event.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {event.type === 'exam' ? '시험' : '학사'}
                      </span>
                      <span className="text-sm font-semibold text-inha-text-main">{event.title}</span>
                      <span className="text-xs text-inha-text-sub">{event.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 최신 공지사항 카드 */}
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

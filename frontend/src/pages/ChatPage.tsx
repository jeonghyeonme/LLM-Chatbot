import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown' 
import Header from '../components/Header'
import induckMascot from '../assets/induck-i.webp'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/* * 챗봇 메시지 타입 정의
 * role: 'user' (사용자) | 'bot' (인덕이)
 */
interface Message {
  role: 'user' | 'bot';
  content: string;
}

/* * 메인 챗봇 페이지 컴포넌트
 */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  /* 퀵 메뉴 스크롤 제어를 위한 Ref 및 상태 */
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  /* 자동 하단 추적 스크롤을 위한 Ref 선언 */
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /* 대화 내용이 추가되거나 스트리밍될 때마다 화면을 맨 아래로 이동 */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  /* 스크롤 상태 체크 (화살표 표시 여부 결정) */
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  /* 양 끝으로 부드러운 스크롤 이동 */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current
      scrollRef.current.scrollTo({
        left: direction === 'left' ? 0 : scrollWidth,
        behavior: 'smooth'
      })
    }
  }

  /* 실시간 글자 타이핑 스트리밍 답변 시뮬레이션 함수 */
  const simulateStreamingResponse = (fullText: string) => {
    setIsTyping(false)
    
    /* 빈 봇 말풍선을 먼저 리스트 끝에 생성 */
    const botMsg: Message = { role: 'bot', content: '' }
    setMessages(prev => [...prev, botMsg])

    let currentText = ''
    let index = 0

    /* 30ms 간격으로 글자를 한 자씩 쪼개 실시간 업데이트 */
    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index]
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: currentText }
          return updated
        })
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)
  }

  /* 사용자의 질문을 분석하여 인하공전 맞춤형 리얼 데이터를 반환하는 함수 */
  const getCustomBotResponse = (question: string): string => {
    const cleanQuestion = question.trim();

    if (cleanQuestion.includes('장학금') || cleanQuestion.includes('장학')) {
      return `### 💰 인하공전 장학금 지급 안내\n\n학생분들을 위한 주요 장학금 혜택 및 신청 정보입니다.\n\n* **인하가족장학금:** 직계가족 2인 이상 재학 시 지급 (수업료의 50% 감면)\n* **성적우수장학금:** 학과별 성적 최우수자 및 우수자 선발 (수업료 전액 또는 일부 감면)\n* **복지장학금:** 한국장학재단 국가장학금 신청자 중 소득분위 연계 지급\n\n📌 **신청 방법:** 인하공전 종합정보시스템 로그인 ➡️ 등록/장학 메뉴 ➡️ 장학금 신청\n\n_※ 세부 일정 및 제출 서류는 대학 홈페이지 공지사항을 꼭 확인해 주세요!_`;
    }

    if (cleanQuestion.includes('식단') || cleanQuestion.includes('밥') || cleanQuestion.includes('메뉴')) {
      return `### 🍱 오늘 학과식당 및 학생식당 식단\n\n인하공전 캠퍼스 내 식당 정보입니다.\n\n* **학생식당 (본관 지하 1층):**\n  - 백반 코너: 제육볶음 정식 (4,500원)\n  - 일품 코너: 돈까스 및 우동 세트 (5,000원)\n* **교직원식당 (인하관 1층):**\n  - 오늘의 한식 정식 (6,500원)\n\n⏰ **운영 시간:** 중식 11:30 ~ 13:30 / 석식 17:00 ~ 18:30`;
    }

    if (cleanQuestion.includes('일정') || cleanQuestion.includes('학사')) {
      return `### 📅 주요 학사일정 안내\n\n올해 꼭 챙겨야 할 인하공전 학사일정 로드맵입니다.\n\n1. **중간고사 기간:** 4월 중순 예정\n2. **하계 방학 시작:** 6월 중순 예정\n3. **2학기 수강신청:** 8월 초 순\n\n정확한 주차별 세부 변동 사항은 좌측 상단의 **'📅 학사일정'** 메뉴로 이동하시면 달력 형식으로 더 자세히 보실 수 있습니다!`;
    }

    if (cleanQuestion.includes('맵') || cleanQuestion.includes('캠퍼스') || cleanQuestion.includes('위치')) {
      return `### 🗺️ 인하공전 주요 건물 위치 안내\n\n길을 헤매는 학우분들을 위한 캠퍼스 핵심 가이드입니다.\n\n* **본관:** 학생 종합민원실, 학생식당, 교무처\n* **3호관/5호관:** 컴퓨터정보공학부 및 공학 계열 실습실\n* **도서관:** 본관 옆 위치, 열람실 및 자료실 운영\n\n자세한 가이드 인터페이스는 상단의 **'🗺️ 캠퍼스맵'** 메뉴 탭을 클릭하시면 실시간 맵뷰로 연동됩니다!`;
    }

    /* 기본 답변 */
    return `### 🐥 인덕이 답변 도우미\n\n요청하신 **"${question}"**에 대한 답변입니다.\n\n현재 이 기능은 준비 중이거나 학습 대기 중인 상태입니다. 학사일정, 식단안내, 캠퍼스맵, 장학금 등을 입력하거나 하단 퀵 메뉴를 눌러보세요!`;
  }

  /* 메시지 전송 핸들러 */
  /* 매개변수 textToSend를 추가하여 입력창 전송과 퀵 버튼 클릭 전송을 동시 지원 */
  const handleSend = (textToSend?: string) => {
    const targetText = textToSend || input;
    if (!targetText.trim()) return
    
    /* 사용자 메시지 추가 */
    const userMsg: Message = { role: 'user', content: targetText }
    setMessages(prev => [...prev, userMsg])
    
    /* 입력창에서 전송했을 때만 칸을 비워줍니다. */
    if (!textToSend) {
      setInput('')
    }
    
    /* 인덕이 응답 시뮬레이션 */
    setIsTyping(true)
    setTimeout(() => {
      /* 고정 더미 답변 대신 사용자가 보낸 키워드(targetText)에 맞는 맞춤형 데이터 주입 */
      const customResponse = getCustomBotResponse(targetText)
      simulateStreamingResponse(customResponse)
    }, 1000)
  }

  /* 하단 퀵 메뉴 버튼 구성 */
  const quickMenus = [
    { label: '📅 학사일정', path: '/calendar' },
    { label: '🗺️ 캠퍼스맵', path: '/map' },
    { label: '📢 공지사항', path: '/calendar' },
    { label: '🍱 식단안내', path: '/mealPlan' },
    { label: '💰 장학금', path: '#' },
    { label: '📚 도서관', path: '#' },
    { label: '🏫 강의실 조회', path: '#' },
  ]

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans text-inha-text-main selection:bg-inha-blue/10">
      <Header />

      {/* 채팅 메인 영역 */}
      <main className="flex-1 pt-24 pb-48 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-3xl px-4 flex flex-col items-center">
          
          {/* 초기 웰컴 카드: 메시지가 없을 때만 표시 */}
          {messages.length === 0 && (
            <div className="mt-12 w-full max-w-[510px] bg-white rounded-inha-card border border-inha-border shadow-inha-card p-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-24 h-24 bg-inha-pill-bg rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-sm">
                <img src={induckMascot} alt="Mascot" className="w-full h-full object-cover scale-110" />
              </div>
              <h2 className="text-2xl font-bold text-inha-blue mb-3">안녕하세요! 인덕이 입니다!</h2>
              <p className="text-inha-text-main leading-relaxed text-sm md:text-base">
                인하공전 학생들을 위한 스마트한 챗봇 서비스입니다.<br />
                학교 생활, 학사 일정, 캠퍼스 안내 등 무엇이든 물어보세요!
              </p>
            </div>
          )}

          {/* 메시지 리스트 */}
          <div className="w-full space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* 인덕이 프로필 이미지 */}
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-inha-pill-bg flex-shrink-0 flex items-center justify-center border border-inha-border overflow-hidden">
                      <img src={induckMascot} alt="Bot" className="w-full h-full object-cover scale-110" />
                    </div>
                  )}
                  {/* 말풍선 */}
                  <div className={`p-4 rounded-inha-card text-sm md:text-base shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-inha-blue text-white rounded-tr-none' 
                      : 'bg-white border border-inha-border text-inha-text-main rounded-tl-none'
                  }`}>
                    {/* 인덕이(bot)의 답변은 텍스트 대신 ReactMarkdown 컴포넌트로 렌더링 */}
                    {msg.role === 'bot' ? (
                      <div className="prose prose-sm max-w-none text-inha-text-main leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-inha-pill-bg flex-shrink-0 flex items-center justify-center border border-inha-border overflow-hidden">
                    <img src={induckMascot} alt="Bot" className="w-full h-full object-cover scale-110" />
                  </div>
                  <div className="p-3 bg-white border border-inha-border rounded-inha-card rounded-tl-none text-inha-text-sub text-xs">
                    인덕이가 생각 중...
                  </div>
                </div>
              </div>
            )}

            {/* 자동 스크롤 추적을 위한 더미 타겟 엘리먼트 */}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* 하단 고정 입력창 및 퀵 메뉴 */}
      /* 웹뷰최적화: 모바일 기기의 하단 바/곡면 가림을 방지하기 위해 env(safe-area-inset-bottom) 반응형 패딩 적용 */
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-inha-border px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-4 z-50">
        
        {/* 퀵 메뉴 영역 (화살표 외부 배치) */}
        <div className="w-full flex items-center justify-center gap-1 md:gap-3">
          
          {/* 좌측 화살표 (데스크탑 전용) */}
          <div className="hidden md:flex w-10 justify-center">
            {showLeftArrow && (
              <button 
                onClick={() => scroll('left')}
                className="w-8 h-8 flex items-center justify-center bg-white border border-inha-border rounded-full shadow-sm text-inha-blue hover:bg-gray-50 hover:shadow-md active:scale-90 transition-all"
                title="왼쪽으로 스크롤"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 퀵 메뉴 버튼 리스트 영역 */}
          <div className="w-full max-w-[600px] relative group overflow-hidden">
            {/* 스크롤 컨테이너 */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="w-full flex gap-2.5 overflow-x-auto py-1.5 px-4 justify-start whitespace-nowrap scroll-smooth no-scrollbar"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {quickMenus.map((menu) => (
                menu.path.startsWith('/') ? (
                  <Link
                    key={menu.label}
                    to={menu.path}
                    className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-white/80 to-inha-blue/5 backdrop-blur-md border border-inha-blue/15 text-gray-700 text-xs md:text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(28,100,242,0.12)] hover:border-inha-blue/30 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
                  >
                    {menu.label}
                  </Link>
                ) : (
                  <button
                    key={menu.label}
                    /* 버튼 클릭 시 한글 키워드만 쪼개서 handleSend로 즉시 원클릭 작동하게 연동 완료!*/
                    onClick={() => handleSend(menu.label.split(' ')[1])}
                    className="inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r from-white/80 to-inha-blue/5 backdrop-blur-md border border-inha-blue/15 text-gray-700 text-xs md:text-sm font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(28,100,242,0.12)] hover:border-inha-blue/30 active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
                  >
                    {menu.label}
                  </button>
                )
              ))}
            </div>

            {/* 좌우 그라데이션 마스크 (스크롤 가능 여부 시각화) */}
            <div className={`hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`hidden md:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* 우측 화살표 (데스크탑 전용) */}
          <div className="hidden md:flex w-10 justify-center">
            {showRightArrow && (
              <button 
                onClick={() => scroll('right')}
                className="w-8 h-8 flex items-center justify-center bg-white border border-inha-border rounded-full shadow-sm text-inha-blue hover:bg-gray-50 hover:shadow-md active:scale-90 transition-all"
                title="오른쪽으로 스크롤"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 메시지 입력 영역 */}
        <div className="w-full max-w-[600px] relative flex items-center px-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="인덕이에게 질문을 입력하세요..."
            className="w-full h-12 md:h-14 pl-6 pr-14 bg-inha-bg border border-inha-border-input rounded-inha-input outline-none focus:border-inha-blue focus:ring-4 focus:ring-inha-blue/5 transition-all text-inha-text-main placeholder:text-inha-text-sub text-sm md:text-base shadow-inner"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="absolute right-4 w-9 h-9 md:w-10 md:h-10 bg-inha-blue rounded-full flex items-center justify-center text-white hover:bg-opacity-90 active:scale-95 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="hidden md:block text-[10px] text-inha-text-sub">© 2024 Inha Technical College. Smart Chatbot Service.</p>
      </footer>
    </div>
  )
}
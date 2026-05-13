import { useState } from 'react'
import Header from '../components/Header'
import induckMascot from '../assets/induck-i.svg'
import { Link } from 'react-router-dom'

/**
 * 챗봇 메시지 타입 정의
 * role: 'user' (사용자) | 'bot' (인덕이)
 */
interface Message {
  role: 'user' | 'bot';
  content: string;
}

/**
 * 메인 챗봇 페이지 컴포넌트
 */
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // 메시지 전송 핸들러
  const handleSend = () => {
    if (!input.trim()) return
    
    // 사용자 메시지 추가
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    
    // 인덕이 응답 시뮬레이션
    setIsTyping(true)
    setTimeout(() => {
      const botMsg: Message = { 
        role: 'bot', 
        content: `안녕하세요! "${input}"에 대해 궁금하시군요? 현재 이 기능은 준비 중입니다. 곧 인하공전의 스마트한 도우미가 되어 드릴게요! 🐥` 
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  // 하단 퀵 메뉴 버튼 구성
  const quickMenus = [
    { label: '📅 학사일정', path: '/calendar' },
    { label: '🗺️ 캠퍼스맵', path: '/map' },
    { label: '📢 공지사항', path: '/calendar' },
    { label: '🍱 식단안내', path: '/cafeteria' },
    { label: '💰 장학금', path: '#' },
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
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-inha-pill-bg flex items-center justify-center border border-inha-border overflow-hidden">
                    <img src={induckMascot} alt="Bot" className="w-full h-full object-cover scale-110" />
                  </div>
                  <div className="p-3 bg-white border border-inha-border rounded-inha-card rounded-tl-none text-inha-text-sub text-xs">
                    인덕이가 생각 중...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 하단 고정 입력창 및 퀵 메뉴 */}
      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-inha-border px-4 pt-4 pb-8 flex flex-col items-center gap-4 z-50">
        {/* 퀵 메뉴 버튼 리스트 */}
        <div className="w-full max-w-2xl flex gap-2 md:gap-3 overflow-x-auto no-scrollbar px-4 justify-start md:justify-center">
          {quickMenus.map((menu) => (
            menu.path.startsWith('/') ? (
              <Link
                key={menu.label}
                to={menu.path}
                className="px-4 py-2 md:px-5 md:py-2.5 rounded-inha-pill border border-inha-blue/30 text-inha-blue text-xs md:text-sm font-semibold hover:bg-inha-blue hover:text-white hover:border-inha-blue transition-all whitespace-nowrap shadow-sm bg-white"
              >
                {menu.label}
              </Link>
            ) : (
              <button
                key={menu.label}
                onClick={() => setInput(menu.label.split(' ')[1])}
                className="px-4 py-2 md:px-5 md:py-2.5 rounded-inha-pill border border-inha-blue/30 text-inha-blue text-xs md:text-sm font-semibold hover:bg-inha-blue hover:text-white hover:border-inha-blue transition-all whitespace-nowrap shadow-sm bg-white"
              >
                {menu.label}
              </button>
            )
          ))}
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
            onClick={handleSend}
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

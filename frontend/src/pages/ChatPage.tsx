import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import induckMascot from '../assets/induck-i.webp'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { sendMessage, type ChatMessage } from '../lib/api'

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

  /* 메시지 전송 핸들러 */
  const handleSend = async (textToSend?: string) => {
    const targetText = textToSend || input;
    if (!targetText.trim()) return
    
    /* 사용자 메시지 추가 */
    const userMsg: Message = { role: 'user', content: targetText }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    
    if (!textToSend) {
      setInput('')
    }
    
    /* 인덕이 응답 호출 시작 */
    setIsTyping(true)
    
    let fullReceivedText = ''
    let currentlyDisplayedText = ''
    let isMessageAdded = false
    let typingInterval: ReturnType<typeof setInterval> | null = null

    try {
      // API 호출 형식에 맞춰 변환 (bot -> assistant)
      const apiMessages: ChatMessage[] = updatedMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      }))
      
      await sendMessage(apiMessages, (partialContent) => {
        fullReceivedText = partialContent
        
        // 첫 데이터 수신 시 '생각 중' 상태 해제 및 메시지 박스 생성
        if (!isMessageAdded && fullReceivedText.length > 0) {
          isMessageAdded = true
          setIsTyping(false)
          setMessages(prev => [...prev, { role: 'bot', content: '' }])
          
          // 타이핑 시뮬레이션 시작
          typingInterval = setInterval(() => {
            if (currentlyDisplayedText.length < fullReceivedText.length) {
              // 한 글자씩 추가 (실제 수신된 텍스트를 따라잡음)
              currentlyDisplayedText += fullReceivedText[currentlyDisplayedText.length]
              setMessages(prev => {
                const updated = [...prev]
                if (updated[updated.length - 1].role === 'bot') {
                  updated[updated.length - 1] = { ...updated[updated.length - 1], content: currentlyDisplayedText }
                }
                return updated
              })
            } else if (!typingInterval) {
              // 스트리밍이 끝났고 타이핑도 다 했으면 종료
              clearInterval(typingInterval!)
            }
          }, 20) // 20ms 간격으로 부드럽게 출력
        }
      })
      
      // 스트리밍 종료 후 남은 텍스트가 있다면 모두 출력 보장
      if (typingInterval) {
        const finalizeInterval = setInterval(() => {
          if (currentlyDisplayedText.length < fullReceivedText.length) {
            currentlyDisplayedText += fullReceivedText[currentlyDisplayedText.length]
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: currentlyDisplayedText }
              return updated
            })
          } else {
            clearInterval(finalizeInterval)
            clearInterval(typingInterval!)
          }
        }, 10)
      }

    } catch (err) {
      console.error('Failed to get response:', err)
      setIsTyping(false)
      const errorMsgContent = '미안하덕! 서버와 연결하는 중에 문제가 생겼덕. 잠시 후 다시 시도해달덕!'
      setMessages(prev => {
        // 이미 메시지 박스가 추가되었다면 내용만 변경, 아니면 새로 추가
        if (isMessageAdded) {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'bot', content: errorMsgContent }
          return updated
        }
        return [...prev, { role: 'bot', content: errorMsgContent }]
      })
    } finally {
      setIsTyping(false)
    }
  }

  /* [Vercel 빌드 보장용 함수] */
  /* 일반 텍스트 내의 마크다운 개행 및 글자 강조 문법을 안전하게 가공 */
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, lineIdx) => {
      let renderedLine = line;
      
      /* ### 소제목 처리 */
      if (renderedLine.startsWith('### ')) {
        return <h3 key={lineIdx} className="text-base font-bold text-inha-blue mt-2 mb-1">{renderedLine.replace('### ', '')}</h3>;
      }
      
      /* ** 볼드체 처리 (정규식 교체) */
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(renderedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(renderedLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-inha-blue">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < renderedLine.length) {
        parts.push(renderedLine.substring(lastIndex));
      }

      const finalLine = parts.length > 0 ? parts : renderedLine;

      /* 리스트 불릿 처리 */
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const cleanLine = line.trim().substring(2);
        return (
          <ul key={lineIdx} className="list-disc pl-4 text-sm my-0.5">
            <li>{finalLine === line ? cleanLine : finalLine}</li>
          </ul>
        );
      }

      return <p key={lineIdx} className="text-sm my-0.5 min-h-[1rem]">{finalLine}</p>;
    });
  };

  /* 하단 퀵 메뉴 버튼 구성 */
  const quickMenus = [
    { label: '📅 학사일정', path: '/calendar' },
    { label: '🗺️ 캠퍼스맵', path: '/map' },
    { label: '📢 공지사항', path: '/notices' },
    { label: '💼 취업정보', path: '/careers' },
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
                    {/* 💡 Vercel 빌드 호환성 100% 보장하는 파싱 렌더러 연동 */}
                    {msg.role === 'bot' ? (
                      <div className="text-inha-text-main leading-relaxed">
                        {renderFormattedContent(msg.content)}
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
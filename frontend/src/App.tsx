function App() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        {/* Header */}
        <header className="bg-inha-blue p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
            🐥
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">인하-봇 (인덕이)</h1>
            <p className="text-blue-100 text-xs">신입생 도우미 챗봇</p>
          </div>
        </header>

        {/* Chat Area (Placeholder) */}
        <main className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-inha-blue rounded-full flex items-center justify-center text-sm">🐥</div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%]">
              <p className="text-sm text-gray-800">
                안녕! 나는 인하공전 신입생 도우미 **인덕이**야! 🐥<br />
                학교 생활에 대해 궁금한 게 있으면 무엇이든 물어봐!
              </p>
            </div>
          </div>
        </main>

        {/* Quick Menu (Placeholder) */}
        <section className="p-3 bg-white border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['학사일정', '학생식당', '학생증 발급', '강의실 위치'].map((menu) => (
              <button
                key={menu}
                className="whitespace-nowrap px-4 py-2 bg-blue-50 text-inha-blue rounded-full text-xs font-semibold border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {menu}
              </button>
            ))}
          </div>
        </section>

        {/* Input Area */}
        <footer className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="인덕이에게 물어보세요..."
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-inha-blue outline-none"
          />
          <button className="bg-inha-blue text-white p-2 rounded-full hover:opacity-90 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </footer>
      </div>
    </div>
  )
}

export default App

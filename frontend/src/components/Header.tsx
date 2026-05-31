import { Link, useLocation } from 'react-router-dom'
import induckMascot from '../assets/induck-i.webp'

/**
 * 프로젝트 전반에서 사용되는 공통 헤더 컴포넌트
 * - 서비스 로고 및 메인 내비게이션(GNB) 포함
 * - 현재 경로(useLocation)에 따른 메뉴 활성화 스타일 적용
 */
export default function Header() {
  const location = useLocation();

  // 내비게이션 메뉴 구성 데이터
  const navMenus = [
    { label: '🤖 챗봇', path: '/' },
    { label: '📢 공지사항', path: '/notices' },
    { label: '📅 학사일정', path: '/calendar' },
    { label: '💼 취업정보', path: '/careers' },
    { label: '🗺️ 캠퍼스맵', path: '/map' },
    { label: '🍱 식단안내',path: '/mealPlan'},
  ];

  return (
    <header className="fixed top-0 w-full h-16 bg-white/90 backdrop-blur-md border-b border-inha-border flex items-center justify-between px-6 md:px-12 z-50">
      <div className="flex items-center gap-8">
        {/* 서비스 로고 및 홈 링크 */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={induckMascot} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-inha-blue tracking-tight hidden md:block">Inha Tech Bot</span>
        </Link>
        
        {/* 메인 내비게이션 메뉴 (GNB) */}
        <nav className="flex items-center gap-1.5 md:gap-2 bg-inha-bg p-1 rounded-xl border border-inha-border/50">
          {navMenus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`w-[85px] md:w-[110px] flex items-center justify-center h-8 md:h-10 rounded-lg text-[11px] md:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-white text-inha-blue shadow-sm ring-1 ring-inha-border/10' 
                    : 'text-gray-500 hover:text-inha-blue hover:bg-white/40'
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* 우측 유틸리티 영역 (현재 비어있음) */}
      </div>
    </header>
  )
}

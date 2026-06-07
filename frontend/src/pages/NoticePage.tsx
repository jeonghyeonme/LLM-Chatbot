import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Search, Bell, ChevronRight, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Notice {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  url: string; 
}

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('전체');
  const [loading, setLoading] = useState(true);

  const categories = ['전체', '학사', '장학', '일반', '취업', '행사'];

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        // 💡 팀장님의 최신 DB 스키마 컬럼 유실을 방지하기 위해 전체 와일드카드(*) 호출
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedData = data.map((item: any) => ({
            id: String(item.id),
            category: item.category || '일반',
            title: item.title || '제목 없음',
            author: item.author || '관리자',
            date: item.date || '2026-06-05',
            views: item.views || 0,
            url: item.url || '#', 
          }));
          setNotices(formattedData);
        }
      } catch (err) {
        console.error('Supabase 공지사항 로드 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // 💡 명세서 기술 규격: 대소문자/공백 무시 초정밀 검색 엔진
  const filteredNotices = notices.filter(notice => {
    const matchesTab = activeTab === '전체' || notice.category === activeTab;
    
    const cleanQuery = searchQuery.replace(/\s+/g, '').toLowerCase();
    const cleanTitle = (notice.title || '').replace(/\s+/g, '').toLowerCase();
    const cleanAuthor = (notice.author || '').replace(/\s+/g, '').toLowerCase();

    const matchesSearch = cleanTitle.includes(cleanQuery) || cleanAuthor.includes(cleanQuery);

    return matchesTab && matchesSearch;
  });

  // 💡 정현 팀장님 오더 사항: 클릭 시 실제 공지사항 주소로 새 창 리다이렉트
  const handleNoticeClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('해당 공지사항의 원본 링크가 존재하지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="text-inha-blue" />
                공지사항
              </h1>
              <p className="text-sm text-gray-500 mt-1">학교의 주요 소식을 빠르게 확인하세요.</p>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="제목, 작성자 검색..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-inha-border rounded-xl focus:outline-none focus:ring-2 focus:ring-inha-blue/20 focus:border-inha-blue transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === cat ? 'bg-inha-blue text-white shadow-md' : 'bg-white text-gray-600 border border-inha-border hover:border-inha-blue/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-inha-card border border-inha-border shadow-inha-card overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-inha-border text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">번호</div>
              <div className="col-span-2 text-center">카테고리</div>
              <div className="col-span-5">제목</div>
              <div className="col-span-2 text-center">작성자</div>
              <div className="col-span-2 text-center">작성일</div>
            </div>
            
            <div className="divide-y divide-inha-border">
              {loading ? (
                <div className="py-20 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-inha-blue animate-spin" />
                  <p className="text-sm">데이터를 안전하게 불러오는 중입니다...</p>
                </div>
              ) : filteredNotices.length > 0 ? (
                filteredNotices.map((notice, idx) => (
                  <div 
                    key={notice.id} 
                    onClick={() => handleNoticeClick(notice.url)}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 md:items-center hover:bg-gray-50 transition-colors group cursor-pointer"
                  >
                    <div className="hidden md:block col-span-1 text-center text-sm text-gray-400">{filteredNotices.length - idx}</div>
                    <div className="col-span-2 flex justify-start md:justify-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        notice.category === '학사' ? 'bg-blue-100 text-blue-600' :
                        notice.category === '장학' ? 'bg-green-100 text-green-600' :
                        notice.category === '취업' ? 'bg-purple-100 text-purple-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {notice.category}
                      </span>
                    </div>
                    <div className="col-span-5 text-sm md:text-base font-medium text-gray-900 group-hover:text-inha-blue transition-colors truncate flex items-center gap-1.5">
                      {notice.title}
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="col-span-2 text-center text-xs md:text-sm text-gray-500">{notice.author}</div>
                    <div className="col-span-2 text-center text-xs md:text-sm text-gray-400">{notice.date}</div>
                    <div className="md:hidden flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <span className="text-[10px] text-gray-400">조회수 {notice.views}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NoticePage;
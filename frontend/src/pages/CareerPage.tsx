import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { Briefcase, Building, ExternalLink, TrendingUp, Calendar, Loader2, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Career {
  id: string;
  category: string;
  title: string;
  url: string;
  date: string;
}

const CareerPage: React.FC = () => {
  const [activeDept, setActiveDept] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [careers, setCareers] = useState<Career[]>([]);
  const [departments, setDepartments] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

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
  }, [departments, loading])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const moveAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -moveAmount : moveAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase.from('careers').select('category');
        if (error) throw error;
        if (data) {
          const uniqueCats = Array.from(new Set(data.map(item => item.category)));
          setDepartments(['전체', ...uniqueCats.sort()]);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCareers = async () => {
      setLoading(true);
      try {
        let query = supabase.from('careers').select('*').order('date', { ascending: false });
        if (activeDept !== '전체') query = query.eq('category', activeDept);
        const { data, error } = await query.limit(50);
        if (error) throw error;
        setCareers(data || []);
      } catch (error) {
        console.error('Failed to load careers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCareers();
  }, [activeDept]);

  // 통합 검색 엔진 (제목 + 학과명)
  const filteredCareers = careers.filter(career => {
    const cleanQuery = searchQuery.replace(/\s+/g, '').toLowerCase();
    const cleanTitle = (career.title || '').replace(/\s+/g, '').toLowerCase();
    const cleanDept = (career.category || '').replace(/\s+/g, '').toLowerCase();
    
    return cleanTitle.includes(cleanQuery) || cleanDept.includes(cleanQuery);
  });

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans text-inha-text-main">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="text-inha-blue" />
                취업 정보 센터
              </h1>
              <p className="text-sm text-gray-500 mt-1">각 학과별 최신 채용 공고를 확인하세요.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="공고 제목, 학과 검색..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-inha-border rounded-xl focus:outline-none focus:ring-2 focus:ring-inha-blue/20 focus:border-inha-blue transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-inha-border shadow-sm whitespace-nowrap">
                <TrendingUp className="w-4 h-4 text-inha-blue" />
                <span className="text-sm font-bold text-gray-700">검색 결과 <span className="text-inha-blue ml-1">{filteredCareers.length}건</span></span>
              </div>
            </div>
          </div>

          <div className="relative group mb-8">
            {showLeftArrow && (
              <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-inha-border rounded-full shadow-sm text-inha-blue">
                <ChevronLeft size={18} />
              </button>
            )}
            <div ref={scrollRef} onScroll={checkScroll} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {departments.map(dept => (
                <button key={dept} onClick={() => setActiveDept(dept)} className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${activeDept === dept ? 'bg-inha-blue text-white shadow-md' : 'bg-white text-gray-600 border border-inha-border hover:border-inha-blue/30'}`}>
                  {dept}
                </button>
              ))}
            </div>
            {showRightArrow && (
              <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-inha-border rounded-full shadow-sm text-inha-blue">
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-inha-blue" />
                <p className="font-medium">취업 정보를 불러오는 중입니다...</p>
              </div>
            ) : filteredCareers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCareers.map(job => (
                  <div key={job.id} className="bg-white rounded-inha-card border border-inha-border p-6 hover:shadow-lg hover:border-inha-blue/30 transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-inha-blue/5 group-hover:border-inha-blue/10 transition-colors">
                          <Building className="w-6 h-6 text-gray-400 group-hover:text-inha-blue" />
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-600">{job.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-inha-blue transition-colors line-clamp-2 min-h-[3.5rem] leading-snug">{job.title}</h3>
                    </div>
                    <div className="pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />게시일: {job.date}</div>
                      </div>
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 bg-inha-bg text-inha-blue font-bold rounded-xl group-hover:bg-inha-blue group-hover:text-white transition-all shadow-sm">상세보기 <ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerPage;

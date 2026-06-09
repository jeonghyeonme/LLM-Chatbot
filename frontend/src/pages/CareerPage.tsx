import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Briefcase, Building, ExternalLink, Search, TrendingUp, Calendar, Loader2 } from 'lucide-react';
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
  const [careers, setCareers] = useState<Career[]>([]);
  const [departments, setDepartments] = useState<string[]>(['전체']);
  const [loading, setLoading] = useState(true);

  // 학과 카테고리 로드 (Supabase 직접 접근)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('category');
        
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

  // 공고 데이터 로드 (Supabase 직접 접근)
  useEffect(() => {
    const loadCareers = async () => {
      setLoading(true);
      try {
        let query = supabase.from('careers').select('*').order('date', { ascending: false });
        
        if (activeDept !== '전체') {
          query = query.eq('category', activeDept);
        }

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

  return (
    <div className="min-h-screen bg-inha-bg flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6 md:px-12 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* 히어로 섹션 */}
          <div className="bg-gradient-to-r from-inha-blue to-blue-600 rounded-[2rem] p-8 md:p-12 mb-12 text-white relative overflow-hidden shadow-xl shadow-inha-blue/20">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                <Briefcase className="w-10 h-10" />
                취업 정보 센터
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                각 학과 홈페이지에 게시된 최신 취업처 정보와 채용 공고를 한눈에 확인하세요.<br />
                인하덕이가 여러분의 꿈을 응원합니다!
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">전체 공고</p>
                    <p className="text-xl font-bold">{careers.length}건</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 장식용 아이콘 */}
            <Briefcase className="absolute -right-12 -bottom-12 w-64 h-64 opacity-10 rotate-12" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 사이드바: 학과 필터 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-inha-card border border-inha-border p-6 sticky top-28 h-fit max-h-[70vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Search className="w-5 h-5 text-inha-blue" />
                  학과별 필터
                </h3>
                <div className="flex flex-col gap-1">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeDept === dept 
                          ? 'bg-inha-blue text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 메인: 채용 공고 리스트 */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeDept} 채용 공고 <span className="text-inha-blue text-sm ml-2">{careers.length}건</span>
                </h2>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-inha-blue" />
                  <p className="font-medium">취업 정보를 불러오는 중입니다...</p>
                </div>
              ) : careers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {careers.map(job => (
                    <div key={job.id} className="bg-white rounded-inha-card border border-inha-border p-6 hover:shadow-lg hover:border-inha-blue/30 transition-all group flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-inha-blue/5 group-hover:border-inha-blue/10 transition-colors">
                            <Building className="w-6 h-6 text-gray-400 group-hover:text-inha-blue" />
                          </div>
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-600">
                            {job.category}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-inha-blue transition-colors line-clamp-2 min-h-[3.5rem]">
                          {job.title}
                        </h3>
                      </div>

                      <div className="pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            게시일: {job.date}
                          </div>
                        </div>
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 bg-inha-bg text-inha-blue font-bold rounded-xl group-hover:bg-inha-blue group-hover:text-white transition-all"
                        >
                          상세보기
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-inha-card border-2 border-dashed border-inha-border py-20 flex flex-col items-center justify-center text-gray-400 gap-4 text-center px-6">
                  <Briefcase className="w-12 h-12 opacity-20" />
                  <div>
                    <p className="text-lg font-bold text-gray-500">등록된 채용 공고가 없습니다.</p>
                    <p className="text-sm mt-1">다른 학과를 선택하거나 나중에 다시 확인해 주세요.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerPage;

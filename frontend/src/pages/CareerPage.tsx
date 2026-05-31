import React, { useState } from 'react';
import Header from '../components/Header';
import { Briefcase, Building, MapPin, ExternalLink, Search, TrendingUp, Calendar } from 'lucide-react';

interface CareerInfo {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string; // '신입', '경력', '인턴'
  deadline: string;
  link: string;
  tags: string[];
}

const DUMMY_CAREERS: CareerInfo[] = [
  { 
    id: '1', 
    company: '대한항공', 
    title: '2026년 하반기 항공정비 부문 신입 채용', 
    location: '인천/김포', 
    type: '신입', 
    deadline: '2026-06-15', 
    link: 'https://recruit.koreanair.com',
    tags: ['항공정비', '대기업', '우대']
  },
  { 
    id: '2', 
    company: '인천국제공항공사', 
    title: '제15기 체험형 인턴 모집 공고', 
    location: '인천 영종도', 
    type: '인턴', 
    deadline: '2026-06-20', 
    link: 'https://airport.re.kr',
    tags: ['공기업', '인턴', '가점']
  },
  { 
    id: '3', 
    company: '삼성전자', 
    title: '반도체 설비/제조부문 생산직 채용', 
    location: '평택/화성', 
    type: '신입', 
    deadline: '2026-06-10', 
    link: 'https://samsungcareers.com',
    tags: ['반도체', '생산직', '대기업']
  },
  { 
    id: '4', 
    company: '현대자동차', 
    title: '자동차 정비 및 서비스 어드바이저 모집', 
    location: '전국', 
    type: '신입/경력', 
    deadline: '채용시 마감', 
    link: 'https://recruit.hyundai.com',
    tags: ['자동차', '정비', '서비스']
  },
];

const CareerPage: React.FC = () => {
  const [activeDept, setActiveDept] = useState('전체');

  const departments = ['전체', '항공기계과', '컴퓨터정보과', '전기정보과', '기계설계과', '메카트로닉스과'];

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
                인덕이가 여러분의 꿈을 응원합니다!
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">금주 신규 공고</p>
                    <p className="text-xl font-bold">12건</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">주요 협약 기업</p>
                    <p className="text-xl font-bold">45개</p>
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
              <div className="bg-white rounded-inha-card border border-inha-border p-6 sticky top-28">
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
                <div className="mt-8 pt-6 border-t border-inha-border">
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-inha-text-sub text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    워크넷 바로가기
                  </button>
                </div>
              </div>
            </div>

            {/* 메인: 채용 공고 리스트 */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  실시간 채용 공고 <span className="text-inha-blue text-sm ml-2">{DUMMY_CAREERS.length}건</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">최신순</span>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <span className="text-xs text-gray-400">마감순</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DUMMY_CAREERS.map(job => (
                  <div key={job.id} className="bg-white rounded-inha-card border border-inha-border p-6 hover:shadow-lg hover:border-inha-blue/30 transition-all group flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-inha-blue/5 group-hover:border-inha-blue/10 transition-colors">
                          <Building className="w-6 h-6 text-gray-400 group-hover:text-inha-blue" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          job.type === '인턴' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-inha-blue transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-inha-text-sub font-semibold mb-4">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {job.deadline}
                        </div>
                      </div>
                      <a 
                        href={job.link} 
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
              
              {/* 추가 로딩 버튼 */}
              <button className="w-full py-4 border-2 border-dashed border-inha-border text-inha-text-sub font-bold rounded-2xl hover:bg-gray-50 hover:border-inha-blue/30 transition-all">
                채용 공고 더보기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerPage;

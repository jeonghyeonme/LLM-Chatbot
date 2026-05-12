import React, { useState } from 'react';
import { MapPin, Search, Building2, Coffee, Utensils, BookOpen, Info } from 'lucide-react';
import Header from '../components/Header';

/**
 * 시설 카테고리 타입 정의
 */
type CategoryType = 'building' | 'food' | 'cafe' | 'library' | 'other';

/**
 * 시설 정보 인터페이스
 */
interface Facility {
  id: string;
  name: string;
  category: CategoryType;
  location: string;
  description: string;
  image?: string;
}

/**
 * 캠퍼스 시설 더미 데이터 (추후 API 연동 예정)
 */
const FACILITIES: Facility[] = [
  { id: '1', name: '본관', category: 'building', location: '캠퍼스 중앙', description: '대학 본부 및 행정실 위치' },
  { id: '2', name: '학생회관', category: 'building', location: '본관 옆', description: '학생식당, 동아리실, 편의시설' },
  { id: '3', name: '도서관', category: 'library', location: '캠퍼스 서측', description: '학습 및 도서 대여' },
  { id: '4', name: '인덕재', category: 'other', location: '기숙사 구역', description: '학생 기숙사' },
  { id: '5', name: '카페 블루팟', category: 'cafe', location: '학생회관 1층', description: '교내 인기 카페' },
  { id: '6', name: '교직원 식당', category: 'food', location: '본관 지하 1층', description: '조용하고 정갈한 식사' },
];

/**
 * 시설 카테고리 구성 데이터
 */
const CATEGORIES = [
  { id: 'all', label: '전체', icon: <Info className="w-4 h-4" /> },
  { id: 'building', label: '건물', icon: <Building2 className="w-4 h-4" /> },
  { id: 'food', label: '식당', icon: <Utensils className="w-4 h-4" /> },
  { id: 'cafe', label: '카페', icon: <Coffee className="w-4 h-4" /> },
  { id: 'library', label: '도서관', icon: <BookOpen className="w-4 h-4" /> },
];

/**
 * 캠퍼스 맵 및 시설 안내 페이지
 */
const MapPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 필터링 로직: 카테고리 및 검색어 기준
  const filteredFacilities = FACILITIES.filter(f => 
    (activeCategory === 'all' || f.category === activeCategory) &&
    (f.name.includes(searchQuery) || f.description.includes(searchQuery))
  );

  return (
    <div className="flex flex-col h-screen bg-inha-bg animate-fade-in">
      <Header />
      
      {/* 상단 타이틀 및 검색 영역 */}
      <div className="p-6 pb-0 pt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="text-inha-blue" />
              캠퍼스 맵 및 시설 안내
            </h1>
            <p className="text-sm text-gray-500 mt-1">인하공전 캠퍼스 내 주요 시설을 확인해보세요.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="시설 이름 또는 키워드 검색..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-inha-border rounded-xl focus:outline-none focus:ring-2 focus:ring-inha-blue/20 focus:border-inha-blue transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 카테고리 필터 탭 */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-inha-blue text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-inha-border hover:border-inha-blue/30'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역: 맵(좌) + 리스트(우) */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 pt-0 overflow-hidden">
        
        {/* 캠퍼스 맵 영역 (현재 플레이스홀더) */}
        <div className="flex-1 bg-white border border-inha-border rounded-3xl relative overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-[#E5E8EE]/30 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-inha-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-10 h-10 text-inha-blue" />
              </div>
              <p className="text-gray-400 font-medium">캠퍼스 맵 데이터를 불러오는 중...</p>
              <div className="mt-4 flex gap-2 justify-center">
                <div className="w-2 h-2 bg-inha-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-inha-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-inha-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
          
          {/* 지도 컨트롤 UI (더미) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-2 bg-white rounded-lg shadow-sm border border-inha-border hover:bg-gray-50">+</button>
            <button className="p-2 bg-white rounded-lg shadow-sm border border-inha-border hover:bg-gray-50">-</button>
          </div>
        </div>

        {/* 시설 목록 사이드바 */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-hidden">
          <div className="font-semibold text-gray-900 flex items-center justify-between">
            <span>주요 시설 목록 ({filteredFacilities.length})</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 no-scrollbar pb-6">
            {filteredFacilities.length > 0 ? (
              filteredFacilities.map(facility => (
                <div 
                  key={facility.id}
                  onClick={() => setSelectedFacility(facility)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    selectedFacility?.id === facility.id 
                      ? 'bg-inha-blue/5 border-inha-blue ring-1 ring-inha-blue' 
                      : 'bg-white border-inha-border hover:border-inha-blue/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${
                      selectedFacility?.id === facility.id ? 'bg-inha-blue text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {facility.category === 'building' && <Building2 className="w-5 h-5" />}
                      {facility.category === 'food' && <Utensils className="w-5 h-5" />}
                      {facility.category === 'cafe' && <Coffee className="w-5 h-5" />}
                      {facility.category === 'library' && <BookOpen className="w-5 h-5" />}
                      {facility.category === 'other' && <Info className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{facility.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{facility.location}</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-1">{facility.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 시설 상세 정보 모달 */}
      {selectedFacility && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
            <div className="h-48 bg-inha-blue flex items-center justify-center relative">
              <div className="text-white flex flex-col items-center">
                <Building2 className="w-16 h-16 opacity-20 absolute scale-150 rotate-12" />
                <h2 className="text-3xl font-bold z-10">{selectedFacility.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-inha-blue/10 text-inha-blue text-xs font-bold rounded-full uppercase">
                  {selectedFacility.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {selectedFacility.location}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {selectedFacility.description}
                <br /><br />
                인하공업전문대학의 주요 시설로서 학생들의 편의와 학습을 위한 다양한 공간이 마련되어 있습니다. 
                상세 위치는 캠퍼스 맵의 실시간 위치 안내 서비스를 참조해 주세요.
              </p>
              
              <div className="mt-8 flex gap-3">
                <button className="flex-1 bg-inha-blue text-white py-3 rounded-xl font-bold hover:bg-inha-blue-dark transition-colors shadow-lg shadow-inha-blue/20">
                  길 찾기
                </button>
                <button className="flex-1 bg-white border border-inha-border text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                  상세 정보 더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;

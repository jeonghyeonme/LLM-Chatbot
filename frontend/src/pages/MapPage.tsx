import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  MapPin, Search, Building2, BookOpen, Info,
  Dumbbell, Home, Wrench, Users, DoorOpen,
} from 'lucide-react';
import { Container as MapDiv, NaverMap, Marker, InfoWindow } from 'react-naver-maps';
import Header from '../components/Header';
import { fetchFacilities, type Facility } from '../lib/api';
import { categorize, type FacilityCategory } from '../lib/categorize';
import { getDepartments } from '../lib/departments';

declare global {
  interface Window {
    naver: any;
  }
}

// 인하공전 캠퍼스 중심 좌표
const CAMPUS_CENTER = { lat: 37.4485, lng: 126.6573 };
const INITIAL_ZOOM = 16;

type CategoryFilter = FacilityCategory | 'all';

const CATEGORY_ICONS: Record<CategoryFilter, React.ReactNode> = {
  all: <Info className="w-4 h-4" />,
  building: <Building2 className="w-4 h-4" />,
  library: <BookOpen className="w-4 h-4" />,
  sports: <Dumbbell className="w-4 h-4" />,
  dorm: <Home className="w-4 h-4" />,
  practice: <Wrench className="w-4 h-4" />,
  club: <Users className="w-4 h-4" />,
  gate: <DoorOpen className="w-4 h-4" />,
  other: <Info className="w-4 h-4" />,
};

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'building', label: '건물' },
  { id: 'library', label: '도서관' },
  { id: 'sports', label: '운동시설' },
  { id: 'dorm', label: '기숙사' },
  { id: 'practice', label: '실습장' },
  { id: 'club', label: '동아리' },
  { id: 'gate', label: '출입구' },
  { id: 'other', label: '기타' },
];

interface FacilityWithCategory extends Facility {
  category: FacilityCategory;
}

const MapPage: React.FC = () => {
  const mapRef = useRef<any>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [selectedFacility, setSelectedFacility] = useState<FacilityWithCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [facilities, setFacilities] = useState<FacilityWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 시설 데이터 로드
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFacilities()
      .then((data) => {
        const withCategory: FacilityWithCategory[] = data.map((f) => ({
          ...f,
          category: categorize(f.name),
        }));
        setFacilities(withCategory);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setLoading(false));
  }, []);

  // 필터링
  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      const matchCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchSearch = !searchQuery || f.name.includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [facilities, activeCategory, searchQuery]);

  // 시설 선택 시 해당 위치로 이동
  const handleSelectFacility = (facility: FacilityWithCategory | null) => {
    setSelectedFacility(facility);
    if (facility && mapRef.current && typeof window !== 'undefined' && window.naver?.maps) {
      const location = new window.naver.maps.LatLng(facility.latitude, facility.longitude);
      mapRef.current.panTo(location);
    }
  };

  const openNaverDirections = (facility: FacilityWithCategory) => {
    // 도착지(2번째 슬롯)에 좌표를 넣고 ,,,ADDRESS_POI 를 붙여 목적지로 강제 인식시킴
    // 이동 수단을 transit(대중교통)으로 변경
    const url = `https://map.naver.com/v5/directions/-/${facility.longitude},${facility.latitude},${encodeURIComponent(facility.name)},,,ADDRESS_POI/-/transit`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-inha-bg animate-fade-in">
      <Header />

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

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-inha-blue text-white shadow-md'
                  : 'bg-white text-gray-600 border border-inha-border hover:border-inha-blue/30'
              }`}
            >
              {CATEGORY_ICONS[cat.id]}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 pt-0 overflow-hidden">
        {/* 네이버 지도 영역 */}
        <div className="flex-1 bg-white border border-inha-border rounded-3xl relative overflow-hidden shadow-sm">
          <MapDiv style={{ width: '100%', height: '100%' }}>
            <NaverMap
              defaultCenter={CAMPUS_CENTER}
              defaultZoom={INITIAL_ZOOM}
              ref={mapRef}
            >
              {filteredFacilities.map((f) => (
                <Marker
                  key={f.id}
                  position={{ lat: f.latitude, lng: f.longitude }}
                  title={f.name}
                  onClick={() => handleSelectFacility(f)}
                />
              ))}

              {selectedFacility && (
                <InfoWindow
                  position={{ lat: selectedFacility.latitude, lng: selectedFacility.longitude }}
                  content={`
                    <div style="padding: 12px; min-width: 150px; background-color: white; border-radius: 8px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); text-align: center;">
                      <h4 style="font-weight: bold; font-size: 14px; margin-bottom: 4px; color: #111827;">${selectedFacility.name}</h4>
                      <p style="font-size: 12px; color: #6B7280; margin: 0;">지도를 클릭하여 닫기</p>
                    </div>
                  `}
                />
              )}
            </NaverMap>
          </MapDiv>
        </div>

        {/* 시설 목록 사이드바 */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-hidden">
          <div className="font-semibold text-gray-900 flex items-center justify-between">
            <span>주요 시설 목록 ({filteredFacilities.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 no-scrollbar pb-6">
            {loading && <p className="text-center py-10 text-gray-400">불러오는 중…</p>}
            {error && <p className="text-center py-10 text-red-500">에러: {error}</p>}
            {!loading && !error && filteredFacilities.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Search className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
            {!loading && !error && filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                onClick={() => handleSelectFacility(facility)}
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
                    {CATEGORY_ICONS[facility.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{facility.name}</h3>
                    {(() => {
                      const depts = getDepartments(facility.name);
                      return depts.length > 0 ? (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {depts.join(', ')}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            ))}
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
              {(() => {
                const depts = getDepartments(selectedFacility.name);
                return depts.length > 0 ? (
                  <>
                    <h3 className="text-sm font-bold text-inha-blue mb-3">📚 입주 학과</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {depts.map((d) => (
                        <span
                          key={d}
                          className="px-3 py-1.5 bg-inha-blue/10 text-inha-blue text-xs font-semibold rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-4"></div>
                )}
              )()}

              <div className="flex gap-3">
                <button
                  onClick={() => openNaverDirections(selectedFacility)}
                  className="flex-1 bg-inha-blue text-white py-4 rounded-xl font-bold hover:bg-inha-blue-dark transition-colors shadow-lg shadow-inha-blue/20"
                >
                  길 찾기 (Naver Map)
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

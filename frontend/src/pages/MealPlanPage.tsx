import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { fetchMeals, type Meal } from '../lib/api';

type MealType = '조식' | '중식' | '간편식';

// ──────────────────────────────────────────────────────────────────────────────
// 날짜 헬퍼
// ──────────────────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, '0');
const toYMD = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const toMMDD = (d: Date) => `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

/** 오늘이 주말이면 가장 가까운 직전 금요일로 보정 (식당 미운영) */
function getInitialDate(): Date {
  const t = new Date();
  const day = t.getDay(); // 0=일, 6=토
  if (day === 0) return new Date(t.getFullYear(), t.getMonth(), t.getDate() - 2); // 일 → 금
  if (day === 6) return new Date(t.getFullYear(), t.getMonth(), t.getDate() - 1); // 토 → 금
  return t;
}

/** 주말 건너뛰며 하루 이동 (금→월 점프 / 월→금 점프) */
function shiftWeekday(date: Date, dir: 1 | -1): Date {
  const day = date.getDay();
  let delta: number = dir;
  if (dir === 1 && day === 5) delta = 3;   // 금 → 다음 주 월
  if (dir === -1 && day === 1) delta = -3; // 월 → 지난 주 금
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

const MealPlanPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate);
  const [selectedType, setSelectedType] = useState<MealType>('중식');

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedYMD = toYMD(selectedDate);

  // 날짜 변경 시 해당 일자의 모든 끼니 페칭 (탭은 클라이언트 필터)
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMeals({ date: selectedYMD })
      .then(setMeals)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [selectedYMD]);

  // 탭별 필터링
  //   - 조식: meal_type === '조식'
  //   - 중식: meal_type === '중식' AND menu_category !== '간편식'
  //   - 간편식: menu_category === '간편식' (DB상 meal_type 은 '중식'으로 저장돼있음)
  const filteredMeals = meals.filter(m => {
    if (selectedType === '간편식') return m.menu_category === '간편식';
    if (selectedType === '조식')   return m.meal_type === '조식';
    if (selectedType === '중식')   return m.meal_type === '중식' && m.menu_category !== '간편식';
    return false;
  });

  const moveDate = (dir: 1 | -1) => {
    setSelectedDate(prev => shiftWeekday(prev, dir));
  };

  return (
    <>
      <Header />
      <div className="pt-28 pb-12 px-6 bg-[#fbfcfd] min-h-screen font-sans max-w-5xl mx-auto">

        {/* 날짜 선택기 */}
        <div className="flex items-center justify-center gap-10 mb-12">
          <button onClick={() => moveDate(-1)} className="text-slate-300 hover:text-slate-600 text-2xl transition-colors">〈</button>
          <div className="text-center">
            <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-tight">{WEEKDAY[selectedDate.getDay()]}요일</p>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              {selectedDate.getFullYear()}.{toMMDD(selectedDate)}
            </h2>
          </div>
          <button onClick={() => moveDate(1)} className="text-slate-300 hover:text-slate-600 text-2xl transition-colors">〉</button>
        </div>

        {/* 식사 타입 탭 */}
        <div className="flex justify-center gap-3 mb-12">
          {(['조식', '중식', '간편식'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-10 py-2.5 rounded-full text-1xs font-bold transition-all ${
                selectedType === t ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 상태 표시 */}
        {loading && (
          <p className="text-center text-slate-400 py-10">불러오는 중…</p>
        )}
        {error && (
          <p className="text-center text-red-500 py-10">에러: {error}</p>
        )}
        {!loading && !error && filteredMeals.length === 0 && (
          <p className="text-center text-slate-400 py-10">등록된 {selectedType} 메뉴가 없습니다.</p>
        )}

        {/* 식단 카드 리스트 */}
        <div className={`grid gap-8 ${selectedType === '중식' && filteredMeals.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {filteredMeals.map((meal) => {
            // 중식 일반/특식만 카테고리 라벨 표시. 조식/간편식은 단일 메뉴라 '오늘의 메뉴'
            const cornerLabel =
              selectedType === '중식' && meal.menu_category
                ? `메뉴 (${meal.menu_category})`
                : '오늘의 메뉴';

            return (
              <div
                key={meal.id}
                className="bg-white rounded-[45px] p-10 border-[1.5px] border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-baseline justify-between mb-10">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                    {cornerLabel}
                  </h3>

                  <span className="text-lg font-extrabold text-blue-600 bg-blue-50 px-4 py-1 rounded-2xl tracking-tight">
                    {meal.price}
                  </span>
                </div>

                <div className="space-y-5">
                  {meal.menu_items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-200" />
                      <p className="text-slate-600 text-[1.1rem] font-medium leading-snug tracking-tight">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MealPlanPage;

import React, { useState } from 'react';
import Header from '../components/Header';

const CafeteriaPage: React.FC = () => {
  const dateList = [
    { d: '05.11', w: '월' }, { d: '05.12', w: '화' }, { d: '05.13', w: '수' },
    { d: '05.14', w: '목' }, { d: '05.15', w: '금' }
  ];

  const [dateIdx, setDateIdx] = useState(1);
  const [selectedType, setSelectedType] = useState<'조식' | '중식' | '간편식'>('중식');

  const meals = [
    { id: 1, date: '05.12', type: '조식', menu: '우삼겹 된장찌개, 쌀밥, 쏘야케찹볶음, 함박스테이크, 배추김치', price: '5,000원' },
    { id: 2, date: '05.12', type: '중식', corner: '메뉴 A (일반)', menu: '순살감자탕&수제비, 비사리수수밥, 맛쵸킹탕수육, 쑥갓두부무침, 깍두기', price: '5,500원' },
    { id: 3, date: '05.12', type: '중식', corner: '메뉴 B (특식)', menu: '지코바 치밥, 팽이장국, 회오리감자, 그린샐러드, 배추김치', price: '6,500원' },
    { id: 4, date: '05.12', type: '간편식', menu: '스넥코너: 떡볶이, 순대, 어묵, 라면, 주먹밥 등', price: '4,500원' },
  ];

  const selectedDate = dateList[dateIdx];
  const filteredMeals = meals.filter(m => m.date === selectedDate.d && m.type === selectedType);

  const moveDate = (dir: number) => {
    const nextIdx = dateIdx + dir;
    if (nextIdx >= 0 && nextIdx < dateList.length) setDateIdx(nextIdx);
  };

  return (
    <>
      <Header />
      <div className="pt-28 pb-12 px-6 bg-[#fbfcfd] min-h-screen font-sans max-w-5xl mx-auto">
        
        {/* 날짜 선택기 */}
        <div className="flex items-center justify-center gap-10 mb-12">
          <button onClick={() => moveDate(-1)} disabled={dateIdx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-2xl transition-colors">〈</button>
          <div className="text-center">
            <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-tight">{selectedDate.w}요일</p>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{selectedDate.d}</h2>
          </div>
          <button onClick={() => moveDate(1)} disabled={dateIdx === dateList.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20 text-2xl transition-colors">〉</button>
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

        {/* 식단 카드 리스트 */}
        <div className={`grid gap-8 ${selectedType === '중식' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {filteredMeals.map((meal) => (
            <div 
              key={meal.id} 
              className="bg-white rounded-[45px] p-10 border-[1.5px] border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-baseline justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                  {meal.corner || '오늘의 메뉴'}
                </h3>
                
                <span className="text-lg font-extrabold text-blue-600 bg-blue-50 px-4 py-1 rounded-2xl tracking-tight">
                  {meal.price}
                </span>
              </div>
              
              <div className="space-y-5">
                {meal.menu.split(',').map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-200" />
                    <p className="text-slate-600 text-[1.1rem] font-medium leading-snug tracking-tight">
                      {item.trim()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CafeteriaPage;
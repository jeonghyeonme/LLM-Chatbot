# 📂 프론트엔드 전수 조사 결과 보고서 (Frontend Investigation Report)

본 문서는 인하공업전문대학 신입생 도우미 '인덕이' 프로젝트의 프론트엔드 시스템에 대한 전수 조사 결과를 상세히 기록한 문서입니다.

---

## 1. 기술 스택 및 개발 환경 (Tech Stack)

- **Library**: React 19 (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **Maps**: React Naver Maps (메인), React Kakao Maps SDK (보조)
- **Backend Integration**: Supabase JS SDK, Fetch API (Streaming)

---

## 2. 프로젝트 구조 및 라우팅 (Routing & Structure)

### 2.1 페이지 구성
| 경로 | 컴포넌트명 | 주요 기능 |
| :--- | :--- | :--- |
| `/` | `ChatPage` | 마스코트 기반 지능형 챗봇 인터페이스 (메인) |
| `/mealPlan` | `MealPlanPage` | 학생식당 식단 정보 제공 및 시각화 |
| `/calendar` | `CalendarPage` | 학사 일정 조회 및 달력 뷰 제공 |
| `/map` | `MapPage` | 캠퍼스 맵, 건물 위치 정보 및 길찾기 기능 |
| `/notices` | `NoticePage` | 학사/장학/행사 등 통합 공지사항 리스트 |
| `/careers` | `CareerPage` | 학과별 취업 정보 및 추천 채용 공고 제공 |

---

## 3. 핵심 기능 구현 상세 (Core Features)

### 3.1 지능형 챗봇 스트리밍 (SSE)
- **통신 방식**: FastAPI 백엔드의 `/api/chat` 엔드포인트와 연결하여 `text/event-stream` 수신.
- **렌더링**: `ReadableStream`과 `TextDecoder`를 사용하여 LLM의 응답을 실시간으로 화면에 출력(Streaming UI).
- **세션 관리**: `crypto.randomUUID()`를 이용해 세션 ID를 생성하고 `localStorage`에 저장하여 2시간 동안 대화 컨텍스트 유지.

### 3.2 데이터 쿼리 전략 (Direct DB Access)
- **최적화**: 서버 부하 감소 및 응답 속도 향상을 위해 식단, 일정, 시설 정보는 백엔드를 거치지 않고 프론트엔드에서 **Supabase SDK를 이용해 직접 조회**.
- **데이터 가공**: API 레이어(`api.ts`)에서 식단 데이터의 가격 정보 매핑 및 메뉴 텍스트 파싱 로직 수행.

### 3.3 사용자 경험 (UI/UX)
- **Mascot-Driven**: '인덕이' 마스코트 캐릭터를 UI 곳곳에 배치하여 서비스의 정체성 강화.
- **Mobile-First**: 모바일 웹뷰 환경에 최적화된 하단 내비게이션 바 및 직관적인 카드형 UI 레이아웃.
- **Map Interaction**: 네이버 지도 위에 커스텀 마커와 정보 창을 사용하여 강의실 위치를 시각적으로 전달.

---

## 4. 데이터 모델 (Interfaces)

- `Schedule`: id, title, start_date, end_date, type(exam/info)
- `Meal`: id, date, meal_type, menu_items(string array), price
- `Facility`: id, name, latitude, longitude
- `ChatMessage`: role(user/bot), content

---

## 5. 결론 및 분석 의견
프론트엔드 시스템은 **사용자 중심의 빠른 정보 전달**에 최적화되어 있습니다. 특히 LLM의 느린 응답 속도를 보완하기 위한 스트리밍 인터페이스와, 정적 데이터의 즉각적인 로딩을 위한 Supabase 직접 연동 방식은 대학 신입생이라는 대상층에게 쾌적한 디지털 경험을 제공하기 위한 효과적인 설계로 평가됩니다.

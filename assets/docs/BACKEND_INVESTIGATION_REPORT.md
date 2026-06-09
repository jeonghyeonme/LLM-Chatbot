# 📂 백엔드 전수 조사 결과 보고서 (Backend Investigation Report)

본 문서는 인하공업전문대학 신입생 도우미 '인덕이' 프로젝트의 백엔드 시스템에 대한 전수 조사 결과를 상세히 기록한 문서입니다.

---

## 1. 시스템 아키텍처 (System Architecture)

- **Framework**: FastAPI (Python 3.12+)
- **Deployment**: Vercel Serverless Functions (Serverless 아키텍처)
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI Model**: Gemini 1.5 Flash (via LangChain)
- **Interface**: RESTful API + Server-Sent Events (SSE) for Streaming Chat

---

## 2. 데이터베이스 스키마 명세 (Database Schema)

### 2.1 주요 테이블 구조
| 테이블명 | 용도 | 핵심 컬럼 | 제약 조건 (Unique) |
| :--- | :--- | :--- | :--- |
| `meals` | 식단 정보 | date, meal_type, menu_content, restaurant_type | date, meal_type, category, restaurant |
| `schedules` | 학사 일정 | start_date, end_date, title | start_date, end_date, title |
| `notices` | 공지사항 | category, title, content(Markdown), url, views | category, external_id |
| `facilities` | 시설/지도 | name, latitude, longitude | name |
| `chat_history` | 대화 로그 | session_id, role, content, created_at | - |

### 2.2 보안 및 최적화
- **RLS (Row Level Security)**: 모든 테이블에 RLS 정책을 적용하여 익명 사용자의 읽기 권한을 제어하고 대화 내역은 세션별로 보호함.
- **Indexing**: `date`, `category`, `name` 등 주요 조회 조건에 인덱스를 생성하여 검색 성능 최적화.

---

## 3. 지능형 챗봇 구현 상세 (AI Implementation)

### 3.1 페르소나 및 프롬프트 엔지니어링
- **캐릭터**: 학교 마스코트 '인덕이'
- **말투**: 문장 끝에 '~덕!', '~했덕!' 등 접미사 강제 사용.
- **특이사항**: 실시간 시간 주입 및 도구 활용 규칙(지도 링크 형식, 공지 요약 방식 등) 정의.

### 3.2 LangChain 기반 도구(Tools) 설계
- `get_campus_meals`: 날짜별 식단 조회.
- `get_campus_schedules`: 기간별 학사 일정 조회.
- `get_campus_location`: 시설 위치 및 네이버 지도 링크 생성.
- `search_campus_notices`: 일반/학사 공지사항 검색.
- `search_career_info`: 취업 및 추천 채용 정보 검색.
- **`analyze_notice_image`**: 멀티모달(Vision) 기능을 활용하여 공지사항 내 이미지(안내문, 시간표 등) 분석.

---

## 4. 데이터 수집 엔진 (Crawler Service)

### 4.1 크롤링 기술 스택
- **Playwright**: 헤드리스 브라우저를 이용한 동적 콘텐츠(JavaScript 실행 결과) 렌더링 및 수집.
- **BeautifulSoup4**: 렌더링된 HTML의 구조적 파싱.
- **html2text**: 웹 페이지의 HTML 본문을 마크다운 형식으로 변환하여 LLM 컨텍스트 효율화.

### 4.2 데이터 갱신 전략
- **Upsert Strategy**: 학교 홈페이지 데이터와 DB 데이터를 비교하여 중복 없이 새로운 정보만 갱신하거나 변경된 내용을 업데이트함.
- **Error Handling**: 네트워크 지연 및 구조 변경에 대비한 `wait_for_selector` 및 예외 처리 로직 적용.

---

## 5. API 엔드포인트 및 통신

- `POST /api/chat`: 스트리밍 응답(SSE)을 지원하는 대화 엔드포인트. 도구 호출 및 대화 내역 저장을 자동 수행.
- `GET /api/data/directions`: 네이버 지도 API를 활용한 경로 탐색 프록시 기능.
- `GET /health`: 서버 상태 확인을 위한 헬스체크 엔드포인트.

---

## 6. 결론 및 분석 의견
백엔드 시스템은 **'운영 비용 제로'**와 **'높은 정보 정확도'**를 동시에 달성하도록 설계되었습니다. 특히 크롤링한 데이터를 마크다운으로 변환하여 저장하고, 이를 필요할 때만 AI가 도구를 통해 조회하는 **RAG(Retrieval-Augmented Generation)** 패턴을 효과적으로 구현하고 있습니다.

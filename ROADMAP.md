# 🐥 인하-봇 (induck-it) 통합 개발 로드맵

## 🏗️ 프로젝트 아키텍처 (Serverless Hybrid RAG)
> *프로젝트 개발 진행 상황에 따라 기술 스택 및 DB 구조는 유연하게 변경될 수 있습니다.*

- **정형 데이터 (JSON/DB)**: 식단표, 학사일정 등은 크롤링 후 Supabase DB에 저장. (프론트엔드에서 Supabase Client로 직접 조회하여 지연 시간 최소화)
- **비정형 데이터 (Vector DB)**: 공지사항, FAQ 등은 **Supabase pgvector**에 임베딩하여 적재.
- **LLM 엔진**: **Gemini 1.5 Flash**를 활용하여 비용 0원 유지 및 빠른 응답 생성.
- **데이터 수집 (Crawler)**: **GitHub Actions** + `Playwright`/`BeautifulSoup` (주기적 스케줄링 및 Supabase 직접 적재)

---

## 📅 통합 개발 로드맵 (Checklist & Guide)

### 1. 데이터 수집 및 지식 베이스 (Data)
- [x] **[D-1] GitHub Actions 기반 크롤링 자동화**
    - **대상**: 학교 홈페이지 학생식당 및 학사일정 페이지
    - **기술**: Python (`Playwright`, `bs4`) + GitHub Actions Workflow 스케줄링
    - **저장**: Supabase API를 통한 `meals`, `schedules` 테이블 직접 적재
- [ ] **[D-2] 공지사항 벡터화 파이프라인**
    - **대상**: 일반공지 및 학과 게시판
    - **기술**: GitHub Actions를 통한 주기적 임베딩 및 Supabase pgvector 적재
- [ ] **[D-3] 시설 데이터 정적 구축**
    - **대상**: 4호관 실습실, 학과 사무실, 학생 편의시설 위치 정보
    - **기술**: 정적 데이터 수집 및 JSON/CSV 변환 로직
    - **저장**: Supabase `facilities` 테이블 (장소명, 위치, 상세안내, 연락처)

### 2. 챗봇 지능 및 백엔드 고도화 (AI/API)
- [ ] **[A-1] API 엔드포인트 설계 및 AI 통합**
    - **Data Access**: 정형 데이터(식단, 일정 등)는 Supabase PostgREST(SDK)를 통해 프론트엔드에서 직접 조회
    - **Chat API**: `POST /api/chat` (인텐트 분석 및 답변 생성 전담)
    - **Streaming**: 사용자 경험 개선을 위한 SSE(Server-Sent Events) 스트리밍 답변 구조 설계
    - **AI Integration**: Gemini 1.5 Flash API 연동 및 Function Calling 활용 설계
- [ ] **[A-2] Gemini 라우팅 로직**
    - **핵심**: 질문 분석을 통한 '정적 정보 조회'와 'LLM 답변 생성' 분기
    - **기술**: `Gemini 1.5 Flash` (Function Calling 또는 분류 프롬프트)
    - **목표**: 답변 정확도 향상 및 불필요한 AI 토큰 소모 방지
- [ ] **[A-3] 인덕이 페르소나 프롬프트**
    - **핵심**: 마스코트 '인덕이'의 말투(친절함, '덕' 접미사) 및 학교 지식 주입
    - **기술**: `LangChain` PromptTemplate + SystemMessage 구성
    - **목표**: 일관된 브랜드 보이스(Brand Voice) 유지
- [ ] **[A-4] 서버리스 배포 최적화**
    - **핵심**: Vercel Serverless Functions 제약(Cold Start, 시간 제한) 대응
    - **기술**: FastAPI 엔트리포인트 구성 및 가벼운 의존성 관리
    - **목표**: Vercel 환경에서의 안정적인 API 구동
- [ ] **[A-5] 대화 문맥 유지**
    - **핵심**: 이전 질문 내용을 기억하여 연속적인 대화 흐름 지원
    - **기술**: `LangChain` ConversationBufferMemory + Supabase 세션 저장
    - **목표**: 지시어(그거, 거기) 포함 질문 처리 가능

### 3. 사용자 경험 및 인터페이스 (UI/UX)
- [x] **[U-1] 식단 페이지 (`/mealPlan`)**
    - **핵심**: 오늘의 학식 정보를 시각적 카드로 제공 (메뉴 A/B 구분)
    - **기술**: React + Tailwind CSS (카드 레이아웃)
    - **데이터**: Supabase `meals` 테이블 실시간 연동
- [x] **[U-2] 퀵 버튼 및 추천 질문**
    - **핵심**: 대화창 하단에 자주 묻는 질문 칩(Chip) 제공
    - **기술**: 가로 스크롤형 버튼 컴포넌트 구현 및 클릭 이벤트 처리
    - **목표**: 사용자 입력 최소화 및 원클릭 정보 제공
- [x] **[U-3] 채팅 고도화**
    - **핵심**: 스트리밍 답변, 마크다운 렌더링, 자동 스크롤 구현
    - **기술**: `react-markdown` + `useRef` (자동 스크롤)
    - **목표**: 실제 메신저와 유사한 부드러운 채팅 경험 제공
- [x] **[U-4] 모바일 웹뷰 최적화**
    - **핵심**: 스마트폰 환경에서 최상의 레이아웃 제공
    - **기술**: CSS `env(safe-area-inset-bottom)` 대응 및 반응형 그리드
    - **목표**: 모바일 브라우저에서 '앱'처럼 느껴지는 UI 밸런스 조정

---

## ⏳ 보류 및 추후 검토 항목
- **PWA 설정**: 웹앱 설치 기능 및 홈 화면 아이콘화 (핵심 기능 완성 후 검토)

---

## 💻 현재 개발 현황 (완료된 항목)

### 공통 (General)
- [x] 프로젝트 협업 컨벤션 정립 (Git 전략, 커밋 메시지 규칙 등)
- [x] 문서 통합 및 최적화 (README.md, PR 템플릿 수립)
- [x] Zero-Cost 서버리스 아키텍처 및 기술 스택 확정

### 프론트엔드 (Frontend)
- [x] React 프로젝트 초기화 및 Tailwind CSS 설정
- [x] 챗봇 메인 인터페이스 및 웰컴 카드 기본 구현
- [x] 인덕이 에셋 통합 및 페이지 내비게이션(Router) 구축
- [x] 식단 정보 조회 페이지 구현 및 Supabase 연동

### 백엔드 (Backend)
- [x] FastAPI 프로젝트 스캐폴딩 및 의존성 설정
- [x] 환경 변수(.env) 및 공통 로깅 모듈 구축
- [x] 기본 헬스체크 API 구현
- [x] Playwright 기반 식단/일정 크롤러 구현 완료


---

## 📝 작업 로그 (History)
- **2024-05-12**: 프로젝트 초기 기획 및 FE/BE 기본 아키텍처 구축.
- **2026-05-13**: 협업 컨벤션 정립, `induck-it` 브랜딩 적용 및 통합 로드맵 구축 완료.

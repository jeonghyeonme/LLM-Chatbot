# 🐥 인덕잇 (induck-it) 프로젝트 중간 발표
---

## 1. 프로젝트 기획 전환 및 브랜딩

기존 기획에서 대학 생활에 특화된 **'인하공업전문대학 신입생 도우미 챗봇'**으로 프로젝트의 방향성을 수정하였습니다.

*   **새로운 프로젝트명**: 인덕잇 (induck-it)
*   **핵심 가치**: 신입생들이 겪는 정보 접근의 어려움(학사 일정, 식단, 강의실 위치 등)을 AI 챗봇으로 해결.
*   **브랜드 보이스**: 명확한 정보 전달 + 공감형 인터랙션 + 능동적인 정보 제안.

## 2. 기획 구체화 및 문서화 (Documentation)

단순 아이디어를 넘어 작업에 활용 가능한 상세 명세서를 작성하였습니다.

*   **페르소나 디자인 (`01_persona_design.md`)**: 캐릭터의 정체성, 화법 디테일, 상황별 대응 패턴 정의.
*   **기술 사양서 (`02_technical_specification.md`)**: 서버리스 아키텍처, API 엔드포인트 설계, 데이터 구조(JSON/DB) 정의.
*   **초기 UI/UX 가이드라인 (`README_UI.md`)**: 직관적인 초기 UI 설계.
*   **통합 로드맵 (`ROADMAP.md`)**: 데이터 수집, AI 지능 고도화, UI/UX 개선 등 단계별 실행 계획 수립.

## 3. 개발 표준 및 컨벤션 정립 (Development Standards)

효율적인 협업과 유지보수를 위한 프로젝트 표준을 수립하였습니다.

*   **브랜치 전략**: `main`(배포), `dev`(개발 통합), `feature/*`(기능 개발) 기반의 Git Flow 적용.
*   **커밋 메시지 규칙**: `feat`, `fix`, `docs`, `chore`, `refactor` 등 접두사를 활용한 시맨틱 커밋 적용.
*   **기술 스택**: (개발 진행에 따라 변동 가능성 있음.)
    *   **Frontend**: React 19 (TypeScript) + Vite + Tailwind CSS
    *   **Backend**: FastAPI (Python)
    *   **Infrastructure**: Supabase (DB/Vector), Vercel (Deployment)

## 4. 주요 구현 현황 (Implementation Progress)

### 4.1. 프론트엔드 (Frontend)
*   **기본 구조 구축**: Vite 기반의 React 프로젝트 초기화 및 폴더 구조 최적화.
*   **라우팅 시스템**: `react-router-dom`을 활용하여 홈(채팅), 학사일정, 캠퍼스 맵 페이지 전환 기반 마련.
*   **핵심 페이지 레이아웃**:
    *   `ChatPage`: 대화형 인터페이스 및 웰컴 카드 디자인 적용.
    *   `CalendarPage` & `MapPage`: 정보 제공을 위한 전용 페이지 스캐폴딩.

### 4.2. 백엔드 (Backend)
*   **서버 스캐폴딩**: FastAPI 기반의 프로젝트 구조(`api`, `services`, `core` 등) 설계 및 초기화.
*   **환경 설정**: 로깅 시스템 및 공통 설정 모듈 구축 완료.

---

## 5. 향후 계획 (Next Steps)

1.  **데이터 수집 자동화**: 학교 홈페이지 크롤러 개발 (식단, 학사 일정).
2.  **RAG 시스템 구축**: Supabase pgvector를 활용한 공지사항 검색 엔진 구현.
3.  **챗봇 지능 고도화**: AI 모델 연동 및 인덕이 페르소나 주입.
4.  **UI/UX 디테일 개선**: 채팅 애니메이션 및 모바일 웹뷰 최적화.
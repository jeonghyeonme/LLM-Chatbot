# [논문 초안] LLM 기반의 대학 신입생 맞춤형 정보 제공 챗봇 시스템 설계 및 구현

## 1. 논문 기본 정보 (Front Matter)

- **국문 제목**: LLM 기반의 대학 신입생 맞춤형 정보 제공 챗봇 시스템 설계 및 구현
- **영문 제목**: Design and Implementation of LLM-based Customized Information Chatbot for University Freshmen
- **영문 초록 (Abstract)**:
  This paper proposes a customized information chatbot system, 'Induck-it', designed to assist university freshmen in navigating campus life. Freshmen often face difficulties in accessing essential information such as academic calendars, cafeteria menus, and classroom locations due to complex university portals. To solve this, we implemented a serverless-based intelligent chatbot platform using Large Language Models (LLM). The system utilizes Gemini 1.5 Flash for natural language processing and Supabase pgvector for Retrieval-Augmented Generation (RAG) to provide accurate information from university notices. We also designed a mascot-driven user interface to enhance user engagement. The proposed system aims to provide a zero-cost, high-efficiency information service for university students.
- **핵심어 (Keywords)**: Chatbot, Large Language Model (LLM), Retrieval-Augmented Generation (RAG), University Information System, Serverless Architecture

---

## 2. 본문 구성 (Body Sections)

### I. 서론 (Introduction)
- **연구 배경**: 대학 정보 시스템의 복잡성 증대로 인한 신입생들의 정보 접근성 저하.
- **연구 목적**: 신입생이 필요로 하는 학사 일정, 식단, 위치 정보 등을 대화형 인터페이스로 즉각 제공하는 지능형 가이드 구축.
- **논문의 기여**: 
    1. 운영 비용 0원을 목표로 하는 효율적인 서버리스 아키텍처 제시.
    2. RAG 기술과 실시간 크롤링을 결합한 하이브리드 데이터 제공 방식 적용.
    3. 학교 마스코트 '인덕이'를 활용한 친근한 UX 설계.

### II. 관련 연구 (Related Work)
- **기존 대학 챗봇의 한계**: 대부분 시나리오 기반(Rule-based)으로 유연한 답변이 어렵고 유지보수가 까다로움.
- **LLM 및 RAG 기술**: 최신 생성형 AI 기술과 외부 지식 베이스를 결합한 정보 추출 방식의 장점 기술.

### III. 제안하는 시스템 (Proposed System)
- **시스템 아키텍처**:
    - **Frontend**: React 19 기반 PWA (모바일 앱과 유사한 경험 제공).
    - **Backend**: FastAPI를 활용한 Vercel Serverless Functions.
    - **Data Management**: Supabase(PostgreSQL)를 이용한 정형 데이터 저장 및 pgvector를 이용한 비정형 데이터(공지사항) 벡터화.
- **데이터 파이프라인**: 
    - 대학 홈페이지 연동 크롤러(학사 일정, 식단).
    - 학과별 주요 취업처 및 자격증 정보 데이터베이스.
    - 공지사항 및 FAQ를 위한 RAG 시스템.
- **AI 페르소나 설계**: Gemini 1.5 Flash 모델에 '인덕이' 페르소나 주입을 위한 프롬프트 엔지니어링.

### IV. 구현 및 결과 분석 (Implementation and Results)
- **개발 환경**: React, TypeScript, Python 3.11, FastAPI, Supabase, Vercel.
- **주요 기능 구현**:
    - 실시간 채팅 및 퀵 버튼 인터페이스.
    - 지도 연동 강의실 위치 안내.
    - 학과 맞춤형 취업처 및 경력 개발 정보 제공 화면.
    - 학사 일정 및 학생식당 메뉴 자동 업데이트 화면.
- **평가**: 응답 속도 분석 및 정보 정확도 검증 (예: RAG를 통한 공지사항 검색 정확도).

### V. 결론 (Conclusion)
- **연구 요약**: LLM과 RAG를 결합하여 신입생을 위한 고도화된 정보 제공 시스템을 성공적으로 구축함.
- **기대 효과**: 정보 탐색 시간 단축 및 대학 생활 적응력 향상.
- **향후 과제**: AI 기반 맞춤형 취업 로드맵 추천 기능 추가, 개인화된 시간표 관리 기능 및 사용자 피드백 기반 답변 고도화.

---

## 3. 시각 자료 계획 (Figures & Tables)

- **Fig 1**: 전체 시스템 구성도 (Serverless Architecture Diagram)
- **Fig 2**: 데이터 수집 및 RAG 프로세스 흐름도
- **Fig 3**: 구현된 챗봇 인터페이스 및 마스코트 UI 화면
- **Table 1**: 사용된 기술 스택 및 오픈소스 라이브러리 목록
- **Table 2**: 기존 시스템과 제안 시스템의 비교 분석

---

## 4. 참고문헌 (References)

- 한국컴퓨터정보학회 논문지 투고 규정 준수.
- LLM, RAG, Serverless 관련 최신 논문 및 기술 문서 인용 예정.

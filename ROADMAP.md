# 인하-봇 (Inha-Bot) RAG & 크롤링 파이프라인 구현 로드맵

## 1. 프로젝트 아키텍처 (Hybrid RAG)
- **정형 데이터 (Rule-based)**: 식단표, 학사일정 등은 크롤링 후 JSON 등 구조화된 형태로 저장. API 요청 시 정확한 데이터를 즉각 응답.
- **비정형 데이터 (Vector DB)**: 공지사항, FAQ 등은 Chunking 후 ChromaDB에 임베딩하여 적재. LLM이 문맥을 파악해 답변 생성.
- **오케스트레이션**: 사용자 질문 의도(Intent)를 파악해 정형/비정형 데이터 조회를 라우팅하는 FastAPI 기반 아키텍처.
- **원칙**: 유지보수가 용이한 Clean Code 지향, 사이드 이펙트를 최소화하는 함수형(Functional) 크롤링 파이프라인.

## 2. 단계별 마일스톤 및 작업 로그

### [1단계] 백엔드 기반 환경 및 인프라 구축
- [x] FastAPI 프로젝트 스캐폴딩 및 `requirements.txt` 의존성 설정
- [x] 환경 변수(`.env`) 및 로깅(Logging) 모듈 설정
- **작업 로그:** 
    - `backend/` 디렉토리 구조(app, core, api 등) 생성 완료.
    - `requirements.txt`에 핵심 라이브러리(fastapi, langchain, bs4 등) 정의 완료.
    - Pydantic Settings 기반 `config.py` 및 공통 `logger.py` 구축 완료.
    - FastAPI 기본 엔드포인트(`/health`)를 포함한 `main.py` 작성 완료.

### [2단계] 윤리적 크롤링 파이프라인 코어 설계
- [ ] HTTP 요청, 재시도 로직, Rate Limiting을 담당하는 순수 함수 형태의 `Fetcher` 구현
- [ ] BeautifulSoup 기반 HTML `Parser` 인터페이스 설계
- **작업 로그:** (진행 대기)

### [3단계] 정형 데이터 크롤러 구현 및 로컬 저장
- [ ] ITC 식단 페이지 크롤러 구현 및 JSON 저장
- [ ] 학사일정 크롤러 구현 및 날짜 기반 검색 포맷 적용
- **작업 로그:** (진행 대기)

### [4단계] 비정형 데이터 크롤러 및 RAG 파이프라인 구축
- [ ] 공지사항/FAQ 게시판 크롤러 구현
- [ ] 수집된 데이터 Chunking, OpenAI 임베딩 적용 및 ChromaDB 연동
- **작업 로그:** (진행 대기)

### [5단계] LLM 오케스트레이션 및 API 엔드포인트 구현
- [ ] 사용자 질문 인텐트 분류기 (Router) 구현
- [ ] 최종 답변 생성을 위한 Prompt Engineering 및 LangChain 연동
- [ ] 프론트엔드 연동을 위한 `/chat` API 노출
- **작업 로그:** (진행 대기)

<<<<<<< Updated upstream
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
=======
# 마스코트 기반 인터페이스와 서버리스 아키텍처를 활용한 대학 신입생 지원 지능형 챗봇 설계 및 구현
## Design and Implementation of an Intelligent Chatbot for University Freshmen using Mascot-Driven UI and Serverless Architecture

### [요약 / Abstract]
본 논문에서는 대학 생활에 생소한 신입생들이 파편화된 학내 정보에 쉽고 친근하게 접근할 수 있도록 돕는 지능형 가이드 플랫폼 '인하덕'를 제안한다. 제안하는 시스템은 대학 마스코트를 활용한 사용자 친화적 인터페이스를 제공하며, 지속 가능한 서비스 운영을 위해 Vercel Serverless Functions와 Supabase를 결합한 제로 코스트(Zero-Cost) 아키처를 채택하였다. 기술적으로는 Gemini 1.5 Flash 모델을 기반으로 한 RAG(Retrieval-Augmented Generation) 기술과 SSE(Server-Sent Events) 스트리밍을 적용하여 대화 경험을 고도화하였다. 특히, 무료 티어 서비스의 기술적 제약을 극복하기 위해 정적 데이터의 직접 조회와 LLM 기반 지식 검색을 결합한 하이브리드 전략을 도입하였다. 본 연구를 통해 제한된 자원 환경에서도 신입생의 정보 접근 편의성을 높이고 대학 생활 적응을 효과적으로 지원할 수 있음을 확인하였다.

---

### I. 서론 (Introduction)
매년 대학에 입학하는 신입생들은 학사 일정, 강의실 위치, 식단 정보 등 방대한 학내 정보를 파악하는 데 상당한 어려움을 겪는다. 기존 대학 홈페이지나 포털 시스템은 정보가 여러 게시판에 분산되어 있으며, 특히 모바일 환경에서의 접근성이 낮아 필요한 정보를 즉각적으로 획득하기에 한계가 있다[1]. 최근 인공지능 기술의 발전으로 다양한 챗봇 서비스가 등장하고 있으나, 대학 전용 서비스의 경우 높은 클라우드 인프라 유지 비용과 관리의 복잡성으로 인해 지속적인 운영에 어려움이 따르는 실정이다[2].

이에 본 연구에서는 인하공업전문대학 컴퓨터정보공학과 신입생을 주 대상으로 하여, 친근한 마스코트 페르소나를 통해 정보 접근 장벽을 낮추고 서버리스 기술을 활용하여 운영 비용을 최소화한 지능형 가이드 시스템을 제안하고자 한다. 본 시스템은 실시간 데이터 크롤링과 최신 대형 언어 모델(LLM)을 결합하여 정확한 정보를 제공하며, 특히 무료 AI 모델 및 서버리스 환경이라는 제한적인 개발 인프라 속에서도 실용적인 수준의 응답 성능을 확보하는 데 목적이 있다.

### II. 시스템 설계 (System Design)
본 시스템은 지속 가능한 운영과 높은 성능을 동시에 달성하기 위해 제로 코스트 서버리스 아키처를 지향한다. 프론트엔드는 React 19와 TypeScript를 기반으로 구축되어 Vercel에 배포되며, 백엔드는 FastAPI를 활용한 경량 API 서버가 Vercel Serverless Functions를 통해 트리거되는 구조를 가진다. 데이터베이스는 Supabase(PostgreSQL)를 사용하여 식단, 일정, 시설 정보를 관리하며, pgvector를 이용한 공지사항 벡터 검색 기능을 제공한다.

특히, 무료 서비스 사용에 따른 성능 저하를 방지하기 위해 데이터 성격에 따른 하이브리드 전략을 채택하였다. LLM의 추론 속도 지연 및 API 호출 제한(Rate Limit)을 회피하기 위해, 식단 및 시설 정보와 같은 정적 데이터는 프론트엔드에서 Supabase SDK를 사용하여 직접 조회함으로써 응답 속도를 극대화한다. 반면 복잡한 자연어 질의나 비정형 공지사항 검색이 필요한 경우에만 백엔드 API를 경유하여 Gemini 1.5 Flash 모델을 호출함으로써 무료 티어 자원을 효율적으로 분배하도록 설계하였다.

### III. 시스템 구현 (Implementation)

#### 1. 마스코트 기반 사용자 인터페이스 (Mascot-Driven UI)
지능형 챗봇 '인하덕'는 대학 마스코트의 고유한 캐릭터성을 인터페이스 전반에 반영하였다. 마스코트의 친근한 말투를 시스템 프롬프트(System Prompt)에 주입하여 신입생들에게 단순한 정보 제공자가 아닌 학교 선배와 같은 브랜드 경험을 제공한다. UI 구성은 퀵 메뉴 버튼을 배치하여 사용자가 별도의 타이핑 없이도 주요 정보(식단, 일정 등)에 즉각적으로 접근할 수 있도록 설계하였다.
[Figure 1: Mascot-Driven User Interface and Main Dashboard]

#### 2. 지능형 인터랙션 및 스트리밍 처리 (Intelligent Interaction & SSE)
사용자의 질의에 대한 응답 지연 시간을 체감적으로 단축하기 위해 SSE(Server-Sent Events) 기술을 적용하였다. LLM이 생성하는 텍스트 토큰을 실시간으로 수신하여 화면에 출력하며, 특히 인공지능의 느린 초기 응답 속도를 시각적으로 보완하기 위해 20ms 간격의 타이핑 시뮬레이션 알고리즘을 결합하였다. 이를 통해 사용자는 시스템의 응답을 기다리는 지루함 없이 자연스러운 대화 흐름을 유지할 수 있다.
[Figure 2: Real-time Streaming Response and Typing Animation UI]

#### 3. 자동화된 데이터 수집 파이프라인 (Automated Data Collection)
정확한 학사 정보 제공을 위해 Playwright 기반의 동적 크롤링 시스템을 구축하였다. 학교 홈페이지의 JavaScript 기반 렌더링 콘텐츠를 완벽히 수집하며, 수집된 HTML 본문은 html2text 라이브러리를 통해 정제된 마크다운 형식으로 변환된다. 이는 LLM의 토큰 소모 효율을 최적화하고 문맥 이해도를 높이는 역할을 한다. 정제된 데이터는 Pydantic 모델 검증을 거쳐 Supabase DB에 주기적으로 갱신되어 최신성을 보장한다.
[Figure 3: Automated Data Crawling and Pre-processing Workflow]

#### 4. RAG 기반 지능형 지식 검색 (RAG-based Knowledge Search)
단순한 DB 조회를 넘어 대량의 공지사항 및 학사 규정에서 필요한 정보를 정확히 추출하기 위해 RAG(Retrieval-Augmented Generation) 패턴을 적용하였다. 사용자의 질의를 벡터화하여 Supabase의 벡터 스토어에서 유사도가 높은 문서 조각(Chunk)들을 검색하고, 이를 Gemini 1.5 Flash 모델의 컨텍스트로 제공하여 답변을 생성한다. 이는 최신 공지사항을 바탕으로 한 할루시네이션(Hallucination) 방지에 핵심적인 기여를 한다.
[Figure 4: RAG Pipeline for Academic Notice Retrieval]

#### 5. 동적 캠퍼스 가이드 시스템 (Dynamic Campus Navigation)
캠퍼스 내 복잡한 시설 위치를 안내하기 위해 react-naver-maps를 연동한 동적 지도 인터페이스를 구현하였다. 각 강의실 및 편의시설의 좌표 데이터를 기반으로 커스텀 마커를 표시하며, 사용자가 특정 시설을 선택하거나 챗봇에게 위치를 물어볼 경우 해당 위치로 지도를 부드럽게 이동(panTo)시키는 기능을 제공한다. 이는 신입생들이 낯선 캠퍼스 환경에 빠르게 적응하도록 돕는다.
[Figure 5: Interactive Campus Map with Facility Navigation]

---

### IV. 결론 및 향후 과제 (Conclusions)
본 연구를 통해 서버리스 아키처와 무료 AI 모델을 전략적으로 결합하여 운영 비용 부담 없이 실용적인 대학 지원 시스템을 구축할 수 있음을 입증하였다. 특히 하이브리드 쿼리 전략과 SSE 스트리밍 기법은 제한된 개발 환경 속에서도 사용자 경험을 유지하는 데 핵심적인 역할을 하였다.

그러나 본 시스템은 몇 가지 기술적 한계를 지닌다. 첫째, Gemini 1.5 Flash 무료 티어 사용으로 인해 분당 호출 횟수(RPM)의 제약이 있으며, 고성능 유료 모델 대비 복잡한 추론 능력에서 일부 한계가 관찰되었다. 둘째, 서버리스 환경의 특성상 일정 시간 미사용 후 재호출 시 발생하는 초기 지연 시간(Cold Start) 문제가 존재한다. 향후 연구에서는 축적된 사용자 피드백을 기반으로 답변의 정확도를 높이기 위한 파인튜닝을 진행하고, 학과별 특화 데이터를 확충하여 전 대학 차원의 종합 지능형 학사 지원 시스템으로 고도화할 계획이다.

### References
- [1] National Information Society Agency (NIA), "2023 Survey on the Digital Divide," Ministry of Science and ICT, 2023. [Online]. Available: https://www.nia.or.kr
- [2] K. M. Yoo and S. H. Kim, "A Study on the Development of University Academic Support Chatbot using Generative AI," Journal of Digital Convergence, Vol. 21, No. 5, pp. 145-152, 2023. [Online]. Available: https://doi.org/10.14400/JDC.2023.21.5.145
- [3] Google Cloud, "Gemini 1.5 Flash Model Documentation," Google AI Platform, 2024. [Online]. Available: https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-flash
- [4] Supabase Inc., "Supabase PostgreSQL & Vector Documentation," 2024. [Online]. Available: https://supabase.com/docs/guides/database/extensions/pgvector
- [5] Vercel Inc., "Serverless Functions Overview and Cold Starts," Vercel Documentation, 2024. [Online]. Available: https://vercel.com/docs/functions
- [6] Playwright Team, "Playwright Library for Web Automation," Microsoft, 2024. [Online]. Available: https://playwright.dev/python/docs/intro
>>>>>>> Stashed changes

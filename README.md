# 🎭 AI 듀얼 카운슬링 플랫폼 (Multi-Persona & RAG)

> **"LangGraph 기반의 멀티 에이전트 오케스트레이션으로 구현하는 입체적 상담 경험"**  
본 프로젝트는 사용자의 고민에 따라 최적의 페르소나 페어를 매칭하고, RAG(검색 증강 생성)를 통해 전문적인 조언을 제공하는 지능형 상담 플랫폼입니다.

## 🌟 주요 특징
- **LangGraph Orchestration**: 상태 기반 그래프 구조를 통한 정교한 에이전트 간 토론 및 협업.
- **Persona Registry**: 고민 주제(커리어, 경제, 심리 등)에 특화된 다양한 페르소나 조합 제공.
- **RAG Integration**: 외부 전문 지식(상담 사례, 시장 데이터 등)을 참고한 고품질 조언.
- **입체적 분석**: 이성적 분석(The Architect)과 정서적 공감(The Healer)의 조화.

## 🛠️ 기술 스택 (Tech Stack)
- **Framework**: LangChain, LangGraph (State Management)
- **LLM**: OpenAI `gpt-4o`
- **Vector DB**: Chroma / Pinecone (RAG 구현)
- **Monitoring**: LangSmith (Interaction Tracking)
- **Interface**: Streamlit

## 📂 프로젝트 구조
- `src/`: 듀얼 페르소나 엔진 및 LangGraph 워크플로우 로직
- `docs/`: 기획 및 설계 상세 문서
  - [01. 페르소나 상세 설계](./docs/01_persona_design.md)
  - [02. 기술 사양서(v2.0)](./docs/02_technical_specification.md)
  - [03. 기획 발표 개요](./docs/03_presentation_outline.md)
- `data/`: RAG를 위한 전문 지식 데이터셋 및 프롬프트 템플릿
- `requirements.txt`: 프로젝트 의존성 관리

## 🚀 시작하기
```bash
# 저장소 클론
git clone https://github.com/your-repo/LLM-Chatbot.git

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (.env 파일 생성)
# OPENAI_API_KEY=your_api_key_here
```

## 📅 현재 진행 상황
- [x] LangGraph 기반 멀티 에이전트 아키텍처 설계
- [x] RAG 통합 및 페르소나 확장 전략 수립
- [ ] LangGraph 워크플로우 엔진 구현 (In Progress)
- [ ] Vector DB 구축 및 도메인 지식 임베딩

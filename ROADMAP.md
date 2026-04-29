# 🗺️ Project Roadmap: AI 듀얼 카운슬링 플랫폼

## 📊 프로젝트 현황 (Last Updated: 2026-04-29)
- **현재 상태**: **Phase 2 (LangGraph Implementation)** 진입
- **최근 주요 변경사항**:
    - LangChain/LangGraph 기반 멀티 에이전트 아키텍처로 확장 (`docs/02`)
    - RAG(Retrieval-Augmented Generation) 통합 전략 수립
    - 페르소나 저장소(Persona Registry) 개념 도입

---

## Phase 1: Planning & Architecture ── ✅ 완료
- [x] **멀티 에이전트 설계**: LangGraph를 이용한 상태 기반 워크플로우 설계
- [x] **RAG 전략 수립**: 외부 전문 지식 데이터셋 및 Vector DB 선정
- [x] **페르소나 프레임워크**: 엘리아/루나 외 확장 페르소나 페어 정의
- [x] **기획 문서 고도화**: v2.0 기술 사양서 및 README 최신화

## Phase 2: Core Engine Development (LangGraph) ── 🏗️ 진행 중
- [ ] **State Schema 정의**: 에이전트 간 공유되는 대화 상태 및 컨텍스트 구조화
- [ ] **LangGraph Workflow 구현**: Analyzer -> Agent -> Synthesizer 노드 구성
- [ ] **Query Analyzer 구현**: 질문 의도에 따른 페르소나 매칭 로직 개발
- [ ] **Parallel Agent Nodes**: 엘리아와 루나 에이전트의 병렬 실행 환경 구축

## Phase 3: RAG & Knowledge Integration
- [ ] **Vector Database 구축**: 상담 가이드 및 도메인 지식 문서 임베딩 (Chroma/Pinecone)
- [ ] **Retriever Node 구현**: 질문 인텐트에 부합하는 외부 데이터 검색 로직 연동
- [ ] **Context-Aware Prompting**: 검색된 정보를 에이전트 답변 생성에 주입

## Phase 4: Interaction & Internal Debate
- [ ] **Internal Debate 엔진**: `Function Calling`을 통한 에이전트 간 '내부 토론' 트리거 구현
- [ ] **Cross-Review 로직**: 상대방의 답변 초안을 읽고 보완 의견을 제시하는 프로세스 최적화
- [ ] **Synthesizer 고도화**: 개별 답변과 토론 내용을 조화롭게 결합하는 합성 모듈

## Phase 5: Future Backlog (Persona Expansion)
- [ ] **Persona Registry 고도화**: 도메인별(취업, 재테크 등) 특화 페어 추가
- [ ] **Dynamic Pair Matching**: 질문 분석 결과에 따라 자동으로 페르소나 페어 전환
- [ ] **Multi-Pair UI**: 사용자가 직접 상담 전문가 페어를 선택하는 인터페이스

## Phase 6: Validation & Optimization
- [ ] **LangSmith 추적**: 대화 흐름 분석 및 프롬프트 품질 최적화
- [ ] **시나리오 테스트**: 카테고리별 답변 정확도 및 페르소나 일관성 평가
- [ ] **최종 배포**: 클라우드 환경 배포 및 안정화

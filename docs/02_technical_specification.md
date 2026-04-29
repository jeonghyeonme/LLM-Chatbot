# 🛠️ 기술 사양 및 시스템 설계 (v2.0: LangGraph 기반)

본 문서는 LangGraph와 RAG(Retrieval-Augmented Generation)를 활용하여 확장성과 지능을 극대화한 듀얼 에이전트 시스템 설계를 정의합니다.

## 1. 아키텍처 개요 (LangGraph Flow)

시스템은 상태(State) 중심의 그래프 구조로 동작하며, 각 노드는 독립적인 에이전트 또는 기능을 수행합니다.

### 1.1. State 정의
- `query`: 사용자 질문
- `analysis`: 질문 성격 및 주제 분석 결과
- `context`: RAG를 통해 검색된 외부 지식 데이터
- `agent_outputs`: 각 에이전트의 답변 및 상호작용 기록
- `final_response`: 사용자에게 전달될 최종 합성 답변

### 1.2. Graph Nodes
1.  **Analyzer Node**: 질문의 인텐트 분석 및 적합한 페르소나 페어(Pair) 매칭.
2.  **Retriever Node (RAG)**: 질문과 관련된 외부 데이터(경제 지표, 상담 사례 등) 검색.
3.  **Agent Nodes (Elia, Luna, etc.)**: 매칭된 페르소나들이 병렬로 답변 생성 및 상호작용.
4.  **Orchestrator Node**: 에이전트 간 토론이 더 필요한지 판단 (Conditional Edge).
5.  **Synthesizer Node**: 모든 출력을 결합하여 최종 메시지 생성.

## 2. 시스템 확장성 (Extensibility)

### 2.1. Persona Registry (향후 확장 요소)
- **현재**: '엘리아(이성) & 루나(감성)' 핵심 페어에 집중하여 구현.
- **확장 방향**: 도메인별 페르소나 페어(Career, Economy 등)를 등록하고 매칭하는 Registry 구조를 아키텍처 상으로 지원.

### 2.2. Retrieval-Augmented Generation (RAG)
- **Vector DB**: Pinecone 또는 Chroma 활용.
- **Source**: 상담 심리 논문, 경제 트렌드 리포트, 커리어 가이드북 등.
- **동작**: 에이전트가 답변 생성 시 자신의 페르소나와 부합하는 검색 결과를 참고하여 전문성 강화.

## 3. 데이터 구조 및 인터페이스

### 3.1. Node Interaction Schema
```json
{
  "graph_state": {
    "pair_id": "DEFAULT_ELIA_LUNA",
    "retrieved_docs": ["..."],
    "interactions": [
      {"from": "Elia", "to": "Luna", "action": "debate", "content": "..."}
    ]
  }
}
```

## 4. 프롬프트 엔지니어링 (LangChain Integration)
- **LangChain Expression Language (LCEL)**를 사용하여 프롬프트 체인을 구성.
- **Dynamic Prompting**: 페르소나 저장소에서 가져온 설정값이 런타임에 시스템 프롬프트에 주입됨.

## 5. 핵심 구현 도구
- **Framework**: LangChain, LangGraph (Graph-based State Management)
- **Vector Search**: LangChain Retrieval QA
- **Monitoring**: LangSmith (상호작용 추적 및 디버깅)


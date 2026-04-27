# 🗺️ Project Roadmap: Dual-Persona Counseling Chatbot

본 프로젝트의 단계별 발전 계획입니다.

## 1단계: 기획 및 설계 (현재 단계)
- [x] 핵심 컨셉 정의 (이성 vs 감성)
- [x] 페르소나 상세 설계 (엘리아 & 루나)
- [x] 기술 사양 확정 (GPT-4o, Function Calling, Whisper)
- [ ] 기획 발표 자료 준비 및 피드백 반영

## 2단계: MVP (Minimum Viable Product) 개발
- [ ] 개발 환경 구축 (Python/Node.js, OpenAI API 연동)
- [ ] 기본 오케스트레이터 구현: 사용자 입력을 두 페르소나에게 전달
- [ ] 병렬 응답 생성 로직 구현
- [ ] 단순 UI (CLI 또는 기본 웹 페이지) 개발

## 3단계: 상호작용 고도화 (Core Feature)
- [ ] Function Calling을 이용한 페르소나 간 대화 로직 구현
- [ ] 대화 중재 알고리즘 최적화 (언제 토론을 시작할 것인가?)
- [ ] 페르소나별 답변 스타일 가이드라인(Prompt Engineering) 정교화

## 4단계: 멀티모달 및 UX 강화
- [ ] OpenAI Whisper API 연동 (음성 입력 지원)
- [ ] 대화 흐름 시각화 (두 페르소나의 상호작용을 보여주는 UI 애니메이션)
- [ ] 고민 유형별 특화 조언 DB 구축 (RAG 검토)

## 5단계: 검증 및 배포
- [ ] 페르소나 일관성 테스트 (Turing Test 스타일의 내부 검증)
- [ ] 사용자 피드백 수집 및 모델 튜닝
- [ ] 클라우드 환경 배포

# 🛠️ 기술 사양 및 시스템 설계 (v3.0: 인하-봇)

본 문서는 인하공업전문대학 신입생 도우미 챗봇 '인덕이'의 기술적 구현 방안을 정의합니다.

## 1. 아키텍처 개요

시스템은 React 프론트엔드와 FastAPI 백엔드로 구성된 모던 웹 애플리케이션 아키텍처를 따릅니다.

### 1.1. Frontend (UI/UX)
- **Framework**: React (TypeScript)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS or Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Key Features**: 
    - 웰컴 인터렉션 카드
    - 퀵 메뉴 버튼 (Quick Replies)
    - 채팅 버블 인터페이스

### 1.2. Backend (API)
- **Framework**: FastAPI (Python)
- **LLM**: OpenAI GPT-4o-mini (가벼운 대화 및 인텐트 분류용)
- **Data Storage**: JSON-based Static Data (학사일정, 강의실 정보 등)
- **API Endpoints**:
    - `POST /chat`: 사용자 메시지 처리 및 답변 생성
    - `GET /info/{category}`: 카테고리별 정적 정보 조회

## 2. 핵심 기능 구현 방안

### 2.1. 인텐트 분류 및 퀵 응답
- 사용자가 버튼을 클릭하거나 특정 키워드를 입력할 경우, LLM을 거치지 않고 사전에 정의된 응답(Static Response)을 즉시 반환하여 응답 속도 최적화.

### 2.2. 컴퓨터정보공학과 맞춤형 데이터
- 4호관 401호(학과 사무실), 실습실 위치 등 학과 전용 데이터를 별도로 관리하여 정확한 가이드 제공.

## 3. 데이터 구조 (Example)

```json
{
  "cafeteria": {
    "location": "학생회관 1층",
    "hours": "11:30 ~ 13:30",
    "menu_today": "A코스: 돈까스, B코스: 김치찌개"
  },
  "department_office": {
    "location": "4호관 401호",
    "contact": "032-870-2310"
  }
}
```

## 4. 보안 및 배포
- **Environment Variables**: API Key 등 민감 정보는 `.env`로 관리.
- **Deployment**: Vercel (Frontend) & Render/Railway (Backend) 추천.

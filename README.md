# 🐥 인하공업전문대학 신입생 도우미 '인덕이' (inhabot)

> **"신입생의 스마트한 대학 생활을 위한 인공지능 가이드"**  
본 프로젝트는 인하공업전문대학 컴퓨터정보공학과 신입생들을 위해 학사 일정, 학생식당 메뉴, 강의실 위치 등 필수 정보를 친근하게 제공하는 지능형 챗봇 플랫폼입니다.

## 🌟 주요 특징
- **Mascot-Driven UI**: 학교 마스코트 '인덕이'를 활용한 친근한 인터랙션.
- **Quick Access**: 복잡한 메뉴 검색 없이 퀵 버튼을 통한 즉각적인 정보 제공.
- **Department Specific**: 컴퓨터정보공학과 신입생을 위한 전용 강의실 및 학과 사무실 가이드.
- **Modern Web Stack**: React와 FastAPI를 활용한 빠르고 부드러운 사용자 경험.

## 🎨 Design Vision (UI/UX)
- **Primary Color**: Inha Blue (`#004680`) - 신뢰와 전문성.
- **Secondary Color**: Inha Green (`#00843D`) - 편안함과 안정감.
- **Concept**: 모바일 앱과 같은 직관적인 웹뷰 UI.

## 📂 프로젝트 구조
- `frontend/`: React (TypeScript) 기반 사용자 인터페이스
- `backend/`: FastAPI 기반 챗봇 로직 및 API 서버
- `assets/`: 기획 문서 및 디자인 리소스
  - `assets/docs/`: 기획 및 설계 상세 문서
    - [01. 페르소나 설계 (인덕이)](./assets/docs/01_persona_design.md)
    - [02. 기술 사양서](./assets/docs/02_technical_specification.md)
  - `assets/design/`: SVG 디자인 원본 파일 (Desktop/Mobile)
- `data/`: 학사 정보 및 학과 안내 데이터셋

## 🚀 시작하기

### 🛠️ 개발 환경 설정

**프론트엔드 (React):**
```bash
cd frontend && npm install && npm run dev
```

**백엔드 (FastAPI):**
```bash
cd backend && python -m venv venv
# Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🤝 협업 가이드라인

### 🌿 브랜치 전략
- `main`: 배포용 브랜치
- `dev`: 개발 통합 브랜치
- `feature/{issue}-{task}`: 기능 개발

### 💬 커밋 메시지 컨벤션
- `feat`: 기능 추가 | `fix`: 버그 수정 | `docs`: 문서 수정 | `refactor`: 리팩토링
- 예시: `feat: 챗봇 메인 UI 구현`

### ✅ PR 규칙
- 모든 코드는 PR을 통해 `dev`에 머지합니다.
- 최소 1명 이상의 리뷰어 승인이 필요합니다.

---

## 📅 현재 진행 상황
- [x] UI/UX 기획 및 시나리오 정의
- [x] React 프로젝트 초기화
- [ ] 챗봇 기본 UI 구현 (진행중)
- [ ] 학사 정보 연동 API 개발

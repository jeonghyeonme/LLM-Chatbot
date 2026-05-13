# 🐥 인하공업전문대학 신입생 도우미 '인덕이' (induck-it)

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

## 🛠️ Zero-Cost 기술 스택

본 프로젝트는 운영 비용 0원을 목표로 하는 **Serverless WebApp** 아키텍처를 따릅니다.

- **Frontend**: React 19 (TypeScript) + Vite + Tailwind CSS
- **Backend**: FastAPI (Vercel Serverless Functions)
- **Database**: Supabase (PostgreSQL + pgvector)
- **LLM**: Gemini 1.5 Flash (Google AI Studio)
- **Deployment**: Vercel (Full Stack)
- **App Experience**: PWA (Progressive Web App) 지원

## 📂 프로젝트 구조

```text
induck-it/
├── .github/              # PR 템플릿 및 GitHub 설정
├── assets/               # 기획 문서 및 디자인 리소스 (SVG)
├── backend/              # FastAPI 서버리스 백엔드
│   ├── api/              # API 엔드포인트 (Vercel Functions)
│   ├── app/              # FastAPI 메인 로직
│   ├── core/             # 공통 설정 및 로깅
│   ├── schemas/          # Pydantic 모델 (Request/Response)
│   ├── services/         # 크롤러 및 AI 비즈니스 로직
│   └── requirements.txt  # 백엔드 의존성
└── frontend/             # React 프론트엔드
    ├── src/
    │   ├── assets/       # 컴포넌트용 에셋
    │   ├── components/   # 재사용 가능한 UI 컴포넌트
    │   └── pages/        # 라우트별 페이지 컴포넌트
    └── package.json      # 프론트엔드 의존성
```

## 📊 데이터베이스 스키마 (Supabase)

운영 비용 0원을 위한 효율적인 테이블 설계입니다. (*개발 진행 상황에 따라 구조가 변경될 수 있습니다.*)

- **`meals`**: 학생식당 메뉴 데이터
  - `id`, `date`, `course_type` (A/B), `menu_content`, `created_at`
- **`schedules`**: 학사 일정 데이터
  - `id`, `title`, `start_date`, `end_date`, `is_holiday`, `created_at`
- **`facilities`**: 캠퍼스 시설 및 강의실 데이터
  - `id`, `name`, `building`, `room_number`, `description`, `phone`
- **`knowledge_vectors` (pgvector)**: 공지사항 및 FAQ 벡터 데이터
  - `id`, `content`, `embedding` (vector), `metadata` (link, category)

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

### 🌿 브랜치 전략 및 워크플로우
모든 개발은 브랜치 분리를 통해 독립적으로 진행하며, PR(Pull Request)을 통한 코드 리뷰 후 병합합니다.

1. **`main`**: 상용 배포 브랜치 (안정화된 코드만 병합)
2. **`dev`**: 개발 통합 브랜치 (기능 개발 완료 시 병합)
3. **작업별 브랜치 (`{type}/{issue-number}-{task-name}`)**:
    - `feature/`: 새로운 기능 구현
    - `fix/`: 버그 수정
    - `docs/`: 문서 작성 및 수정
    - `refactor/`: 코드 리팩토링
    - `chore/`: 설정 변경, 의존성 관리 등

### 🔄 협업 프로세스
1. `dev` 브랜치에서 작업 브랜치를 생성합니다. (예: `feature/12-chat-ui`)
2. 작업 완료 후 `dev` 브랜치로 Pull Request를 생성합니다.
3. 최소 1명 이상의 리뷰어 승인 후 병합을 진행합니다.

### 💬 커밋 메시지 컨벤션
- `feat`: 기능 추가 | `fix`: 버그 수정 | `docs`: 문서 수정 | `refactor`: 리팩토링 | `chore`: 설정 변경
- 예시: `feat: 챗봇 스트리밍 응답 API 구현`

---
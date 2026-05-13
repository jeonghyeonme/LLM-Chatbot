# ⚙️ 인하-봇 백엔드 (Backend)

FastAPI와 LangChain을 사용한 인하-봇의 API 서버입니다.

## 🛠️ 시작하기

### 권장 환경
- Python 3.10 이상
- pip (Python 패키지 매니저)

### 설치 및 실행
```bash
# 가상환경 생성 및 활성화
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 서버 실행
uvicorn app.main:app --reload
```

### API 문서
서버 실행 후 아래 주소에서 Swagger 문서를 확인할 수 있습니다.
- http://127.0.0.1:8000/docs

## 📁 디렉토리 구조
- `app/`: 메인 엔트리 포인트 및 FastAPI 설정
- `api/`: API 엔드포인트 정의
- `services/`: 비즈니스 로직 및 외부 연동 (LLM, 크롤링 등)
- `schemas/`: Pydantic 모델 (Request/Response)
- `core/`: 공통 설정, 로깅, 보안 등
- `tests/`: 테스트 코드

## 🔗 관련 문서
- [프로젝트 전체 가이드라인](../GEMINI.md)
- [기여 방법](../CONTRIBUTING.md)

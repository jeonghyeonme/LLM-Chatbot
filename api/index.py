import sys
import os

# backend 디렉토리를 sys.path에 추가하여 모듈 임포트 가능하게 설정
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'app'))

from app.main import app

# Vercel은 'app' 객체를 요구할 수 있으므로 별칭 설정
handler = app

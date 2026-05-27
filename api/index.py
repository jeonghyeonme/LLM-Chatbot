import sys
import os

# 현재 파일(api/index.py)의 부모의 부모 디렉토리(루트)를 path에 추가
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)
sys.path.append(os.path.join(root_dir, 'backend'))

# backend.app.main에서 app 임포트
from app.main import app

# Vercel이 기대하는 핸들러 이름
handler = app
app = handler # 둘 다 지원하도록 설정

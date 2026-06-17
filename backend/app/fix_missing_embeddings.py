import sys
import os
import time

# 프로젝트 루트 경로 추가 (backend 디렉토리를 포함하도록 설정)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.supabase import SupabaseService, supabase

def fix_notices():
    print("🔍 임베딩이 비어있는 공지사항 찾는 중...")
    if not supabase:
        print("❌ Supabase 클라이언트가 초기화되지 않았습니다.")
        return

    # 임베딩이 NULL인 데이터만 가져오기
    try:
        res = supabase.table("notices").select("*").is_("embedding", "null").execute()
        items = res.data
        
        if not items:
            print("✅ 모든 공지사항에 임베딩이 이미 존재합니다.")
            return

        print(f"📝 총 {len(items)}개의 누락된 공지사항 발견. 복구 시작...")
        # SupabaseService.upsert_notices 내부에 이미 임베딩 생성 및 1초 지연 로직이 포함되어 있음
        SupabaseService.upsert_notices(items)
    except Exception as e:
        print(f"❌ 공지사항 복구 중 에러 발생: {e}")

def fix_careers():
    print("🔍 임베딩이 비어있는 취업정보 찾는 중...")
    if not supabase:
        print("❌ Supabase 클라이언트가 초기화되지 않았습니다.")
        return

    try:
        res = supabase.table("careers").select("*").is_("embedding", "null").execute()
        items = res.data
        
        if not items:
            print("✅ 모든 취업정보에 임베딩이 이미 존재합니다.")
            return

        print(f"💼 총 {len(items)}개의 누락된 취업정보 발견. 복구 시작...")
        SupabaseService.upsert_careers(items)
    except Exception as e:
        print(f"❌ 취업정보 복구 중 에러 발생: {e}")

if __name__ == "__main__":
    print("🚀 누락된 임베딩 복구 작업을 시작합니다...")
    fix_notices()
    print("\n--- 카테고리 전환 중 (2초 대기) ---\n")
    time.sleep(2) 
    fix_careers()
    print("\n🏁 모든 복구 작업이 완료되었습니다!")

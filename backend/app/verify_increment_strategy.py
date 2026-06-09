from playwright.sync_api import sync_playwright
import json
import os
import re

def increment_and_verify():
    map_path = 'dept_career_map.json'
    if not os.path.exists(map_path):
        return

    with open(map_path, 'r', encoding='utf-8') as f:
        dept_map = json.load(f)

    refined_map = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for entry in dept_map:
            dept_name = entry['department']
            url = entry['career_url']
            
            # 이미 1234로 끝나는 기계공학 등 성공 사례는 스킵하거나 그대로 둠
            if dept_name == "기계공학과" or "job.inhatc.ac.kr" in url:
                refined_map.append(entry)
                continue

            # ID 추출 및 1 증가 시도
            # 패턴: .../1751/subview.do
            match = re.search(r"/(\d+)/subview\.do", url)
            if match:
                current_id = int(match.group(1))
                new_id = current_id + 1
                new_url = url.replace(f"/{current_id}/subview.do", f"/{new_id}/subview.do")
                
                print(f"🧪 [{dept_name}] ID 증가 시도: {current_id} -> {new_id}")
                try:
                    page.goto(new_url, wait_until='networkidle', timeout=15000)
                    # 게시글 테이블이 존재하는지 확인
                    has_table = page.query_selector("table tbody tr")
                    if has_table:
                        print(f"  ✅ 테이블 발견! URL 업데이트: {new_url}")
                        refined_map.append({
                            "department": dept_name,
                            "career_url": new_url
                        })
                    else:
                        print(f"  ⚠️ 테이블 없음, 기존 URL 유지")
                        refined_map.append(entry)
                except:
                    print(f"  ❌ 접속 실패, 기존 URL 유지")
                    refined_map.append(entry)
            else:
                refined_map.append(entry)
                
        browser.close()

    with open('dept_career_map.json', 'w', encoding='utf-8') as f:
        json.dump(refined_map, f, ensure_ascii=False, indent=2)
    print("\n✅ 모든 학과의 URL 검증 및 업데이트가 완료되었습니다.")

if __name__ == '__main__':
    increment_and_verify()

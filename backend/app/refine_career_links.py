from playwright.sync_api import sync_playwright
import json
import os

def refine_career_links():
    map_path = 'dept_career_map.json'
    if not os.path.exists(map_path):
        print("⚠️ dept_career_map.json 파일이 없습니다.")
        return

    with open(map_path, 'r', encoding='utf-8') as f:
        dept_map = json.load(f)

    refined_map = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        
        for entry in dept_map:
            dept_name = entry['department']
            current_url = entry['career_url']
            
            # 중앙 취업 포털은 구조가 다를 수 있으므로 일단 유지하거나 스킵
            if "job.inhatc.ac.kr" in current_url:
                refined_map.append(entry)
                continue

            print(f"🔍 [{dept_name}] 실제 공지 목록 주소 찾는 중...")
            try:
                page.goto(current_url, wait_until='networkidle', timeout=20000)
                
                # 사용자 지정 셀렉터: #pagetitle2 > ul > li:nth-child(2) > a
                refined_url = page.evaluate('''() => {
                    const selector = '#pagetitle2 > ul > li:nth-child(2) > a';
                    const link = document.querySelector(selector);
                    return link ? link.href : null;
                }''')
                
                if refined_url:
                    print(f"  ✨ 발견: {refined_url}")
                    refined_map.append({
                        "department": dept_name,
                        "career_url": refined_url
                    })
                else:
                    print(f"  ⚠️ 셀렉터를 찾을 수 없음, 기존 URL 유지: {current_url}")
                    refined_map.append(entry)
            except Exception as e:
                print(f"  ❌ 에러 ({dept_name}): {e}")
                refined_map.append(entry)
                
        browser.close()

    # 결과 저장
    with open('dept_career_map.json', 'w', encoding='utf-8') as f:
        json.dump(refined_map, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 총 {len(refined_map)}개 학과의 URL이 정교화되었습니다.")

if __name__ == '__main__':
    refine_career_links()

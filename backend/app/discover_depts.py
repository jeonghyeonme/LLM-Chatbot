from playwright.sync_api import sync_playwright
import json

def get_dept_links():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto('https://www.inhatc.ac.kr/sites/kr/index.do', wait_until='networkidle')
            depts = page.evaluate('''() => {
                const container = document.querySelector('body > div.wrap_site_link > div > div > div.item._snd');
                if (!container) return [];
                const items = container.querySelectorAll('li a');
                return Array.from(items).map(a => ({
                    name: a.innerText.trim(),
                    url: a.href
                }));
            }''')
            
            results = []
            for dept in depts:
                print(f"Checking {dept['name']}...")
                try:
                    page.goto(dept['url'], wait_until='networkidle', timeout=20000)
                    career_url = page.evaluate('''() => {
                        // User hint: #top_k2wiz_GNB_1737
                        const target = document.querySelector('#top_k2wiz_GNB_1737 a');
                        if (target) return target.href;
                        
                        // Fallback: search by text
                        const links = Array.from(document.querySelectorAll('a'));
                        const found = links.find(a => a.innerText.includes('취업') || a.innerText.includes('채용'));
                        return found ? found.href : null;
                    }''')
                    if career_url:
                        results.append({
                            "department": dept['name'],
                            "career_url": career_url
                        })
                except:
                    continue
            return results
        finally:
            browser.close()

if __name__ == '__main__':
    career_map = get_dept_links()
    with open('dept_career_map.json', 'w', encoding='utf-8') as f:
        json.dump(career_map, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(career_map)} department career links to dept_career_map.json")

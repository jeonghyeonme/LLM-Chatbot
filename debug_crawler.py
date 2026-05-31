from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to list page...")
            page.goto('https://www.inhatc.ac.kr/kr/460/subview.do', wait_until='networkidle')
            page.wait_for_timeout(3000)
            
            print("Clicking notice link...")
            # Click the link that contains 108533
            page.click("a[href*='108533']")
            
            print("Waiting for detail page...")
            page.wait_for_timeout(5000)
            
            print(f"Final URL: {page.url}")
            with open('notice_detail_v2.html', 'w', encoding='utf-8') as f:
                f.write(page.content())
            print("Saved to notice_detail_v2.html")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()

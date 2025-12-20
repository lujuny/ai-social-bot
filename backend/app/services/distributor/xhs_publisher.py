import json
import os
import time
from playwright.sync_api import sync_playwright
from .base import BasePublisher

class XhsPublisher(BasePublisher):
    def login(self):
        # Cookie 在 publish 里直接加载
        pass

    def publish(self, content_data: dict):
        """
        content_data: {
            "title": "...",
            "content": "...", 
            "images": ["/abs/path/to/img1.jpg", ...],
            "tags": "#AI #Tech" 
        }
        """
        cookie_path = self.account.cookies_path
        if not os.path.exists(cookie_path):
            raise FileNotFoundError("Cookie file not found")

        with open(cookie_path, 'r') as f:
            cookies = json.load(f)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False) # 调试阶段用 headless=False 观察
            context = browser.new_context()
            context.add_cookies(cookies)
            
            page = context.new_page()
            page.goto("https://creator.xiaohongshu.com/publish/publish")
            
            # 1. 检测是否登录有效
            # 如果跳转回登录页，说明 Cookie 失效
            if "login" in page.url:
                browser.close()
                raise Exception("Cookie expired, please relogin")
            
            page.wait_for_load_state("networkidle")

            # 2. 上传图片
            # 小红书上传按钮 input[type=file]
            # 注意：实际页面结构可能变化，需要根据 DOM 调整 selector
            # 这里假设上传 Tabs 默认选中 "图文"
            
            # 寻找上传输入框
            # 2. 上传图片
            # 寻找上传输入框
            if content_data.get("images"):
                try:
                    # 尝试定位 input type=file
                    # 如果页面有多个，通常第一个是上传图片
                    upload_input = page.locator("input[type='file']").first
                    upload_input.set_input_files(content_data['images'])
                    # 等待图片上传处理完成 (简单等待)
                    page.wait_for_timeout(3000)
                except Exception as e:
                    print(f"Image upload failed: {e}")

            # 3. 填写标题
            # 尝试多种选择器以防页面变动
            try:
                # 常见: input class="d-input" 或者 placeholder 包含标题
                title_selector = "input[placeholder*='填写标题']"
                if not page.is_visible(title_selector):
                    title_selector = ".c-input_inner" # 另一种可能
                
                page.locator(title_selector).first.fill(content_data['title'])
            except Exception as e:
                print(f"Title fill failed: {e}")

            # 4. 填写正文
            # 通常是 #post-textarea
            try:
                content_selector = "#post-textarea"
                if not page.is_visible(content_selector):
                    content_selector = ".ql-editor" #为了兼容旧版
                
                full_content = content_data['content']
                if content_data.get('tags'):
                     full_content += f"\n\n{content_data['tags']}"
                
                page.locator(content_selector).fill(full_content)
            except Exception as e:
                print(f"Content fill failed: {e}")

            # 5. 点击发布
            try:
                # 寻找 "发布" 按钮
                # class通常包含 publishBtn
                submit_btn = page.locator(".publishBtn").first
                if not submit_btn.is_visible():
                     submit_btn = page.locator("button:has-text('发布')")
                
                submit_btn.click()
            except Exception as e:
                print(f"Click publish failed: {e}")

            # 6. 等待成功
            # 成功后通常弹出 Toast "发布成功" 或者跳转到管理页
            # 关键修改：大幅增加超时时间 (如 5分钟 300000ms)，允许用户手动处理验证码或调整内容
            try:
                # 尝试等待 "发布成功" 提示
                # 也可以同时监听 URL 变化，例如跳转到 /manage/works
                # 但 Playwright 的 wait_for_* 通常是阻塞的，简单起见等待最关键的信号
                print("Waiting for success signal (Timeout: 300s)...")
                page.wait_for_selector("text=发布成功", timeout=300000) 
                
                # 稍微等待一下让用户看清
                page.wait_for_timeout(2000)
                
                browser.close()
                return "success"
            except Exception as e:
                print(f"Wait for success failed: {e}")
                # 如果超时或被手动关闭，则视为状态未知或失败
                # 尝试截图
                try:
                    page.screenshot(path="publish_timeout.png")
                except:
                    pass
                    
                browser.close()
                return "unknown_status"

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
            if content_data.get("images"):
                with page.expect_file_chooser() as fc_info:
                    # 点击上传区域，这里 selector 比较模糊，通常是 class 包含 upload 的 div
                    # 我们尝试直接定位 input
                    # 如果页面没有直接展示 input，用 dispatch_event 或者 click 触发
                    # 也可以尝试 page.locator("input[type='file']").set_input_files(...)
                    
                    # 尝试方案 A: 寻找可视的上传按钮点击
                    # page.click(".upload-input") 
                    
                    # 尝试方案 B: 直接操作 hidden input (推荐)
                    page.locator("input[type='file']").set_input_files(content_data['images'])

            # 3. 填写标题
            # placeholder="填写标题，会展示在封面图下方"
            page.locator("input[placeholder*='填写标题']").fill(content_data['title'])

            # 4. 填写正文
            # contenteditable 或者是 textarea
            # 小红书正文通常是 #post-textarea
            page.locator(".ql-editor").fill(content_data['content'] + "\n\n" + content_data.get('tags', ''))

            # 5. 点击发布
            # 寻找 "发布" 按钮
            submit_btn = page.locator("button:has-text('发布')")
            submit_btn.click()

            # 6. 等待成功
            # 成功后通常弹出 Toast "发布成功" 或者跳转到管理页
            try:
                page.wait_for_selector("text=发布成功", timeout=10000)
                browser.close()
                return "success"
            except:
                browser.close()
                return "unknown_status"

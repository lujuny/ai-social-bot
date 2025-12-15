import json
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import SocialAccount
from playwright.async_api import async_playwright

COOKIES_DIR = "cookies_store"

class AccountManager:
    def __init__(self, db: Session):
        self.db = db
        if not os.path.exists(COOKIES_DIR):
            os.makedirs(COOKIES_DIR)

    async def login_qrcode(self, platform: str):
        """
        启动浏览器进行扫码登录，登录成功后保存 Cookie
        注意：这是一个阻塞操作，实际生产中可能需要异步或通过 socket 通知前端
        此处为了演示简单 MVP，直接弹出浏览器窗口让用户操作
        """
        if platform == "xhs":
            url = "https://creator.xiaohongshu.com/publish/publish"
            domain = "xiaohongshu.com"
        else:
            raise ValueError("Unsupported platform")

        async with async_playwright() as p:
            # 必须用有头模式，让用户能扫码
            browser = await p.chromium.launch(headless=False) 
            context = await browser.new_context()
            page = await context.new_page()
            
            await page.goto(url)
            
            print(f"请在打开的浏览器中扫码登录 {platform}...")
            
            # 简单的判定登录成功机制：检测特定的元素出现
            # 小红书创作中心登录后通常会有 "发布笔记" 按钮或者头像
            try:
                # 等待用户扫码，设置较长超时时间 (例如 2 分钟)
                # 这里的 selector 需要根据实际页面调整，比如 ".publish-btn" 或用户头像
                await page.wait_for_url("**/publish/**", timeout=120000) 
                
                # 保存 Cookie
                cookies = await context.cookies()
                cookie_path = os.path.join(COOKIES_DIR, f"{platform}_{int(datetime.now().timestamp())}.json")
                with open(cookie_path, "w") as f:
                    json.dump(cookies, f)
                
                # 入库
                account = SocialAccount(
                    platform=platform,
                    account_name=f"User_{int(datetime.now().timestamp())}", # 暂时没去抓昵称，先自动生成
                    cookies_path=cookie_path,
                    status="active",
                    last_checked_at=datetime.now()
                )
                self.db.add(account)
                self.db.commit()
                self.db.refresh(account)
                
                await browser.close()
                return {"status": "success", "account_id": account.id}
                
            except Exception as e:
                await browser.close()
                return {"status": "failed", "error": str(e)}

    def get_accounts(self):
        return self.db.query(SocialAccount).all()

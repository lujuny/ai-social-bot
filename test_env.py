import asyncio
from playwright.async_api import async_playwright
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

async def main():
    print("🔄 正在检查环境...")

    # 1. 检查 API Key
    if os.getenv("OPENAI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
        print("✅ API Key 配置检测到")
    else:
        print("❌ 未检测到 AI API Key (请检查 .env)")

    # 2. 检查 Playwright
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto("https://www.google.com")
            title = await page.title()
            print(f"✅ Playwright 运行正常，成功访问 Google: {title}")
            await browser.close()
    except Exception as e:
        print(f"❌ Playwright 运行失败: {e}")

    print("🎉 环境搭建完成！准备起飞！")

if __name__ == "__main__":
    asyncio.run(main())
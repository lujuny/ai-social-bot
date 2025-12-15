from playwright.async_api import async_playwright
import asyncio

async def scrape_weibo_hot():
    """
    抓取微博热搜榜 (前10条)
    """
    print("🕷️ 正在爬取微博热搜...")
    results = []
    
    async with async_playwright() as p:
        # 1. 启动浏览器 (headless=True 表示无头模式，不显示浏览器窗口)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            # 2. 访问微博热搜摘要页 (这个页面相对比较好爬)
            await page.goto("https://s.weibo.com/top/summary", timeout=30000)
            
            # 3. 等待列表加载出来
            await page.wait_for_selector("td.td-02", timeout=5000)
            
            # 4. 获取所有热搜条目
            items = await page.query_selector_all("td.td-02 a")
            
            # 5. 提取前15条 (跳过第0条，因为通常是置顶广告)
            for i, item in enumerate(items[1:16]): 
                title = await item.inner_text()
                href = await item.get_attribute("href")
                full_url = f"https://s.weibo.com{href}"
                
                # 过滤掉纯数字或无效标题
                if title and len(title) > 2:
                    results.append({
                        "title": title,
                        "platform": "Weibo",
                        "score": 90 - i,  # 模拟热度分，排名越靠前分越高
                        "url": full_url
                    })
                    
        except Exception as e:
            print(f"❌ 微博抓取失败: {e}")
        finally:
            await browser.close()
            
    return results

async def scrape_juejin_hot():
    """
    抓取稀土掘金文章榜 (科技/编程类)
    """
    print("🕷️ 正在爬取掘金热榜...")
    results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            # 访问掘金热榜文章
            await page.goto("https://juejin.cn/hot/articles", timeout=30000)
            
            # 等待文章标题元素加载
            # 注意：掘金的类名可能会变，这里使用比较通用的选择器
            await page.wait_for_selector(".article-item-link", timeout=5000)
            
            items = await page.query_selector_all(".article-item-link")
            
            for i, item in enumerate(items[:10]):
                title = await item.inner_text()
                href = await item.get_attribute("href")
                
                if title:
                    results.append({
                        "title": title,
                        "platform": "Juejin",
                        "score": 85 - i,
                        "url": f"https://juejin.cn{href}"
                    })
                    
        except Exception as e:
            print(f"❌ 掘金抓取失败: {e}")
        finally:
            await browser.close()
            
    return results

# 调试用：如果直接运行这个文件，会测试一下
if __name__ == "__main__":
    data = asyncio.run(scrape_weibo_hot())
    print(data)
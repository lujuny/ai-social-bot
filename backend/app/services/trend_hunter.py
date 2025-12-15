from sqlalchemy.orm import Session
from app.models import Trend
from datetime import datetime
import asyncio
import sys
from app.utils.crawler import scrape_weibo_hot, scrape_juejin_hot

class TrendHunterService:
    def __init__(self, db: Session):
        self.db = db

    def scrape_trends(self):
        """
        核心抓取逻辑 (保持不变)
        """
        print("🚀 启动全网抓取任务...")
        
        # Windows 平台必须加这个补丁
        if sys.platform.startswith("win"):
            asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

        try:
            weibo_data, juejin_data = asyncio.run(self._fetch_all_sources())
            all_data = weibo_data + juejin_data
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"致命错误: 爬虫运行失败 - {e}")
            return 0

        new_count = 0
        for item in all_data:
            exists = self.db.query(Trend).filter(Trend.title == item["title"]).first()
            if not exists:
                trend = Trend(
                    title=item["title"],
                    platform=item["platform"],
                    hot_score=item["score"],
                    url=item["url"],
                    created_at=datetime.now()
                )
                self.db.add(trend)
                new_count += 1
        
        self.db.commit()
        return new_count

    async def _fetch_all_sources(self):
        return await asyncio.gather(
            scrape_weibo_hot(),
            scrape_juejin_hot()
        )

    # =========================================================
    # 👇 请务必修改/新增下面这两个方法！
    # =========================================================

    # 1. 修改这个方法：增加 skip 参数
    def get_latest_trends(self, skip: int = 0, limit: int = 10):
        """获取热点列表（支持分页）"""
        return self.db.query(Trend)\
            .order_by(Trend.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()

    # 2. 新增这个方法：用于计算总页数
    def get_total_count(self):
        """获取热点总数"""
        return self.db.query(Trend).count()
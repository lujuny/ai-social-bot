# backend/app/services/content_factory.py

from zhipuai import ZhipuAI
from sqlalchemy.orm import Session
from app.models import Trend, ContentDraft
import os
import json

class ContentFactoryService:
    def __init__(self, db: Session):
        self.db = db
        # 初始化智谱客户端
        self.client = ZhipuAI(api_key=os.getenv("ZHIPUAI_API_KEY"))

    def generate_draft(self, trend_id: int):
        # 1. 获取热点数据
        trend = self.db.query(Trend).filter(Trend.id == trend_id).first()
        if not trend:
            raise Exception("热点不存在")

        print(f"🤖 正在调用 GLM-4 为话题 [{trend.title}] 生成文案...")

        # 2. 构建提示词 (Prompt Engineering) - 优化版
        # 这一步是灵魂，已升级为 "爆款博主" 风格
        system_prompt = """
        你是一位拥有百万粉丝的小红书科技博主“AI探索家”。
        你需要根据用户提供的热点新闻，创作一篇极具吸引力的爆款笔记。

        【写作风格】
        1. **情绪化**：拒绝平铺直叙，要用“我惊呆了”、“家人们谁懂啊”、“太绝了”、“这回真的不一样”等情绪词开头。
        2. **口语化**：像和闺蜜/兄弟聊天一样自然，多用“咱就是说”、“千万别...”，禁止教科书式表达。
        3. **视觉化**：每段话必须带1-2个Emoji表情，排版要显得很满很丰富但又不乱。
        4. **结构清晰**：
           - 第一行：超级吸睛的标题（必须包含：❗️/🔥/⚠️/救命/绝绝子 等视觉符号）。
           - 正文第一段：痛点/悬念引入（黄金3秒法则）。
           - 正文中间：分点说明（使用 1️⃣ 2️⃣ 3️⃣ 或 ✅ ），干货满满。
           - 正文结尾：互动引导（“评论区蹲一个”、“你怎么看？”） + 3-5个强相关Hashtags。
        5. **篇幅控制**：保持短小精悍，正文总字数严控在 200 字左右，不要长篇大论，方便用户快速阅读。

        【输出格式】
        严格返回纯JSON格式，禁止包含markdown代码块标记（如 ```json ... ```）：
        {
            "title": "你的爆款标题",
            "content": "你的爆款正文内容"
        }
        """

        user_prompt = f"热点新闻：{trend.title}。来源：{trend.platform}。请立马为我生成一篇！"

        # 3. 调用 GLM-4 API
        try:
            response = self.client.chat.completions.create(
                model="glm-4",  # 如果你有更高级的权限，可以改用 "glm-4-plus"
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                # 强制要求 JSON 模式 (如果不把控格式，解析会很麻烦)
                top_p=0.7,
                temperature=0.9
            )
            
            # 获取 AI 的回复文本
            raw_content = response.choices[0].message.content
            # 去掉可能的 markdown 符号 (```json ... ```)
            clean_content = raw_content.replace("```json", "").replace("```", "").strip()
            
            # 解析 JSON
            ai_data = json.loads(clean_content)
            
        except Exception as e:
            print(f"❌ GLM-4 调用失败: {e}")
            raise Exception(f"AI 生成失败: {str(e)}")

        # 4. 存入草稿箱
        new_draft = ContentDraft(
            trend_id=trend.id,
            title=ai_data.get("title", "AI生成标题失败"),
            content=ai_data.get("content", raw_content),
            platform="xhs",
            status="draft"
        )
        self.db.add(new_draft)

        # 5. 标记热点已使用
        trend.is_used = True
        
        self.db.commit()
        return new_draft
    
    def update_draft_content(self, draft_id: int, title: str, content: str):
        """更新草稿内容"""
        draft = self.db.query(ContentDraft).filter(ContentDraft.id == draft_id).first()
        if not draft:
            raise Exception("草稿不存在")
        
        draft.title = title
        draft.content = content
        # 更新时间会自动变化（如果models里配置了onupdate），或者手动更新一下也可以
        # draft.updated_at = datetime.now() 
        
        self.db.commit()
        return draft
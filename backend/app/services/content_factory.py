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

        # 2. 构建提示词 (Prompt Engineering)
        # 这一步是灵魂，你可以根据需要随时修改 prompt
        system_prompt = """
        你是一位拥有百万粉丝的小红书科技博主。你的写作风格特点：
        1. 标题极其吸引眼球，使用"爆款公式"（如：❗️、⚠️、🔥、救命！、绝了）。
        2. 正文多使用Emoji表情，段落短促，语气热情活泼。
        3. 结尾包含3-5个相关Hashtags。
        4. 请以JSON格式返回，包含两个字段：title, content。
        """

        user_prompt = f"请根据这个热点新闻写一篇笔记：{trend.title}。来源平台：{trend.platform}"

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
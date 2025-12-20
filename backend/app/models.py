from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base

class Trend(Base):
    __tablename__ = "trends"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, comment="话题标题")
    platform = Column(String, comment="来源平台: weibo/zhihu/xhs")
    hot_score = Column(Integer, default=0, comment="热度分")
    url = Column(String, unique=True, comment="原始链接")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_used = Column(Boolean, default=False, comment="是否已被采纳写文章")


# 新增 ContentDraft 类
class ContentDraft(Base):
    __tablename__ = "content_drafts"

    id = Column(Integer, primary_key=True, index=True)
    trend_id = Column(Integer, index=True, comment="关联的热点ID")
    
    # 生成的内容
    title = Column(String, comment="AI生成的标题")
    content = Column(Text, comment="AI生成的正文")
    tags = Column(String, comment="标签/话题")
    images = Column(Text, comment="图片路径列表(JSON)")
    
    # 状态管理
    platform = Column(String, default="xhs", comment="目标平台")
    status = Column(String, default="draft", comment="状态: draft(草稿)/approved(已审核)/published(已发布)")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# 新增账号管理表
class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True, comment="平台: xhs/weibo")
    account_name = Column(String, comment="账号昵称")
    cookies_path = Column(String, comment="Cookies文件存储路径")
    status = Column(String, default="active", comment="状态: active/expired")
    last_checked_at = Column(DateTime(timezone=True), comment="最后检查时间")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# 新增发布记录表
class PublishLog(Base):
    __tablename__ = "publish_logs"

    id = Column(Integer, primary_key=True, index=True)
    draft_id = Column(Integer, index=True, comment="关联的草稿ID")
    platform = Column(String, comment="发布平台")
    publish_status = Column(String, comment="状态: success/failed/pending")
    remote_post_id = Column(String, comment="平台返回的帖子ID/链接")
    error_msg = Column(Text, comment="错误信息")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

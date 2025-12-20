from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
import json
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.trend_hunter import TrendHunterService
from app.services.content_factory import ContentFactoryService
from app.models import Trend, ContentDraft
from pydantic import BaseModel

# 测试git上传是否成功
router = APIRouter()

@router.post("/trends/scrape")
def trigger_scrape(db: Session = Depends(get_db)):
    """触发一次抓取任务"""
    service = TrendHunterService(db)
    count = service.scrape_trends()
    return {"status": "success", "message": f"成功抓取并入库 {count} 条新热点"}

@router.get("/trends/list")
def get_trends(page: int = 1, size: int = 10, db: Session = Depends(get_db)):
    """
    获取热点列表 (分页模式)
    - page: 当前页码 (从1开始)
    - size: 每页显示数量
    """
    service = TrendHunterService(db)
    
    # 计算需要跳过多少条数据
    # 例如：第1页跳过0条，第2页跳过10条
    skip = (page - 1) * size
    
    trends = service.get_latest_trends(skip=skip, limit=size)
    total = service.get_total_count()
    
    # 返回结构化数据
    return {
        "items": trends,
        "total": total,
        "page": page,
        "size": size,
        "total_pages": (total + size - 1) // size  # 简单的向上取整计算
    }


# 👇 新增生成接口
@router.post("/content/generate")
def generate_content(trend_id: int, db: Session = Depends(get_db)):
    """根据热点ID生成文章"""
    service = ContentFactoryService(db)
    try:
        draft = service.generate_draft(trend_id)
        return {"status": "success", "draft_id": draft.id, "title": draft.title}
    except Exception as e:
        # 返回 500 错误给前端
        raise HTTPException(status_code=500, detail=str(e))

class CreateManualDraftRequest(BaseModel):
    title: str
    content: str
    tags: Optional[str] = ""
    images: List[str] = []

@router.post("/content/manual")
def create_manual_draft(payload: CreateManualDraftRequest, db: Session = Depends(get_db)):
    """手动创建草稿"""
    draft = ContentDraft(
        title=payload.title,
        content=payload.content,
        tags=payload.tags,
        images=json.dumps(payload.images), # 存为JSON string
        platform="xhs",
        status="draft",
        trend_id=0 # 0 表示手动创建，无关联热点
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return {"status": "success", "draft_id": draft.id}
    

# 👇 在文件末尾追加这个接口
@router.get("/content/list")
def get_drafts(db: Session = Depends(get_db)):
    """获取所有已生成的草稿"""
    return db.query(ContentDraft).order_by(ContentDraft.created_at.desc()).all()

@router.get("/content/published")
def get_published_content(db: Session = Depends(get_db)):
    """获取所有已发布的作品"""
    return db.query(ContentDraft).filter(ContentDraft.status == "published").order_by(ContentDraft.updated_at.desc()).all()

# 2. 定义一个数据模型，用来接收前端发来的修改内容
class UpdateDraftRequest(BaseModel):
    title: str
    content: str
    images: List[str] = []

# 3. 在文件末尾追加这个 PUT 接口
@router.put("/content/update/{draft_id}")
def update_draft(draft_id: int, payload: UpdateDraftRequest, db: Session = Depends(get_db)):
    """更新草稿"""
    service = ContentFactoryService(db)
    try:
        # Update images as well
        # Service doesn't support images update yet? Let's do it manually here or update service
        # For simplicity, do it here or update service. Ideally update service. 
        # But wait, ContentFactoryService.update_draft_content might not have images arg.
        # Let's check ContentFactoryService? No, let's just update draft object directly here if easiest, 
        # or assume service update is needed.
        # Let's direct update draft object here since I don't want to break service interface if not needed or check service file.
        # Check service file logic? I haven't seen service file.
        # Safest is to fetch and update here if I don't modify service.
        # But previous code used service. Let's use service but assume we need to modify service or do manual update.
        # Let's check crud/service first? 
        # Actually, let's just do it directly here to be safe and quick.
        draft = db.query(ContentDraft).filter(ContentDraft.id == draft_id).first()
        if not draft:
            raise HTTPException(status_code=404, detail="Draft not found")
        
        draft.title = payload.title
        draft.content = payload.content
        draft.images = json.dumps(payload.images)
        db.commit()
        
        return {"status": "success", "message": "更新成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# 👇 Module 3: 分发调度模块 (Distributor) 接口
# ==========================================
from app.models import SocialAccount, PublishLog
from app.services.distributor.account_manager import AccountManager
from app.services.distributor.xhs_publisher import XhsPublisher

@router.get("/accounts/list")
def get_accounts(db: Session = Depends(get_db)):
    """获取所有绑定的社交账号"""
    manager = AccountManager(db)
    return manager.get_accounts()

@router.post("/accounts/bind/{platform}")
async def bind_account(platform: str, db: Session = Depends(get_db)):
    """
    绑定新账号 (启动浏览器扫码)
    注意：这是阻塞操作，会弹窗等待。
    """
    manager = AccountManager(db)
    result = await manager.login_qrcode(platform)
    if result['status'] == 'failed':
        raise HTTPException(status_code=500, detail=result['error'])
    return result

@router.delete("/accounts/{account_id}")
def delete_account(account_id: int, db: Session = Depends(get_db)):
    """删除/解绑指定账号"""
    manager = AccountManager(db)
    success = manager.delete_account(account_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"status": "success", "message": "已解绑"}

@router.post("/publish/now")
def publish_content(draft_id: int, account_id: int, db: Session = Depends(get_db)):
    """
    立即发布某个草稿
    """
    # 1. 获取草稿
    draft = db.query(ContentDraft).filter(ContentDraft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    # 2. 获取账号
    account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 3. 实例化发布器
    try:
        publisher = None
        if account.platform == 'xhs':
            publisher = XhsPublisher(account)
        else:
            raise HTTPException(status_code=400, detail="Unsupported platform")

        # 4. 执行发布
        # 构造 content_data
        # 注意：这里还没有图片，暂时只发纯文本，或者需要 Mock 一个图片路径
        content_data = {
            "title": draft.title,
            "content": draft.content,
            "tags": draft.tags,
            "images": json.loads(draft.images) if draft.images else [] 
        }

        status = publisher.publish(content_data)

        # 5. 记录日志
        log = PublishLog(
            draft_id=draft.id,
            platform=account.platform,
            publish_status=status,
            remote_post_id="unknown", # 暂时没拿
            error_msg="" if status=="success" else "Unknown error"
        )
        db.add(log)
        
        # 更新草稿状态
        if status == "success":
            draft.status = "published"
        
        db.commit()
        return {"status": status}

    except Exception as e:
        # 记录失败日志
        log = PublishLog(
            draft_id=draft.id,
            platform=account.platform,
            publish_status="failed",
            error_msg=str(e)
        )
        db.add(log)
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException
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
    

# 👇 在文件末尾追加这个接口
@router.get("/content/list")
def get_drafts(db: Session = Depends(get_db)):
    """获取所有已生成的草稿"""
    return db.query(ContentDraft).order_by(ContentDraft.created_at.desc()).all()

# 2. 定义一个数据模型，用来接收前端发来的修改内容
class UpdateDraftRequest(BaseModel):
    title: str
    content: str

# 3. 在文件末尾追加这个 PUT 接口
@router.put("/content/update/{draft_id}")
def update_draft(draft_id: int, payload: UpdateDraftRequest, db: Session = Depends(get_db)):
    """更新草稿"""
    service = ContentFactoryService(db)
    try:
        service.update_draft_content(draft_id, payload.title, payload.content)
        return {"status": "success", "message": "更新成功"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
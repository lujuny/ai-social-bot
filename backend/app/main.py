from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app import models
from app.api import router as trend_router  # <--- 新增这行
# 1. 自动创建数据库表 (如果表不存在，会自动建表)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Social Bot API", version="1.0.0")

app.include_router(trend_router, prefix="/api/v1") # <--- 新增这行，注册路由


# 2. 配置 CORS (允许前端 React 访问)
origins = [
    "http://localhost:3000",  # Vite 默认端口
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. 测试接口
@app.get("/")
def read_root():
    return {"message": "Hello, AI Social Bot is running!"}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """检查数据库连接状态"""
    try:
        # 尝试查询一条数据验证连接
        db.execute("SELECT 1")
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "error", "db": str(e)}
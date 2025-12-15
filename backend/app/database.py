from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# =========================================================
# ❌ 请确保这一行被注释掉 (前面加 #)
# SQLALCHEMY_DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}..."
# =========================================================

# ✅ 请确保这一行是开启的 (使用 SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# 创建引擎 (注意：SQLite 需要 connect_args)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} # <--- SQLite 必须加这个参数
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
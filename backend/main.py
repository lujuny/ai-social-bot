from fastapi import FastAPI
import redis

app = FastAPI()

# 连接本地的 Docker Redis
r = redis.Redis(host='localhost', port=6379, db=0)

@app.get("/")
def read_root():
    return {"Status": "后端已启动", "Redis连接": r.ping()}
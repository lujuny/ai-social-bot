import sys
import asyncio
import uvicorn

# 在 Windows 上强制使用支持子进程的 ProactorEventLoop
# 必须在 uvicorn 启动前设置
if sys.platform.startswith('win'):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

if __name__ == "__main__":
    # 使用 uvicorn.run 启动应用
    # 注意：这里不能使用 "app.main:app" 字符串形式配合 reload=True，
    # 因为 reload 会重新生成子进程，导致策略失效。
    # 但开发环境需要 reload... 
    # 实际上 uvicorn 的 main 进程如果策略设置正确， spawm 出来的子进程应该也会继承？
    # 不，通常 reload 机制比较复杂。
    # 
    # 经过验证的最佳实践是：即使是 reload 模式，只要主进程设置了 policy，
    # 虽然 uvicorn multiprocess 可能会重置，但通常这样写能覆盖大部分场景。
    # 
    # 如果 reload=True 依然报错，可能需要更复杂的配置，但先试这个最简单的方案。
    # 为了确保 asyncio 此处设置的 policy 生效，必须关闭 reload 模式
    # 因为 reload 模式下 uvicorn 会 spawn 新的子进程，子进程无法继承这里的设置
    print("注意：已关闭热重载 (Reload) 模式以支持 Windows 下的 Playwright")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)

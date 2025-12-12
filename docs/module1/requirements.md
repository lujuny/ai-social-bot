# Module 1: 基础配置与竞品管理 (Config & Competitors)

**核心目标：** 管理账号凭证，并定义“我要学习谁”。

#### 1. 本地配置管理
- **文件路径：** 项目根目录下的 `config.json`。
- **数据结构：**
  ```json
  {
    "platform": "xiaohongshu",
    "cookies": "YOUR_COOKIES_HERE", 
    "system_prompt": "你是一个科技博主，语气要专业且幽默...", 
    "competitor_urls": [
      "[https://www.xiaohongshu.com/explore/](https://www.xiaohongshu.com/explore/)...", 
      "[https://www.xiaohongshu.com/user/](https://www.xiaohongshu.com/user/)..." 
    ],
    "openai_api_key": "sk-..."
  }

- **功能要求：** 提供 Python `ConfigManager` 类，支持读取和**更新** `system_prompt`（为 Module 6 提供写入口）。

#### 2. 浏览器引擎封装

- **工具：** `DrissionPage`
- **功能：** 封装一个 `BrowserService` 类，提供两种启动模式：
  - **Auth Mode:** 加载本地 Cookie，用于 Module 4 发布。
  - **Incognito Mode:** 无痕模式启动，用于 Module 2 和 Module 5 抓取公开数据（防封号）。

#### 3. 验收标准

- [ ] 代码能成功读取 `config.json`。
- [ ] `BrowserService` 能启动 Chrome 并自动打开百度。
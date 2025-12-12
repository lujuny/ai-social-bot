# Module 3: 内容生成 (Content Generation)

**核心目标：** 使用经过“进化”的 Prompt 生成新内容。

#### 1. 文案生成
- **输入：** - 当前的 `system_prompt` (来自 `config.json`，可能已经被 Module 6 优化过)。
  - 参考主题 (来自 Module 2 抓取的 `title`)。
- **动作：** 调用 LLM (OpenAI/DeepSeek) 生成一篇全新的笔记。
- **要求：** JSON 格式输出，包含 `title`, `content`, `tags`。

#### 2. 图片生成 (简化版)
- **动作：** 调用 DALL-E 3 生成一张封面图。
- **备选：** 如果 API 不可用，使用 Python `PIL` 库生成一张纯色背景图，上面印上标题文字（确保流程跑通）。

#### 3. 验收标准
- [ ] 能在 `output/` 目录下生成一张图片。
- [ ] 能在控制台打印出结构化的笔记文案。

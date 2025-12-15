# AI内容生产工厂模块

#### 1. 模块概述

**目标**：解决“怎么写”的问题。基于选题和策略，生成图文/视频内容。 **输入**：选题数据 + 策略配置 (Prompt Templates)。 **输出**：待发布的草稿 (文案 + 图片路径)。

#### 2. 核心功能

- **动态 Prompt 组装**：能够读取 `06_Evolution` 模块下发的策略参数（例如：“语气=犀利”，“结构=总分总”）。
- **多模态生成**：
  - 调用 LLM 生成标题、正文、Hashtags。
  - 调用绘图模型（Midjourney API / Stable Diffusion）生成配图。
- **合规性预检**：本地关键词库过滤敏感词。

#### 3. 技术方案

- **库**：`langchain`, `openai` (or Gemini SDK), `pillow` (图片处理).
- **流程**：
  1. 从 `raw_trends` 获取 `new` 状态的话题。
  2. 加载当前最优 Prompt 模板。
  3. LLM 生成 JSON 格式的文案 (Title, Body, Tags, Image_Prompt)。
  4. 生成图片并保存到本地 `/media` 目录。

#### 4. 数据结构 (Table: `content_drafts`)

| **字段名**         | **类型** | **描述**                            |
| ------------------ | -------- | ----------------------------------- |
| `id`               | UUID     | 主键                                |
| `trend_id`         | UUID     | 关联的选题ID                        |
| `title`            | Varchar  | 生成的标题                          |
| `content_body`     | Text     | 正文内容                            |
| `images_path`      | JSON     | 图片存储路径列表                    |
| `used_strategy_id` | UUID     | 生成时使用的策略ID (用于后期归因)   |
| `status`           | Enum     | 状态 (ready, publishing, published) |
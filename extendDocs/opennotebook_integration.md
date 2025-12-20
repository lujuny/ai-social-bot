# OpenNotebook 融合 aiSocialBot 项目集成方案

## 1. 项目背景与目标

**aiSocialBot** 目前主要依赖“热点标题 + 提示词”进行轻量级创作。为了提升内容生成的**专业度、深度和多模态能力**，计划借鉴 **OpenNotebook** 的核心架构，引入 **RAG (检索增强生成)** 和 **多模态解析** 能力。

**核心目标**：
1.  **让 AI 有记忆**：通过知识库（Knowledge Base），让 Bot 写出符合品牌调性、有行业深度的专业内容。
2.  **让素材更丰富**：支持从 URL、PDF、视频链接等多种来源提取信息，而不仅仅是热点标题。
3.  **拓展内容形式**：引入 AI 播客/口播脚本生成，为向视频平台（抖音/视频号）进军做准备。

---

## 2. 功能融合规划

### 2.1 核心引擎升级：本地知识库 (RAG)

这是 OpenNotebook 的灵魂功能，也是 aiSocialBot 最急需的“大脑”。

*   **功能描述**：
    *   构建一个 `KnowledgeService`，允许用户上传私有资料（PDF产品手册、Word过往爆款文案、TXT行业黑话库）。
    *   利用向量数据库（如 ChromaDB 或 FAISS）对资料进行切片和索引。
*   **集成流程**：
    1.  **新增模块**：`backend/app/services/knowledge_base.py`
    2.  **生成流程变更**：
        *   *Before*: 热点 -> Prompt -> LLM -> 文章
        *   *After*: 热点 -> **知识库检索 (Retrieve)** -> 召回相关知识片段 -> 组合 Prompt (Context + 热点) -> LLM -> **高深度文章**
*   **价值**：解决“AI味”太重、内容空洞的问题，让每篇笔记都像专家写的。

### 2.2 输入端升级：万能素材解析 (Universal Parser)

OpenNotebook 擅长处理多模态输入，我们将其解析能力移植过来。

*   **功能描述**：
    *   不再局限于 `Trend` 列表。
    *   支持用户输入一个 **URL 链接**（微信公众号、知乎高赞回答、B站视频链接）。
    *   后端调用解析器（如 Jina Reader 或 Youtube Transcript API）提取核心内容。
*   **集成流程**：
    1.  **新增 API**：`POST /content/parse_url`
    2.  **逻辑**：
        *   用户输入 URL。
        *   Bot 爬取正文并进行 AI 摘要 (Summary)。
        *   Bot 基于摘要进行“小红书风格化”二创。
*   **价值**：实现“看到好文，一键转为我的小红书笔记”。

### 2.3 输出端升级：AI 播客与口播脚本 (Audio/Script)

借鉴 OpenNotebook 的 Audio Overview 功能。

*   **功能描述**：
    *   在生成图文笔记的同时，附赠一份 **30-60秒的短视频口播脚本**。
    *   (进阶) 调用 TTS (Text-to-Speech) 甚至生成双人对话音频（类似 NotebookLM）。
*   **集成流程**：
    1.  **Prompt 优化**：在 `content_factory.py` 中增加 `video_script` 输出字段。
    2.  **前端展示**：在“内容草稿”面板中增加“查看脚本”或“试听音频”按钮。
*   **价值**：降低短视频制作门槛，实现“图文+视频”双发。

---

## 3. 技术架构演进建议

为了实现上述功能，建议逐步引入以下技术栈组件：

| 组件类型 | 推荐技术 | 用途 |
| :--- | :--- | :--- |
| **向量数据库** | **ChromaDB** (轻量本地) 或 **Qdrant** | 存储知识库切片，支持语义检索 |
| **网页解析** | **BeautifulSoup4** + **Jina Reader** | 清洗网页正文，去除广告干扰 |
| **文档解析** | **PyPDF2** / **LangChain Loaders** | 解析 PDF, Docx 等私有文档 |
| **语音合成** | **Edge-TTS** (免费) 或 **OpenAI TTS** | 生成高质量口播音频 |

---

## 4. 实施路线图 (Roadmap)

### 第一阶段：素材解析 (Easy Win)
- [ ] 引入 `requests` + `beautifulsoup4`。
- [ ] 实现 `POST /content/create_from_url` 接口。
- [ ] 前端增加“链接转笔记”入口。

### 第二阶段：知识库构建 (Core)
- [ ] 部署 ChromaDB (嵌入到 backend 中)。
- [ ] 实现文件上传接口，支持 PDF/TXT 转向量。
- [ ] 修改 `generate_draft` 逻辑，增加 RAG 检索环节。

### 第三阶段：多模态输出 (Advanced)
- [ ] 调整 Prompt 生成口播脚本。
- [ ] 集成 Edge-TTS 生成 MP3。
- [ ] 升级前端播放器组件。

---

这份文档为您提供了从技术选型到落地路径的完整参考，建议优先从 **第一阶段（URL解析）** 开启迭代。

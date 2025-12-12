# Module 6: 策略自优化 (Prompt Optimization)

**核心目标：** 根据 Module 5 的分析，修改 Module 1 的配置，完成闭环。

#### 1. Prompt 进化
- **输入：** Module 5 输出的 `insight`。
- **动作：**
  - 读取当前的 `system_prompt`。
  - **AI 改写：** "请将这个 insight 融入到我的 system_prompt 中，作为一条新的写作规则。"
  - *示例变化：* 从 "写一篇科技文章" -> "写一篇科技文章，必须使用 Step-by-Step 格式，因为用户喜欢"。
  

#### 2. 配置回写
- **动作：** 将新的 Prompt 覆盖写入 `config.json` 文件。

#### 3. 验收标准
- [ ] 程序运行结束后，打开 `config.json`，发现 `system_prompt` 字段的内容变长了，且包含了新的规则。

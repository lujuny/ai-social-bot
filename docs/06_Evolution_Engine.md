# 自进化策略控制模块

#### 1. 模块概述

**目标**：闭环的“决策”。这是系统最核心的差异化模块。 **输入**：分析报告 (`analysis_reports`). **输出**：更新后的策略配置 (`Strategy_Config`).

#### 2. 核心功能

- **优胜劣汰**：如果策略 A（例如：严肃科普风）连续 3 次得分低于平均值，降低其被调用的概率。
- **特征提取**：分析高分文章的共同点（如：都包含“3个技巧”字样），将其写入 Prompt 的 `Requirements` 字段。
- **Prompt 自动迭代**：利用 LLM 自身来优化 Prompt。提示词：“根据这几篇高分文章的特点，帮我优化下一篇的生成指令。”

#### 3. 技术方案

- **逻辑**：强化学习 (Reinforcement Learning) 的简化版 —— 贪婪算法。
- **流程**：
  1. 提取 Top 10% 的高分文章和 Bottom 10% 的低分文章。
  2. 调用 LLM 进行“成败原因总结”。
  3. 更新 `content_factory` 需要读取的 `prompt_templates` 表。

#### 4. 数据结构 (Table: `strategy_config`)

| **字段名**        | **类型** | **描述**                       |
| ----------------- | -------- | ------------------------------ |
| `id`              | Integer  | 主键                           |
| `strategy_name`   | Varchar  | 策略名 (e.g., "Humorous_Tech") |
| `prompt_template` | Text     | 当前使用的 Prompt 模板         |
| `weight`          | Float    | 随机调用时的权重 (0.0 - 1.0)   |
| `last_updated`    | Datetime | 最后一次自我进化时间           |
| `version`         | Integer  | 迭代版本号                     |
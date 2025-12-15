# 数据分析与归因模块

#### 1. 模块概述

**目标**：闭环的“逻辑”。量化内容质量，找出成功/失败原因。 **输入**：基础数据 (`content_stats`). **输出**：分析报告 & 评分 (`Analysis_Result`).

#### 2. 核心功能

- **综合评分计算 (CSI)**：自定义算法，例如 `CSI = (Likes*1 + Comments*2 + Shares*5) / Views`。
- **情感倾向分析**：使用 NLP 分析评论区是“支持”、“反对”还是“嘲讽”。
- **A/B 效果对比**：对比同一话题不同策略下的表现。

#### 3. 技术方案

- **库**：`pandas` (数据处理), `snownlp` / `transformers` (情感分析).
- **逻辑**：
  - 每天凌晨 2 点运行一次批量分析。
  - 将高分内容打标为 `High_Potential`，低分内容打标为 `Need_Improvement`。

#### 4. 数据结构 (Table: `analysis_reports`)

| **字段名**        | **类型** | **描述**                                        |
| ----------------- | -------- | ----------------------------------------------- |
| `draft_id`        | UUID     | 关联草稿                                        |
| `platform`        | Varchar  | 平台                                            |
| `engagement_rate` | Float    | 互动率                                          |
| `sentiment_score` | Float    | 评论情感分 (-1 到 1)                            |
| `final_score`     | Float    | 综合得分 (用于指导进化)                         |
| `conclusion`      | Text     | AI生成的简短评价 (e.g., "标题吸引人但内容空洞") |
# 真学会 LearnLoop · MVP 内容域定义（一次函数）

> 本文是黑客松 / V1 **内容域的唯一口径**：知识点怎么分层、错因怎么归类、Demo 用什么枚举——**全部以本文为准，不再另议**。  
> 配套：[00 文档索引](./00-真学会%20LearnLoop-文档索引.md) · [05-数据模型](./05-真学会%20LearnLoop-数据模型与数据元设计-V1.md) · [03-产品 PRD](./03-真学会%20LearnLoop-产品PRD-V1.md) · [07-交付排期](./07-真学会%20LearnLoop-黑客松交付与排期分工.md)

---

## 0. 文档定位

| 域 | 定什么 | 不定什么 |
| --- | --- | --- |
| **知识点** | 四层结构 + 一次函数 9 个叶子枚举 + 7 条前置关系 | 其他章节的具体 KP（换章时按同结构加表） |
| **错因** | **5 个大类**（封闭枚举）+ 归类边界 | 细项文案（由 AI 按题生成，不入库枚举） |

**执行约束**：
- 原型 mock、PRD 字段、算法输出、学情聚合：**只引用本文枚举**。
- 挂题、热力矩阵、掌握统计：**只用 §1.3 九个叶子知识点**。
- 错因统计、环形图、分组：**只 rollup 到 §2.1 五个大类**；题级 / 人级展示用 AI 生成的 `cause_description` 自然语言。

---

## 1. 知识点体系

### 1.1 层级结构（全产品统一，不可改层）

```text
Subject 科目
 └── Grade 年级
      └── Chapter 章节
           └── KnowledgePoint 知识点（树形；仅叶子可挂题）
                └── Prerequisite 前置关系（有向边，用于根因链）
```

**各层字段（必填）**：

| 层级 | 主键 | 字段 | 说明 |
| --- | --- | --- | --- |
| Subject | `subject_id` | `name` | 如 `SUB-MATH` · 数学 |
| Grade | `grade_id` | `name` · `subject_id` | 如 `G8` · 八年级 |
| Chapter | `chapter_id` | `name` · `grade_id` · `order` | 如 `CH-LF` · 一次函数 |
| KnowledgePoint | `kp_id` | `name` · `short_name` · `chapter_id` · `parent_kp_id` · `order` · `is_taggable` | 见 §1.3；**仅 `is_taggable=true` 可挂题** |
| Prerequisite | — | `from_kp_id` → `to_kp_id` | 缺前置易导致下游出错 |

**扩展规则**（换章节时照此执行，不改结构）：
1. 新增 `Chapter` + 一批 `KnowledgePoint` + `Prerequisite`。
2. `Subject` / `Grade` 复用。
3. 挂题与统计粒度 = 叶子知识点。

### 1.2 MVP 启用范围

| subject_id | grade_id | chapter_id | 叶子知识点 |
| --- | --- | --- | --- |
| `SUB-MATH` | `G8` | `CH-LF` | 9 个（§1.3） |

### 1.3 一次函数 · 叶子知识点（唯一挂题枚举）

| kp_id | name | short_name | parent_kp_id | order |
| --- | --- | --- | --- | --- |
| `KP-LF-01` | 函数与一次函数的概念 | 函数概念 | — | 1 |
| `KP-LF-02` | 一次函数图像与 k、b 的几何意义 | 图像与 k/b | — | 2 |
| `KP-LF-03` | 根据图像判断增减性 | 看图判断增减 | `KP-LF-02` | 3 |
| `KP-LF-04` | 求一次函数解析式（待定系数法） | 求解析式 | `KP-LF-01` | 4 |
| `KP-LF-05` | 一次函数图像的平移 | 图像平移 | `KP-LF-02` | 5 |
| `KP-LF-06` | 求直线与坐标轴交点 | 求交点 | `KP-LF-04` | 6 |
| `KP-LF-07` | 直线与坐标轴围成图形面积 | 围成面积 | `KP-LF-06` | 7 |
| `KP-LF-08` | 一次函数与方程综合 | 与方程结合 | `KP-LF-04` | 8 |
| `KP-LF-09` | 一次函数与不等式综合 | 与不等式结合 | `KP-LF-08` | 9 |

**章节分组节点（不挂题，不参与统计）**：

| kp_id | name |
| --- | --- |
| `KP-LF-G1` | 概念与图像 |
| `KP-LF-G2` | 应用与综合 |

### 1.4 前置关系（根因链，固定 7 条）

| from_kp_id | to_kp_id |
| --- | --- |
| `KP-LF-01` | `KP-LF-04` |
| `KP-LF-02` | `KP-LF-03` |
| `KP-LF-02` | `KP-LF-05` |
| `KP-LF-04` | `KP-LF-06` |
| `KP-LF-06` | `KP-LF-07` |
| `KP-LF-04` | `KP-LF-08` |
| `KP-LF-08` | `KP-LF-09` |

**学情溯源 Demo 根因链叙事（固定）**：

```text
KP-LF-02 图像与 k/b  →  KP-LF-03 看图判断增减  →  KP-LF-07 围成面积  →  KP-LF-08 与方程结合
```

### 1.5 命名与 UI 规范

| 场景 | 用什么 |
| --- | --- |
| 作业布置 / 题库 / 拆题标签 | `short_name`（§1.3 第三列） |
| 学情热力 / 矩阵 / 根因链 | `short_name`；行列只允许 §1.3 九项 |
| 详情 /  tooltip | `name`（完整名称） |
| 跨章内容（如「移项符号」「直角坐标系」） | **MVP 不出现**；后续扩展新 Chapter 后再挂 |

---

## 2. 错因体系

### 2.1 结构：大类封闭 + 描述 AI 生成

错因**不做细项枚举**。结构固定为两部分：

| 字段 | 类型 | 谁定 | 用途 |
| --- | --- | --- | --- |
| `error_cause_category` | 枚举（§2.2 五选一） | 产品定死 | 聚合统计、环形图、学生分组、跨作业趋势 |
| `cause_description` | 字符串 | **AI 按题生成**，老师可改 | 讲评展示、订正讲解、学生端「为什么错」 |

**算法输出（判错时必填）**：

```json
{
  "error_cause_category": "CAT-CONCEPT",
  "cause_description": "会根据公式计算，但未理解图像趋势与 k 正负的对应关系，把增减性判断反了"
}
```

**不做的事**：
- 不维护 `EC-xxx` 细项字典。
- 不在 `Item` 上预挂典型错因。
- 不把 `cause_description` 当作可枚举标签。

### 2.2 错因大类（全产品唯一枚举，共 5 个）

| category | 名称 | 含义 | 判例 |
| --- | --- | --- | --- |
| `CAT-CONCEPT` | 概念性 | 对定义、性质、图像/符号含义等**核心知识理解有误** | k 与增减关系搞反；函数概念混淆 |
| `CAT-READING` | 审题 | **未看清、遗漏或误解**题干、图形、条件或问法 | 漏看图中坐标；求面积却算边长 |
| `CAT-METHOD` | 方法与步骤 | 概念尚可，但**解题策略、公式选择、步骤顺序**错误 | 未先求交点就算面积；解析式方法选错 |
| `CAT-CALC` | 计算 | 思路/方法已基本正确，**运算、代入、符号**执行出错 | 方法对但正负号写错；代入算错 |
| `CAT-EXPRESS` | 书写与表达 | 跳步无依据、未写单位、答句不完整；**不改变对错本质** | 关键式未写；面积缺单位 |

**边界规则（判类时按序执行，命中即停）**：

```text
1. 未使用题面关键条件/问法？     → CAT-READING
2. 核心概念/图像意义理解错误？   → CAT-CONCEPT
3. 方法/步骤/策略错误？         → CAT-METHOD
4. 方法对但算错/符号错？         → CAT-CALC
5. 仅书写格式问题？             → CAT-EXPRESS
```

**不入错因体系的处理**：

| 情形 | 处理 |
| --- | --- |
| 粗心 | 归入 `CAT-CALC` |
| 空白 / 未作答 / 抄袭 | 走 `answer_status`，不写错因 |
| 情绪 / 态度 | 不做自动归因 |

### 2.3 各层怎么用错因

| 模块 | category | cause_description |
| --- | --- | --- |
| 智能批改列表/详情 | 标签 pill | 逐题/逐生展示全文 |
| 备课讲评「错在这里」 | 题级取众数或最高频大类 | 题级展示 1～2 条代表性描述（AI 摘要） |
| 错因构成环形图 | **五类占比** | 不用 |
| 学生分组 / fan-out 订正 | 可按大类分组 | 个性化讲解与变式 prompt 的输入 |
| 学生闯关「为什么错」 | 小标签 | 主文案 |

---

## 3. Demo 卷 · 题目与知识点映射

作业三入口（题库 / 拆题 / 录入）**只能从 §1.3 选 `kp_id`**，一题 1～2 个 KP。

| 题序 | 题干摘要 | kp_id | 备注 |
| --- | --- | --- | --- |
| 1 | 看图判断 y=kx+b 中 k、b 符号 | `KP-LF-03` | |
| 2 | 已知两点求解析式 | `KP-LF-04` | |
| 3 | 直线与坐标轴围成三角形面积 | `KP-LF-07` | |
| 4 | 根据图像判断增减性 | `KP-LF-03` | |
| 5 | 求与 x 轴交点 | `KP-LF-06` | |
| 6 | 图像平移后求解析式 | `KP-LF-05` | |
| 7 | 一次函数与方程 | `KP-LF-08` | |
| 8 | 综合应用（面积/方程） | `KP-LF-07` | 主 KP；可辅 `KP-LF-08` |

错因不在卷面预置；回收后由 AI 对每条错题写入 `category` + `cause_description`。

---

## 4. 与数据模型的映射

| 数据元 / 字段 | 本文定义 |
| --- | --- |
| `Subject` / `Grade` / `Chapter` | §1.1 |
| `KnowledgePoint` 枚举 | §1.3 |
| `Prerequisite` | §1.4 |
| `ErrorCauseCategory`（L1 字典，5 条） | §2.2 |
| `Judgement.error_cause_category` | §2.2 |
| `Judgement.cause_description` | §2.1 |
| `ErrorItem.error_cause_category` + `cause_description` | 同上（从 Judgement 复制） |
| `Item.knowledge_points` | 仅引用 §1.3 |
| 学情热力 / 根因链 | §1.3 + §1.4 |
| 错因构成图 | 按 §2.2 五类聚合 |

---

## 5. 原型 / PRD / 算法对齐要求

### 知识点
- 所有 ktag、fchip、热力格、矩阵行：**只用 §1.3 的 `short_name`**。
- 删除「含参分类讨论」「移项符号」等非本章标签。

### 错因
- UI 展示格式：**`[大类名] cause_description`**，例：`概念性 · 会根据公式计算，但未理解图像趋势与 k 的对应关系`。
- 改判下拉：只能改 **category（五选一）** 和 **description 文案**，无细项列表。
- 环形图图例：**概念性 / 审题 / 方法与步骤 / 计算 / 书写与表达** 五类。

### 算法（R-021 / R-028）
- 输入：题目、标准答案、学生作答、挂题 `kp_id`。
- 输出：`is_correct` · `error_cause_category`（五选一）· `cause_description`（中文，1～2 句，针对该生该题）。

---

## 6. JSON Mock 示例

```json
{
  "subject": { "subject_id": "SUB-MATH", "name": "数学" },
  "grade": { "grade_id": "G8", "name": "八年级", "subject_id": "SUB-MATH" },
  "chapter": { "chapter_id": "CH-LF", "name": "一次函数", "grade_id": "G8", "order": 1 },
  "knowledge_points": [
    {
      "kp_id": "KP-LF-03",
      "name": "根据图像判断增减性",
      "short_name": "看图判断增减",
      "chapter_id": "CH-LF",
      "parent_kp_id": "KP-LF-02",
      "order": 3,
      "is_taggable": true
    }
  ],
  "error_cause_categories": [
    { "category": "CAT-CONCEPT", "name": "概念性" },
    { "category": "CAT-READING", "name": "审题" },
    { "category": "CAT-METHOD", "name": "方法与步骤" },
    { "category": "CAT-CALC", "name": "计算" },
    { "category": "CAT-EXPRESS", "name": "书写与表达" }
  ],
  "judgement_example": {
    "is_correct": false,
    "error_cause_category": "CAT-CONCEPT",
    "cause_description": "会根据公式计算，但未理解图像趋势与 k 正负的对应关系，把增减性判断反了",
    "hit_kp_ids": ["KP-LF-03"]
  }
}
```

---

*版本：V1（定稿）｜ 维护：产品 ｜ 范围：八年级 · 数学 · 一次函数*

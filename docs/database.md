# AI 护肤助理系统数据库设计说明

> 版本：v1.0  
> 更新时间：2026-04-25  
> 说明：本文档定义系统第一阶段基于 Supabase PostgreSQL 的核心数据结构，重点支持用户采集、AI 报告生成、产品管理和后续 B 端扩展。

---

## 一、数据库设计原则

### 1.1 以业务稳定性为先
数据库是系统的长期资产，设计时优先保证：

- 数据可追溯
- 结构可扩展
- 查询效率可接受
- 后续迁移成本可控

### 1.2 先满足 MVP，再预留扩展
当前阶段不追求过度复杂的范式设计，但要预留：

- 多次报告
- 多轮对话
- 用户产品库
- 订单同步
- 私有算法结果
- B 端 API 调用记录

### 1.3 结构化存储优先
AI 相关结果尽量存结构化字段，避免大量只存自然语言文本。

### 1.4 数据分类清晰
建议按以下数据域划分：

- 用户域
- 皮肤画像域
- 对话域
- 报告域
- 产品域
- 日程域
- 订单域
- AI 任务域

---

## 二、数据库选型

### 2.1 主数据库
- `Supabase PostgreSQL`

### 2.2 文件存储
- `Supabase Storage` 或对象存储

### 2.3 鉴权
- `Supabase Auth` 可选
- 若业务侧自己维护 JWT，也可仅使用 PostgreSQL + 自建鉴权

---

## 三、核心实体关系

### 3.1 主要关系概览

```text
users 1 ── 1 skin_profiles
users 1 ── 1 dialogue_states
users 1 ── N dialogue_messages
users 1 ── N skin_reports
users 1 ── N user_products
users 1 ── N skincare_schedules
users 1 ── N orders
```

### 3.2 说明
- `users` 是用户主表
- `skin_profiles` 表示长期画像
- `dialogue_states` 表示当前采集流程状态
- `skin_reports` 表示每次 AI 分析结果
- `user_products` 表示用户已拥有或上传的产品
- `skincare_schedules` 表示日程结果
- `orders` 表示订单或商品购买记录

---

## 四、表结构设计

### 4.1 用户表 `users`

用于保存用户基础身份信息。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| anonymous_id | VARCHAR(64) | 匿名用户标识，唯一 |
| phone | VARCHAR(20) | 手机号，唯一，可为空 |
| nickname | VARCHAR(100) | 昵称 |
| avatar_url | TEXT | 头像 |
| status | VARCHAR(20) | 用户状态，如 active / blocked |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议约束
- `anonymous_id` 唯一
- `phone` 唯一且可空
- `status` 建议使用枚举或约束值集合

#### 示例 SQL
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id VARCHAR(64) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  nickname VARCHAR(100),
  avatar_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.2 皮肤档案表 `skin_profiles`

用于保存用户长期的皮肤画像信息。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| skin_type | VARCHAR(50) | 肤质，如干性、油性、敏感偏干 |
| age_range | VARCHAR(20) | 年龄段 |
| cleansing_habit | TEXT | 清洁习惯 |
| makeup_habit | TEXT | 化妆习惯 |
| skincare_habit | TEXT | 护肤习惯 |
| allergy_history | TEXT | 过敏史 |
| face_photo_urls | TEXT[] | 素颜照片 URL 列表 |
| status | VARCHAR(20) | collecting / completed / archived |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议约束
- `user_id` 外键
- 一般建议一个用户保留一条当前有效档案，也可以按版本保留历史

#### 示例 SQL
```sql
CREATE TABLE skin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skin_type VARCHAR(50),
  age_range VARCHAR(20),
  cleansing_habit TEXT,
  makeup_habit TEXT,
  skincare_habit TEXT,
  allergy_history TEXT,
  face_photo_urls TEXT[],
  status VARCHAR(20) DEFAULT 'collecting',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.3 对话状态表 `dialogue_states`

用于记录用户当前处于哪个采集阶段，以及已经收集了哪些信息。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id，唯一 |
| phase | VARCHAR(50) | 当前阶段 |
| collected_fields | JSONB | 已收集字段 |
| mood_score | INTEGER | 用户配合度或情绪评分 |
| resistance_flag | BOOLEAN | 是否出现抗拒 |
| last_question | TEXT | 最近一次问题 |
| updated_context | JSONB | 最近上下文，可选 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议约束
- `user_id` 唯一
- `phase` 使用固定阶段枚举

#### 示例 SQL
```sql
CREATE TABLE dialogue_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  phase VARCHAR(50) DEFAULT 'welcome',
  collected_fields JSONB DEFAULT '{}'::jsonb,
  mood_score INTEGER DEFAULT 3,
  resistance_flag BOOLEAN DEFAULT FALSE,
  last_question TEXT,
  updated_context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.4 对话消息表 `dialogue_messages`

用于保存用户与 AI 的每轮对话内容，方便回溯和断点续聊。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| dialogue_state_id | UUID | 关联 dialogue_states.id |
| role | VARCHAR(20) | user / assistant / system |
| content | TEXT | 消息内容 |
| attachments | TEXT[] | 附件 URL 列表 |
| message_type | VARCHAR(20) | text / image / voice / mixed |
| created_at | TIMESTAMPTZ | 创建时间 |

#### 建议约束
- `user_id`、`dialogue_state_id` 建议都建索引
- 按时间倒序查询消息较多

#### 示例 SQL
```sql
CREATE TABLE dialogue_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dialogue_state_id UUID REFERENCES dialogue_states(id),
  role VARCHAR(20),
  content TEXT,
  attachments TEXT[],
  message_type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.5 护肤报告表 `skin_reports`

用于存储每次 AI 生成的护肤分析结果。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| skin_profile_id | UUID | 关联 skin_profiles.id |
| report_no | VARCHAR(64) | 报告编号，唯一，可选 |
| overall_score | INTEGER | 总体评分 |
| analysis_text | TEXT | 报告自然语言正文 |
| skin_issues | JSONB | 皮肤问题列表 |
| product_evaluations | JSONB | 产品搭配评估 |
| recommended_ingredients | TEXT[] | 推荐成分 |
| prohibited_ingredients | TEXT[] | 禁忌成分 |
| diet_suggestions | TEXT | 饮食建议 |
| seasonal_notes | TEXT | 季节建议 |
| confidence | DECIMAL(4,3) | 置信度 |
| version | INTEGER | 报告版本 |
| created_at | TIMESTAMPTZ | 创建时间 |

#### 建议约束
- `user_id` 建索引
- `skin_profile_id` 建索引
- 可根据 `version` 支持多次报告迭代

#### 示例 SQL
```sql
CREATE TABLE skin_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skin_profile_id UUID REFERENCES skin_profiles(id),
  report_no VARCHAR(64) UNIQUE,
  overall_score INTEGER,
  analysis_text TEXT,
  skin_issues JSONB,
  product_evaluations JSONB,
  recommended_ingredients TEXT[],
  prohibited_ingredients TEXT[],
  diet_suggestions TEXT,
  seasonal_notes TEXT,
  confidence DECIMAL(4,3),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.6 护肤日程表 `skincare_schedules`

用于保存基于报告和用户产品生成的护肤日程。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| skin_report_id | UUID | 关联 skin_reports.id |
| schedule_date | DATE | 日期 |
| time_of_day | VARCHAR(20) | morning / evening |
| steps | JSONB | 护肤步骤 |
| diet_tips | TEXT | 饮食建议 |
| weather_tips | TEXT | 天气建议 |
| season | VARCHAR(20) | 季节 |
| status | VARCHAR(20) | generated / updated / archived |
| created_at | TIMESTAMPTZ | 创建时间 |

#### 建议约束
- `(user_id, schedule_date, time_of_day)` 唯一
- 一天早晚两条记录较常见

#### 示例 SQL
```sql
CREATE TABLE skincare_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skin_report_id UUID REFERENCES skin_reports(id),
  schedule_date DATE,
  time_of_day VARCHAR(20),
  steps JSONB,
  diet_tips TEXT,
  weather_tips TEXT,
  season VARCHAR(20),
  status VARCHAR(20) DEFAULT 'generated',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, schedule_date, time_of_day)
);
```

---

### 4.7 系统产品表 `products`

用于保存系统产品库，支持后续匹配推荐和图鉴展示。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(200) | 产品名 |
| brand | VARCHAR(100) | 品牌 |
| category | VARCHAR(50) | 类别 |
| ingredients | TEXT[] | 成分列表 |
| ocr_raw_text | TEXT | OCR 原始文本 |
| image_url | TEXT | 产品图片 |
| source | VARCHAR(20) | 来源，如 system / import / crawl |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议约束
- `name`、`brand`、`category` 建索引
- `ingredients` 可用数组或 JSON 存储，视查询方式而定

#### 示例 SQL
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  brand VARCHAR(100),
  category VARCHAR(50),
  ingredients TEXT[],
  ocr_raw_text TEXT,
  image_url TEXT,
  source VARCHAR(20) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.8 用户产品表 `user_products`

用于保存用户自己正在使用的产品，支持手动添加、OCR 识别、订单同步。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| product_id | UUID | 关联 products.id，可为空 |
| custom_name | VARCHAR(200) | 用户自定义名称 |
| category | VARCHAR(50) | 类别 |
| ingredients | TEXT[] | 成分列表 |
| ocr_source_url | TEXT | OCR 来源图片 |
| source | VARCHAR(20) | manual / ocr / order / import |
| order_id | UUID | 关联 orders.id，可为空 |
| status | VARCHAR(20) | active / disabled |
| created_at | TIMESTAMPTZ | 创建时间 |

#### 建议约束
- `user_id` 建索引
- `product_id` 建索引
- `source` 建议使用固定枚举值

#### 示例 SQL
```sql
CREATE TABLE user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  custom_name VARCHAR(200),
  category VARCHAR(50),
  ingredients TEXT[],
  ocr_source_url TEXT,
  source VARCHAR(20) DEFAULT 'manual',
  order_id UUID,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.9 订单表 `orders`

用于保存交易、发货和订单回调信息。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| order_no | VARCHAR(64) | 订单号，唯一 |
| status | VARCHAR(20) | pending / paid / delivered / refunded |
| total_amount | DECIMAL(10,2) | 总金额 |
| items | JSONB | 商品明细 |
| delivered_at | TIMESTAMPTZ | 收货时间 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议约束
- `order_no` 唯一
- `user_id` 建索引

#### 示例 SQL
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_no VARCHAR(64) UNIQUE,
  status VARCHAR(20),
  total_amount DECIMAL(10,2),
  items JSONB,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4.10 AI 任务表 `ai_tasks`

用于记录异步 AI 任务，方便重试、追踪和状态查询。

#### 字段设计

| 字段名 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 关联 users.id |
| task_type | VARCHAR(50) | report / schedule / ocr / dialogue |
| input_data | JSONB | 输入参数 |
| output_data | JSONB | 输出结果 |
| status | VARCHAR(20) | pending / running / done / failed |
| error_message | TEXT | 错误信息 |
| provider | VARCHAR(50) | 模型或算法提供方 |
| model_name | VARCHAR(100) | 模型名称 |
| retry_count | INTEGER | 重试次数 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间 |

#### 建议用途
- 报告生成任务
- OCR 识别任务
- 日程生成任务
- 后续 B 端算法调用任务

#### 示例 SQL
```sql
CREATE TABLE ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_type VARCHAR(50),
  input_data JSONB,
  output_data JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  error_message TEXT,
  provider VARCHAR(50),
  model_name VARCHAR(100),
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 五、索引建议

### 5.1 必须考虑的索引

| 表 | 字段 |
|------|------|
| users | anonymous_id, phone |
| skin_profiles | user_id |
| dialogue_states | user_id |
| dialogue_messages | user_id, dialogue_state_id, created_at |
| skin_reports | user_id, skin_profile_id, created_at |
| skincare_schedules | user_id, schedule_date, time_of_day |
| products | name, brand, category |
| user_products | user_id, product_id, source |
| orders | user_id, order_no |
| ai_tasks | user_id, task_type, status, created_at |

### 5.2 索引原则
- 高频查询字段优先建索引
- 外键字段建议建索引
- 时间倒序列表查询建议加组合索引
- JSONB 字段只在需要时考虑 GIN 索引

---

## 六、状态枚举建议

### 6.1 用户状态 `users.status`
- `active`
- `blocked`
- `deleted`

### 6.2 皮肤档案状态 `skin_profiles.status`
- `collecting`
- `completed`
- `archived`

### 6.3 对话状态 `dialogue_states.phase`
- `welcome`
- `step_skin`
- `step_age`
- `step_habit`
- `step_allergy`
- `step_photo`
- `collecting`
- `analyzing`
- `done`
- `consulting`

### 6.4 报告任务状态 `ai_tasks.status`
- `pending`
- `running`
- `done`
- `failed`

### 6.5 订单状态 `orders.status`
- `pending`
- `paid`
- `delivered`
- `refunded`
- `cancelled`

### 6.6 用户产品状态 `user_products.status`
- `active`
- `disabled`

---

## 七、数据流建议

### 7.1 用户采集数据流
```text
前端采集
→ Go 接口
→ users / skin_profiles / dialogue_states
→ dialogue_messages 记录交互
```

### 7.2 报告生成数据流
```text
Go 创建 ai_tasks
→ Python 处理任务
→ 结果写入 skin_reports
→ ai_tasks 更新为 done
```

### 7.3 图片数据流
```text
前端上传图片
→ Storage 保存
→ 返回 URL
→ 写入 skin_profiles / dialogue_messages / ai_tasks
```

### 7.4 产品数据流
```text
OCR / 手动添加 / 订单同步
→ products 或 user_products
→ 后续用于报告分析和日程生成
```

---

## 八、迁移与版本管理建议

### 8.1 不要直接在生产库上改结构
建议所有表结构变更通过迁移脚本管理。

### 8.2 版本化记录
建议在仓库中维护：

- `migrations/`
- `schema.sql`
- `seed.sql`

### 8.3 数据变更原则
- 新增字段优先，不轻易删字段
- 重命名字段尽量采用兼容策略
- 历史报告和任务记录尽量不可变

---

## 九、第一阶段最小表集

如果要快速落地，建议第一阶段至少实现以下表：

- `users`
- `skin_profiles`
- `dialogue_states`
- `dialogue_messages`
- `skin_reports`
- `user_products`
- `products`
- `ai_tasks`

订单和日程可以在第二阶段补齐。

---

## 十、数据库设计结论

本项目数据库设计的核心目标是：

1. 支撑用户画像采集
2. 支撑 AI 护肤报告生成
3. 支撑产品识别和搭配建议
4. 支撑后续日程和订单扩展
5. 支撑未来 B 端算法 API 的数据追踪

建议第一阶段坚持：

- 结构清晰
- 表少但可扩展
- 结果结构化
- 任务可追踪
- 历史可回放

这样后续无论是接私有算法，还是开放 B 端 API，都不会重做底层数据设计。
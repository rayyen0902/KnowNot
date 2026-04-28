# AI 护肤助理系统 API 设计说明

> 版本：v1.0  
> 更新时间：2026-04-25  
> 说明：本文档定义小程序前端、Go 业务层、Python AI 层之间的接口边界与约定，目标是快速落地、稳定迭代、便于未来扩展为 B 端算法 API。

---

## 一、接口设计原则

### 1.1 统一由 Go 对外暴露
小程序前端只访问 Go 服务，不直接访问 Python AI 服务。这样可以统一处理：

- 鉴权
- 限流
- 日志
- 业务编排
- 错误码
- 版本控制

### 1.2 Python 仅提供内部 AI 能力接口
Python 服务只用于内部调用，负责：

- 皮肤分析
- Prompt 编排
- OCR 识别
- 护肤建议生成
- 结构化结果整理

### 1.3 所有 AI 输出尽量结构化
AI 返回结果必须尽量采用结构化 JSON，而不是只返回自然语言。

原因：

- 便于后端落库
- 便于前端渲染
- 便于做二次整理和检索
- 便于未来 B 端 API 产品化

### 1.4 版本化管理
所有对外接口统一使用版本前缀：

```text
/api/v1/...
```

内部接口使用：

```text
/internal/...
```

---

## 二、统一返回格式

### 2.1 成功响应
```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "trace_id": "xxx"
}
```

### 2.2 失败响应
```json
{
  "code": 40001,
  "message": "参数错误",
  "data": null,
  "trace_id": "xxx"
}
```

### 2.3 常见状态码建议

| code | 含义 |
|------|------|
| 0 | 成功 |
| 40001 | 参数错误 |
| 40101 | 未登录或 Token 失效 |
| 40301 | 无权限 |
| 40401 | 资源不存在 |
| 40901 | 数据冲突 |
| 50001 | 服务内部错误 |
| 50201 | 上游 AI 服务失败 |
| 50301 | 服务暂不可用 |

---

## 三、对外接口定义

### 3.1 用户模块

#### 3.1.1 初始化匿名用户
```text
POST /api/v1/user/init
```

请求：
```json
{}
```

响应：
```json
{
  "user_id": "uuid",
  "token": "jwt-token",
  "anonymous_id": "anon_xxx"
}
```

说明：
- 用于用户首次进入小程序
- 可先创建匿名身份，后续再绑定手机号或授权信息

---

#### 3.1.2 获取用户资料
```text
GET /api/v1/user/profile
```

请求 Header：
```text
Authorization: Bearer <token>
```

响应：
```json
{
  "user_id": "uuid",
  "phone": "138xxxx8888",
  "nickname": "小白",
  "avatar": "https://...",
  "skin_profile_completed": true
}
```

---

#### 3.1.3 更新用户资料
```text
POST /api/v1/user/profile
```

请求：
```json
{
  "nickname": "小白",
  "avatar": "https://..."
}
```

响应：
```json
{
  "user_id": "uuid"
}
```

---

### 3.2 皮肤采集模块

#### 3.2.1 提交皮肤档案
```text
POST /api/v1/skin/profile
```

请求：
```json
{
  "skin_type": "敏感偏干",
  "age_range": "25-34",
  "cleansing_habit": "每天早晚洁面",
  "makeup_habit": "偶尔化妆",
  "skincare_habit": "保湿为主",
  "allergy_history": "对某些酸类不耐受",
  "face_photo_urls": ["https://...", "https://..."]
}
```

响应：
```json
{
  "skin_profile_id": "uuid",
  "status": "saved"
}
```

---

#### 3.2.2 获取皮肤档案
```text
GET /api/v1/skin/profile
```

响应：
```json
{
  "skin_profile_id": "uuid",
  "skin_type": "敏感偏干",
  "age_range": "25-34",
  "cleansing_habit": "每天早晚洁面",
  "makeup_habit": "偶尔化妆",
  "skincare_habit": "保湿为主",
  "allergy_history": "对某些酸类不耐受",
  "face_photo_urls": []
}
```

---

### 3.3 对话与问答模块

#### 3.3.1 发送对话消息
```text
POST /api/v1/dialogue/send
```

请求：
```json
{
  "message": "我最近脸颊很干，还容易泛红",
  "attachments": ["https://..."]
}
```

响应：
```json
{
  "reply": "我先帮你判断一下，你现在更偏向屏障受损和敏感状态...",
  "phase": "collecting",
  "collected_fields": ["skin_type", "allergy_history"],
  "is_analysis_ready": false
}
```

---

#### 3.3.2 获取对话状态
```text
GET /api/v1/dialogue/state
```

响应：
```json
{
  "phase": "step_habit",
  "collected_fields": {
    "skin_type": "敏感偏干",
    "age_range": "25-34"
  },
  "last_message": "你平时早晚用什么洁面？",
  "messages": []
}
```

---

### 3.4 报告模块

#### 3.4.1 生成护肤报告
```text
POST /api/v1/report/generate
```

请求：
```json
{
  "skin_profile_id": "uuid",
  "user_product_ids": ["uuid1", "uuid2"],
  "image_urls": ["https://..."]
}
```

响应：
```json
{
  "report_id": "uuid",
  "status": "processing"
}
```

说明：
- 该接口可同步返回任务状态，也可异步生成后再查询
- 若模型处理时间较长，建议走异步任务模式

---

#### 3.4.2 获取护肤报告详情
```text
GET /api/v1/report/:report_id
```

响应：
```json
{
  "report_id": "uuid",
  "overall_score": 78,
  "skin_issues": ["屏障受损", "泛红", "干燥"],
  "recommended_ingredients": ["神经酰胺", "泛醇", "角鲨烷"],
  "prohibited_ingredients": ["高浓度酸类", "强清洁成分"],
  "diet_suggestions": "少吃辛辣刺激，注意补水",
  "seasonal_notes": "当前季节建议加强保湿",
  "analysis_text": "..."
}
```

---

#### 3.4.3 获取报告列表
```text
GET /api/v1/report/list
```

请求参数：
- `page`
- `size`

响应：
```json
{
  "reports": [],
  "total": 0,
  "page": 1,
  "size": 10
}
```

---

### 3.5 产品模块

#### 3.5.1 上传/识别护肤产品
```text
POST /api/v1/product/ocr
```

请求：
```json
{
  "image_url": "https://..."
}
```

响应：
```json
{
  "ocr_text": "...",
  "ingredients": ["水", "甘油", "神经酰胺"],
  "suggested_name": "某某修护乳",
  "suggested_category": "面霜"
}
```

---

#### 3.5.2 获取系统产品库
```text
GET /api/v1/products
```

请求参数：
- `category`
- `brand`
- `page`
- `size`

响应：
```json
{
  "products": [],
  "total": 0,
  "page": 1,
  "size": 20
}
```

---

#### 3.5.3 添加用户产品
```text
POST /api/v1/user-product
```

请求：
```json
{
  "product_id": "uuid",
  "custom_name": "我在用的面霜",
  "category": "面霜",
  "ingredients": ["水", "甘油"],
  "source": "manual"
}
```

响应：
```json
{
  "user_product_id": "uuid"
}
```

---

#### 3.5.4 获取用户产品库
```text
GET /api/v1/user-product/list
```

响应：
```json
{
  "products": []
}
```

---

### 3.6 日程模块

#### 3.6.1 获取今日护肤日程
```text
GET /api/v1/schedule/today
```

响应：
```json
{
  "date": "2026-04-25",
  "season": "春",
  "morning": [],
  "evening": [],
  "diet_tips": ["多喝水"],
  "weather_tips": ["注意防晒"]
}
```

---

#### 3.6.2 获取日期范围日程
```text
GET /api/v1/schedule/range
```

请求参数：
- `start`
- `end`

响应：
```json
{
  "schedules": []
}
```

---

### 3.7 订单模块

#### 3.7.1 创建订单
```text
POST /api/v1/order/create
```

请求：
```json
{
  "items": [
    {
      "product_id": "uuid",
      "quantity": 1
    }
  ]
}
```

响应：
```json
{
  "order_id": "uuid",
  "order_no": "NO202604250001",
  "total_amount": 99.00,
  "payment_url": "https://..."
}
```

---

#### 3.7.2 获取订单详情
```text
GET /api/v1/order/:order_id
```

响应：
```json
{
  "order_id": "uuid",
  "order_no": "NO202604250001",
  "status": "paid",
  "items": [],
  "delivered_at": null
}
```

---

#### 3.7.3 订单状态回调
```text
POST /api/v1/order/webhook
```

请求：
```json
{
  "order_no": "NO202604250001",
  "status": "delivered",
  "delivered_at": "2026-04-25T10:00:00Z",
  "items": []
}
```

响应：
```json
{
  "success": true
}
```

---

## 四、内部接口定义

### 4.1 对话引擎处理
```text
POST /internal/dialogue/process
```

请求：
```json
{
  "user_id": "uuid",
  "message": "我脸上最近有点泛红",
  "attachments": [],
  "current_state": {
    "phase": "step_habit",
    "collected_fields": {}
  }
}
```

响应：
```json
{
  "reply": "我先帮你判断一下当前状态...",
  "new_phase": "step_allergy",
  "collected_fields": {
    "symptoms": ["泛红"]
  },
  "mood_score": 4,
  "is_analysis_ready": false
}
```

---

### 4.2 皮肤分析
```text
POST /internal/analyze/start
```

请求：
```json
{
  "user_id": "uuid",
  "skin_profile": {},
  "user_products": [],
  "image_urls": []
}
```

响应：
```json
{
  "report_id": "uuid",
  "status": "processing"
}
```

---

### 4.3 分析结果查询
```text
GET /internal/analyze/result/:report_id
```

响应：
```json
{
  "report_id": "uuid",
  "status": "done",
  "result": {}
}
```

---

### 4.4 日程生成
```text
POST /internal/schedule/generate
```

请求：
```json
{
  "user_id": "uuid",
  "skin_profile": {},
  "user_products": [],
  "season": "春",
  "date": "2026-04-25"
}
```

响应：
```json
{
  "schedule_id": "uuid",
  "morning": [],
  "evening": [],
  "diet_tips": [],
  "weather_tips": []
}
```

---

### 4.5 图像 OCR
```text
POST /internal/ocr/recognize
```

请求：
```json
{
  "image_url": "https://..."
}
```

响应：
```json
{
  "ocr_text": "...",
  "ingredients": ["水", "甘油"],
  "confidence": 0.92
}
```

---

### 4.6 Prompt 渲染
```text
POST /internal/prompt/render
```

请求：
```json
{
  "task": "skin_report",
  "user_profile": {},
  "context": {},
  "constitution_version": "v1"
}
```

响应：
```json
{
  "prompt": "...",
  "variables": {}
}
```

---

## 五、鉴权与安全

### 5.1 前端鉴权
- 前端通过 `JWT Token` 访问 Go 接口
- Token 放在 `Authorization` Header 中
- Token 过期后需要刷新或重新登录

### 5.2 内部服务鉴权
Go 调用 Python 时建议增加内部 Token：

```text
X-Internal-Token: your-secret-token
```

### 5.3 回调接口幂等
订单回调、异步任务回调必须支持重复调用，避免重复写入。

### 5.4 图片与隐私
面部图片属于敏感数据，建议：

- 使用对象存储保存
- 限制访问权限
- 记录访问日志
- 提供删除机制

---

## 六、接口落地建议

### 6.1 第一阶段最小可用接口
建议优先实现：

- `POST /api/v1/user/init`
- `GET /api/v1/user/profile`
- `POST /api/v1/skin/profile`
- `POST /api/v1/dialogue/send`
- `POST /api/v1/report/generate`
- `GET /api/v1/report/:report_id`
- `POST /api/v1/product/ocr`
- `GET /api/v1/user-product/list`

### 6.2 第二阶段增强接口
后续再补：

- 日程生成
- 订单回调
- B 端鉴权
- API Key 管理
- 计费统计
- 调用审计

---

## 七、接口设计结论

本项目的接口设计应遵循：

1. 前端统一访问 Go
2. Go 统一编排业务
3. Python 仅做 AI 能力
4. 所有 AI 输出尽量结构化
5. 对外接口统一版本管理
6. 内部接口必须受控和可追踪

这样可以在快速上线的同时，为后续私有算法和 B 端 API 预留良好的扩展空间。
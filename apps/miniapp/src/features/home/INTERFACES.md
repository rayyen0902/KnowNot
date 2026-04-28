# 首页模块化接口文档（Taro 4.2 + React + TS）

本文档描述 `features/home` 下组件与 schema 的接口约定。

---

## 1. 类型文件位置

- 组件 Props：`src/features/home/types/card.ts`
- 页面 schema：`src/features/home/types/schema.ts`

---

## 2. 通用类型（card.ts）

## 2.1 CardBaseProps

```ts
interface CardBaseProps {
  id?: string;
  className?: string;
}
```

---

## 2.2 OptionItem

```ts
interface OptionItem {
  label: string;
  value: string;
  disabled?: boolean;
}
```

---

## 2.3 ChoiceCardProps

```ts
interface ChoiceCardProps extends CardBaseProps {
  title: string;
  hint?: string;
  multiple?: boolean;
  layout?: 'two' | 'three' | 'four';
  options: OptionItem[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  confirmText?: string;
  onConfirm?: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

说明：
- `layout` 控制选项布局列数：
  - `two`：2列
  - `three`：3列
  - `four`：4列（视觉上按两列宽度策略，和首页原稿一致）
- `multiple=true` 时，`value` 推荐使用 `string[]`

---

## 2.4 AllergyCardProps

```ts
interface AllergyCardProps extends CardBaseProps {
  title: string;
  presetOptions?: OptionItem[];
  selectedValues?: string[];
  onPresetToggle?: (value: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  submitText?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}
```

---

## 2.5 UploadPhotoCardProps

```ts
interface UploadPhotoCardProps extends CardBaseProps {
  title: string;
  buttonText?: string;
  tips?: string;
  onUploadClick: () => void;
  disabled?: boolean;
}
```

---

## 2.6 ProductRecommendCardProps

```ts
interface ProductRecommendCardProps extends CardBaseProps {
  title: string;
  tag?: string;
  name: string;
  desc?: string;
  imageUrl?: string;
  imageText?: string;
  onClick?: () => void;
  actionText?: string;
  onAction?: () => void;
}
```

---

## 2.7 Bubble / Notice

```ts
interface BubbleProps extends CardBaseProps {
  text: string;
  time?: string;
  status?: 'sending' | 'sent' | 'failed';
}

interface StatusNoticeCardProps extends CardBaseProps {
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: boolean;
}
```

---

## 3. 页面 Schema（schema.ts）

`HomeBlockSchema` 是首页渲染协议，`HomeFlow` 按 `type` 映射对应组件。

支持类型：
- `assistant_bubble`
- `user_bubble`
- `choice_card`
- `allergy_card`
- `upload_card`
- `product_card`
- `notice_card`

其中 `choice_card` 关键字段：

```ts
{
  id: string;
  type: 'choice_card';
  title: string;
  hint?: string;
  multiple?: boolean;
  options: OptionItem[];
  stateKey: 'skinType' | 'washTime' | 'makeupHabit' | 'routineSteps';
  confirmText?: string;
  action?: 'toReport';
}
```

> 若要启用 2/3/4 列布局，请在 schema 中增加 `layout` 字段并在 `HomeFlow` 透传给 `ChoiceCard`。

---

## 4. ChoiceCard 布局用法示例

```ts
{
  id: 'skin-type',
  type: 'choice_card',
  title: '您如何描述您的基础肤质？',
  layout: 'four',
  options: baseSkinOptions,
  stateKey: 'skinType'
}

{
  id: 'wash-time',
  type: 'choice_card',
  title: '您通常什么时候洗脸？',
  layout: 'three',
  options: washOptions,
  stateKey: 'washTime'
}

{
  id: 'makeup-habit',
  type: 'choice_card',
  title: '您平时的化妆习惯是？',
  layout: 'two',
  options: makeupOptions,
  stateKey: 'makeupHabit'
}
```

---

## 5. 状态管理约定（HomeFlow）

当前 `HomeFlow` 内部维护：
- `skinType: string`
- `washTime: string`
- `makeupHabit: string`
- `routineSteps: string[]`
- `allergyInput: string`
- `allergyPreset: string[]`

交互回调统一由容器接管并分发到路由/Toast/数据提交。

---

## 6. 变更建议

- 组件新增字段：先改 `card.ts`，再改组件实现
- 页面结构新增类型：先改 `schema.ts`，再改 `HomeFlow` 渲染分支
- 保持 `schema -> container -> component` 单向依赖

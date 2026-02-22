# 玄学运程 Web App - 赤马年每日运程

## Project Overview
- **Project name**: 赤马年运程 (Fire Horse Fortune)
- **Type**: Web Application (Next.js)
- **Core functionality**: 2026年丙午年每日运程查询、八字排盘、AI智能解读、五行穿搭建议
- **Target users**: 对玄学有兴趣的用户，尤其是2026年犯太岁生肖(马、鼠、牛、兔)

## Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **玄学库**: lunar-javascript
- **AI**: Claude Haiku/Sonnet (via PAI inference)
- **Deployment**: Railway

## UI/UX Specification

### Visual Design - 新中式 (New Chinese Style)

**Color Palette** (2026火年需静心冷却):
- Primary: 石青 (#4A7C7E) - 主色调
- Secondary: 月白 (#D4E5E5) - 背景
- Accent: 墨色 (#2C3E50) - 文字
- Background: 浅青 (#E8F4F4)
- Fire balancing: 浅蓝 (#A8D8E8) - 用水色中和火气

**Typography**:
- Headings: Noto Serif SC (中文衬线)
- Body: Noto Sans SC
- Numbers: DM Mono (能量值显示)

**Layout**:
- Mobile-first responsive
- Single page app with sections
- Bottom navigation for mobile

### Pages

1. **首页** - 今日概览
   - 大环境指数 (赤马红羊劫)
   - 今日能量值 (0-100)
   - 快速运势卡片

2. **排盘页** - 八字输入
   - 出生日期选择
   - 时辰选择 (早子时/晚子时)
   - 八字四柱显示

3. **今日详情页**
   - 能量雷达图 (财富/事业/感情/健康/灵感)
   - 今日关键词
   - 运势详述 (AI生成)
   - 避坑指南

4. **五行页**
   - 今日幸运色
   - 幸运方位
   - 五行穿搭建议

5. **抽签页**
   - 赛博摇签筒 (Framer Motion)
   - 振动API触觉反馈
   - 灵签解读

6. **静心页**
   - 静心模式 (高火八字专用)
   - 打坐引导
   - 抄经区

### Animations
- 抽签: 签筒摇晃动画 + 签掉落效果
- 翻牌: 三维翻转展示运势卡片
- 八卦: 旋转动画
- 页面过渡: 淡入淡出

## Functionality Specification

### 1. 玄学内核
- 干支转换 (公历→干支)
- 八字排盘 (年/月/日/时四柱)
- 五行生克计算
- 神煞判断 (2026年犯太岁: 马/鼠/牛/兔)
- 纳音五行 (2026: 天河水)

### 2. AI解读
- 基于Claude的智能运势生成
- 考虑2026年赤马年特性
- 八字喜忌分析
- 流日互动计算

### 3. 今日能量值
- 根据八字与流日干支的冲合克泄
- 0-100分值
- 雷达图展示五维

### 4. 五行穿搭
- 每日幸运色推荐
- 幸运方位
- 2026年多推荐水色系

### 5. 犯太岁
- 自动检测生肖
- 马/鼠/牛/兔 特别提示
- 化煞建议

### 6. 大环境指数
- 赤马红羊劫趋势
- 躁动指数
- 稳心建议

## Acceptance Criteria

### Must Have
- [x] 八字排盘准确 (使用lunar-javascript)
- [x] 今日干支显示正确
- [x] 犯太岁生肖检测
- [x] AI运势解读
- [x] 幸运色/方位推荐
- [x] 响应式UI

### Demo Moment (Animation)
- 抽签页面必须有摇晃签筒动画
- 翻牌展示运势必须有3D翻转效果

### Quality Bar
- demo-ready: 完整UI + 动画 + 核心功能
- 部署到Railway可访问

## Non-Goals
- 用户登录系统
- 历史记录存储
- 支付功能

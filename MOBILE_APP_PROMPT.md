# 玄学 Mobile App - Complete Specification

## Project Overview

Build a Chinese Metaphysics (玄学) mobile application for 2026 Fire Horse Year (丙午年) providing daily fortune readings, Bazi (八字) charts, and comprehensive metaphysical analysis.

---

## Core Features

### 1. Daily Fortune (首页)
- Display current day's Ganzhi (干支) - 天干 + 地支
- Energy score calculation (0-100) based on Five Elements relationships
- Seven-day forecast with day selector (今天 + 未来6天)
- Five Elements (五行) display: 木, 火, 土, 金, 水
- Fortune categories: 财富, 事业, 感情, 健康
- Lucky info: 幸运色, 幸运方位, 幸运数字
- TaiSui warning (犯太岁) display when zodiac conflicts with current year

### 2. Bazi Chart (八字排盘)
- Birth date picker
- Birth hour selection (12时辰: 子, 丑, 寅, 卯...)
- Gender selection (男/女)
- Profile save/load (local storage)

**Four Pillars Display (四柱):**
- Year Pillar (年柱): 年干 + 年支 + 纳音
- Month Pillar (月柱): 月干 + 月支 + 纳音
- Day Pillar (日柱): 日干 + 日支 + 纳音 + 日主分析
- Hour Pillar (时柱): 时干 + 时支 + 纳音

**Analysis Tabs:**
- Chart (排盘): Basic info, zodiac, NaYin, Day Master personality
- Daily (今日): Daily keyword, Eastern/Western analysis, energy radar, lucky boosters, avoidance guide
- Weekly (本周): Overview, best days, focus areas, warnings
- Yearly (本年): 2026 Fire Horse year analysis, lucky months, growth areas
- Meihua (梅花): Plum Blossom Numerology hexagram from birth date
- AI (AI分析): AI-powered comprehensive reading

### 3. Five Elements Fashion (五行穿搭)
- Today's lucky colors (3 colors with visual swatches)
- Lucky direction compass (东/南/西/北/中)
- Outfit suggestions: 上衣, 配饰, 鞋履
- 2026 Fire Year tips (water-colored items recommended)

### 4. Fortune Drawing (求签问卜)
- Animated fortune stick/shake interaction
- 8 fortune levels:
  - 上上签 (Excellent)
  - 上签 (Good)
  - 中上 (Above Average)
  - 中签 (Average)
  - 中下 (Below Average)
  - 下签 (Poor)
  - 下下签 (Very Poor)
- Fortune content and interpretation advice

### 5. Meditation (静心打坐)
- Breathing guide with 4 phases: 吸气 → 屏息 → 呼气 → 放松
- Timer (default 5 minutes)
- Scripture collection: 心经, 道德经, 清静经
- Meditation tips for Fire Year

---

## Core Calculations (src/lib/bazi.ts)

### Heavenly Stems (天干)
甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸

### Earthly Branches (地支)
子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥

### Key Functions

```
getBazi(date: Date, timeBranch?: string) → {
  year: string,      // 年柱 (e.g. "庚午")
  month: string,    // 月柱
  day: string,      // 日柱
  time: string,     // 时柱
  yearStem: string,
  yearBranch: string,
  monthStem: string,
  monthBranch: string,
  dayStem: string,
  dayBranch: string,
  timeStem: string,
  timeBranch: string
}

getCurrentDayGanzhi() → { stem, branch, full, year }

calculateEnergyScore(bazi, currentDay) → 0-100

getNayin(ganzhi) → string (60-year cycle, e.g. "天河水")

getStemWuxing(stem) → 木/火/土/金/水 (based on stem index)

getBranchWuxing(branch) → element (from hidden stem)

isTaiSui(zodiac) → boolean (2026: 马, 鼠, 牛, 兔)

getLuckyColors(stem) → string[]

getLuckyDirection(stem) → 东/南/西/北/中

getTaiSuiRemedies(zodiac) → string[] (化解建议)

getMeihuaHexagram(birthDate) → {
  upper: number (1-8),
  lower: number (1-8),
  hexagram: number (1-64),
  name: string,
  chinese: string,
  meaning: string,
  advice: string
}

getBaGuaEarlyHeaven(year) → {
  gua: string,
  element: string,
  meaning: string
}

getLifePathNumber(year, month, day) → 1-33
```

### Five Elements Relationships (五行生克)
- 木生火 → 火生土 → 土生金 → 金生水 → 水生木
- 木克土 → 土克水 → 水克火 → 火克金 → 金克木

### NaYin Cycle (纳音五行) - 60-year cycle
Includes: 海中金, 炉中火, 大林木, 路旁土, 剑锋金, 山头火, 涧下水, 城头土, 白蜡金, 杨柳木, 井泉水, 屋上土, 霹雳火, 松柏木, 长流水, 覆灯火, 天河水, 大驿土, 钗钏金, 桑柘木, 大溪水, 砂石土, 天上火, 壁上土, 金箔金, 覆灯火...

### 64 I Ching Hexagrams (梅花易数)
乾, 坤, 屯, 蒙, 需, 讼, 师, 比, 小畜, 履, 泰, 否, 同人, 大有, 谦, 豫, 随, 蛊, 临, 观, 噬嗑, 贲, 剥, 复, 无妄, 大畜, 颐, 大过, 坎, 离, 咸, 恒, 遯, 大壮, 晋, 明夷, 家人, 睽, 蹇, 解, 损, 益, 夬, 姤, 萃, 升, 困, 井, 革, 鼎, 震, 艮, 渐, 归妹, 丰, 旅, 巽, 兑, 涣, 节, 中孚, 小过, 既济, 未济

### Life Path Meanings (生命灵数)
1. The Independent - Leader, innovator
2. The Diplomat - Cooperative, sensitive
3. The Creative - Expressive, social
4. The Builder - Practical, organized
5. The Adventurer - Freedom-loving
6. The Nurturer - Responsible, caring
7. The Seeker - Analytical, introspective
8. The Achiever - Powerful, ambitious
9. The Humanitarian - Compassionate
11. The Master - Intuitive, spiritual
22. The Master Builder - Practical, powerful

---

## 2026 Fire Horse Year Specifics

- Year: 丙午 (Bing Wu / Fire Horse)
- NaYin: 天河水 (Heavenly River Water)
- Element: 火 (Fire - strong yang)
- TaiSui zodiacs: 马, 鼠, 牛, 兔
- Theme: 冷静调和, 不宜冲动
- Recommendation: 多用水色系物品, 静心养性

---

## User Experience

- Bottom tab navigation (5 tabs)
- Smooth animations for fortune drawing, page transitions
- Tooltips for Chinese terminology
- Responsive layout for all screen sizes
- Profile persistence for returning users

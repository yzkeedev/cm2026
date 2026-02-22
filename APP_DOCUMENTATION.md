# 玄学 Web App (Chinese Metaphysics Web Application)

## Project Overview

A Next.js web application for 2026 Fire Horse Year (丙午年) providing daily fortune readings, Bazi (八字) charts, and Chinese metaphysics analysis.

**Live URL:** https://web-production-0b80a.up.railway.app

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- lunar-javascript (Chinese calendar)
- Railway deployment

---

## App Structure

### Pages (5 total)

1. **Home Page (/)** - Daily fortune overview
   - 7-day forecast selector (today + 6 future days)
   - Current day Ganzhi (干支) display
   - Energy score (0-100)
   - Five elements (五行) display
   - Fortune cards (wealth, career, love, health)
   - Lucky colors, numbers, directions
   - TaiSui (犯太岁) warning when applicable

2. **Bazi Page (/bazi)** - Four Pillars Chart
   - Birth date & time input
   - Gender selection
   - Save/load profiles
   - Tabbed analysis:
     - Chart tab: Four pillars display, NaYin (纳音), Day Master analysis
     - Daily tab: Daily fortune, energy radar, lucky boosters
     - Weekly tab: Weekly overview, best days
     - Yearly tab: 2026 Fire Horse year analysis
     - Meihua tab: Plum Blossom Hexagram (梅花易数), Ba Gua (八卦), Life Path (生命灵数)
     - AI tab: AI-powered deep analysis (MiniMax API)

3. **Wuxing Page (/wuxing)** - Five Elements Fashion
   - Today's lucky colors with color swatches
   - Lucky direction compass
   - Outfit suggestions
   - 2026 Fire Year tips

4. **Fortune Page (/fortune)** - Fortune Drawing (抽签)
   - Animated fortune stick shake
   - 8 fortune levels (上上签 to 下下签)
   - Fortune content and advice

5. **Meditate Page (/meditate)** - Meditation
   - Breathing guide (4-phase: 吸气, 屏息, 呼气, 放松)
   - Timer (5 minutes)
   - Scripture reading (心经, 道德经, 清静经)
   - Meditation tips for Fire Year

### API Routes

1. **/api/fortune** - Daily fortune data generation
2. **/api/analyze** - AI analysis using MiniMax API

---

## Core Library (src/lib/bazi.ts)

### Key Functions

```typescript
// Get Four Pillars from date
getBazi(date: Date, timeBranch?: string): BaziData

// Get today's Ganzhi
getCurrentDayGanzhi(): { stem, branch, full, year }

// Calculate energy score (0-100)
calculateEnergyScore(bazi: BaziData, currentDay): number

// Get NaYin (sound of metals) - 60-year cycle
getNayin(ganzhi: string): string

// Check if conflicting with year zodiac (犯太岁)
isTaiSui(zodiac: string): boolean

// Get lucky colors based on stem
getLuckyColors(stem: string): string[]

// Get lucky direction
getLuckyDirection(stem: string): string

// Calculate Five Elements score
calculateWuxingScore(bazi: BaziData, currentStem): { wealth, career, love, health, creativity }

// Draw random fortune
drawFortune(seed?: number): { number, title, content, advice }

// Plum Blossom Numerology (梅花易数)
getMeihuaHexagram(birthDate: Date): { upper, lower, hexagram, name, chinese, meaning, advice }

// Earlier Heaven Ba Gua (先天八卦)
getBaGuaEarlyHeaven(year: number): { gua, element, meaning }

// Life Path Number (生命灵数)
getLifePathNumber(year, month, day): number
```

### Data Constants

- HEAVENLY_STEMS (天干): 甲,乙,丙,丁,戊,己,庚,辛,壬,癸
- EARTHLY_BRANCHES (地支): 子,丑,寅,卯,辰,巳,午,未,申,酉,戌,亥
- NAYIN (纳音五行): 60-year cycle of sound elements
- WUXING_RELATIONS: Five elements generating/overcoming relationships
- TAI_SUI_ZODIACS: 2026年犯太岁生肖 (马, 鼠, 牛, 兔)
- LUCKY_COLORS_BY_STEM: Lucky colors per heavenly stem
- HEXAGRAMS: 64 I Ching hexagrams
- LIFE_PATH_MEANINGS: Numerology meanings

---

## Design System

### Colors (2026 Fire Year - Cooling palette)

```css
--primary: 182 24% 38%      /* 石青 (Stone Blue) */
--secondary: 180 20% 90%    /* 月白 (Moon White) */
--accent: 210 29% 24%       /* 墨色 (Ink Black) */
--water: 195 70% 70%        /* 水色系 (Water Blue) */
--fire: 15 80% 55%          /* 火红色 (Fire Red) */
```

### Layout Standards
- Mobile-first: `pb-20 md:pb-4` (bottom nav padding)
- Page padding: `pt-2 px-3 md:px-4`
- Card: `rounded-xl p-4 mb-3 shadow-sm`
- Header: `mb-4`, `text-2xl md:text-3xl`

### Typography
- Chinese: Noto Serif SC (headings), Noto Sans SC (body)
- Mono: DM Mono for Ganzhi characters

### Animations
- Framer Motion for transitions
- prefers-reduced-motion support
- Loading: `animate-spin border-4 border-primary`

---

## Environment Variables

```env
# MiniMax API (for AI analysis)
ANTHROPIC_AUTH_TOKEN=your_api_key_here
```

---

## Features to Include

1. **Daily Fortune** - Real-time based on current day stem/branch
2. **7-Day Forecast** - Pagination for future predictions
3. **Bazi Chart** - Complete Four Pillars calculation
4. **Profile Saving** - LocalStorage for birth profiles
5. **AI Analysis** - MiniMax API integration
6. **Plum Blossom** - 64 hexagrams from birth date
7. **Ba Gua** - Earlier Heaven arrangement
8. **Life Path** - Western numerology
9. **Fortune Drawing** - Animated random fortune
10. **Meditation Timer** - Breathing exercises

---

## Deployment

**Railway** - `railway up`

**Build:** `npm run build`
**Dev:** `npm run dev`

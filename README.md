# 玄学 Web App (cm2026)

A comprehensive Chinese + Western fortune-telling web application built with Next.js, TypeScript, and Tailwind CSS. Combines traditional Eastern metaphysics (Bazi, I Ching, Five Elements) with Western divination systems (Tarot, Astrology, Numerology).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

### Chinese Metaphysics (玄学)
- **八字排盘 (Bazi)** - Four Pillars of Destiny
  - Birth chart calculation with year/month/day/hour pillars
  - NaYin (纳音) analysis
  - Day Master (日主) personality analysis
  - AI-powered fortune analysis with MiniMax API

- **五行 (Wuxing)** - Five Elements
  - Element balance calculation
  - Strength/weakness analysis
  - Compatible colors, numbers, directions

- **易经算卦 (I Ching)** - Book of Changes
  - 3-Coin toss divination (三枚铜钱)
  - 64 Hexagrams with full interpretations
  - Changing lines and transformation guidance

### Western Divination
- **塔罗牌 (Tarot)** - 78-card deck
  - Daily card draw (每日一张)
  - 3-Card spread (三牌阵: 过去/现在/未来)
  - Card flip animations with Framer Motion

- **西方占星 (Astrology)** - Western Astrology
  - Sun/Moon/Rising sign calculation
  - Birth chart analysis
  - Daily horoscope
  - Compatibility matching

- **西方灵数 (Numerology)** - Western Numerology
  - Life Path Number
  - Expression Number
  - Soul Urge Number
  - Personality Number

### Daily Features
- **今日能量值** - Daily energy score
- **五行穿搭** - Five Elements fashion advice
- **犯太岁 detection** - Year conflict detection
- **赛博抽签** - Digital fortune sticks
- **静心模式** - Meditation mode

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **AI**: MiniMax API (via Anthropic-compatible endpoint)
- **Chinese Calendar**: lunar-javascript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yzkeedev/cm2026.git
cd cm2026

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# ANTHROPIC_API_KEY=your_api_key
# ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

```env
ANTHROPIC_API_KEY=your_minimax_api_key
ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/       # Bazi AI analysis endpoint
│   │   └── fortune/      # Fortune stick endpoint
│   ├── astrology/        # Western Astrology page
│   ├── bazi/             # Four Pillars page
│   ├── fortune/          # Fortune sticks page
│   ├── iching/           # I Ching divination page
│   ├── meditate/         # Meditation page
│   ├── numerology/       # Numerology page
│   ├── tarot/            # Tarot reading page
│   ├── wuxing/           # Five Elements page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── home-page.tsx     # Home page component
│   ├── navigation.tsx    # Navigation component
│   └── ...
└── lib/
    ├── bazi.ts           # Bazi calculations
    ├── tarot.ts          # Tarot card data
    ├── astrology.ts       # Astrology calculations
    ├── numerology.ts     # Numerology calculations
    └── ...
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Daily fortune overview |
| `/bazi` | Four Pillars birth chart |
| `/wuxing` | Five Elements analysis |
| `/fortune` | Digital fortune sticks |
| `/meditate` | Meditation mode |
| `/tarot` | Tarot card readings |
| `/iching` | I Ching divination |
| `/astrology` | Western astrology |
| `/numerology` | Numerology readings |

## Design

### Style: 新中式 (New Chinese)
- Primary: 石青 (#18243a) - Dark cyan/blue
- Secondary: 月白 - Moon white
- Accent: 墨色 - Ink black
- Gold accents for mystical elements

### Animations
- Card flip animations for Tarot
- Coin toss animations for I Ching
- Smooth transitions with Framer Motion
- Responsive design for all screen sizes

## Deployment

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## License

MIT License - See LICENSE file for details.

## Acknowledgments

- Chinese calendar calculations using lunar-javascript
- Tarot card data from various sources
- I Ching hexagram interpretations
- Design inspiration from traditional Chinese aesthetics

---

**2026年 · 丙午年 · 赤马年**

*玄学 Web App - 融合东方命理与西方占卜*

# All-in-One Fortune Mobile App - Complete Specification

## Project Overview

Build a comprehensive Chinese + Western Fortune mobile application combining multiple metaphysics systems into one unified experience. The app provides daily readings, birth chart analysis, and divination tools across multiple traditions.

---

## Core Features

### 1. Home Dashboard (首页)
- Today's fortune overview combining all systems
- Quick daily horoscope (Western + Chinese)
- Current zodiac energy display
- Navigation to all features

### 2. Bazi Chart (八字排盘) - Four Pillars
**Input:**
- Birth date picker
- Birth time selection (12时辰: 子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥)
- Gender (男/女)
- Save/load profiles

**Output:**
- Year Pillar (年柱): 天干 + 地支 + 纳音
- Month Pillar (月柱): 天干 + 地支 + 纳音
- Day Pillar (日柱): 天干 + 地支 + 纳音 + 日主分析
- Hour Pillar (时柱): 天干 + 地支 + 纳音

**Analysis Tabs:**
- Chart (排盘): Full four pillars, NaYin, Day Master personality
- Daily (今日): Daily keyword, energy radar, lucky boosters
- Weekly (本周): Week overview, best days
- Yearly (本年): Yearly fortune, lucky months

### 3. Tarot Reading (塔罗牌)
**Features:**
- Daily card draw (每日一张)
- Card of the day with meaning
- Past/Present/Future 3-card spread
- Celtic Cross spread (10 cards)

**Card Database (78 cards):**
- Major Arcana (22 cards): The Fool, The Magician, The High Priestess, The Empress, The Emperor, The Hierophant, The Lovers, The Chariot, Strength, The Hermit, Wheel of Fortune, Justice, The Hanged Man, Death, Temperance, The Devil, The Tower, The Star, The Moon, The Sun, Judgment, The World
- Minor Arcana - Wands (10): Ace through Ten + Page, Knight, Queen, King
- Minor Arcana - Cups (10): Ace through Ten + Page, Knight, Queen, King
- Minor Arcana - Swords (10): Ace through Ten + Page, Knight, Queen, King
- Minor Arcana - Pentacles (10): Ace through Ten + Page, Knight, Queen, King

**Card Display:**
- Card name (English + Chinese)
- Upright meaning
- Reversed meaning
- Keywords
- Advice for reading

### 4. I Ching Divination (易经算卦)
**Method:** 3-Coin Toss (三枚铜钱)
- 6 tosses to generate hexagram
- Each toss = 2, 3, 4 (yin/old) or 6, 7, 8, 9 (yang/young)
- Generate 6 lines from bottom to top

**64 Hexagrams:**
1. 乾 Qian - Creative Force
2. 坤 Kun - Receptive Force
3. 屯 Zhun - Difficulty at Beginning
4. 蒙 Meng - Youthful Folly
5. 需 Xu - Waiting
6. 讼 Song - Conflict
7. 师 Shi - The Army
8. 比 Bi - Seeking Alliance
9. 小畜 Xiao Chu - Small Accumulation
10. 履 Lu - Treading Carefully
11. 泰 Tai - Peace and Harmony
12. 否 Pi - Obstruction
13. 同人 Tong Ren - Seeking Fellowship
14. 大有 Da You - Great Possession
15. 谦 Qian - Modesty
16. 豫 Yu - Enthusiasm
17. 随 Sui - Following
18. 蛊 Gu - Decay
19. 临 Lin - Approaching
20. 观 Guan - Contemplation
21. 噬嗑 Shi Ke - Biting Through
22. 贲 Bi - Adornment
23. 剥 Bo - Stripping Away
24. 复 Fu - Return
25. 无妄 Wu Wang - Innocence
26. 大畜 Da Chu - Great Accumulation
27. 颐 Yi - Nourishment
28. 大过 Da Guo - Great Excess
29. 坎 Kan - Danger
30. 离 Li - Clarity
31. 咸 Xian - Influence
32. 恒 Heng - Constancy
33. 遯 Dun - Retreat
34. 大壮 Da Zhuang - Great Strength
35. 晋 Jin - Progress
36. 明夷 Ming Yi - Darkness Visible
37. 家人 Jia Ren - Family
38. 螎 Kui - Opposition
39. 蹇 Jian - Obstruction
40. 解 Jie - Release
41. 损 Sun - Decrease
42. 益 Yi - Increase
43. 夬 Guai - Breakthrough
44. 姤 Gou - Meeting
45. 萃 Cui - Gathering
46. 升 Sheng - Rising
47. 困 Kun - Exhaustion
48. 井 Jing - The Well
49. 革 Ge - Transformation
50. 鼎 Ding - The Cauldron
51. 震 Zhen - Thunder
52. 艮 Gen - Stillness
53. 渐 Jian - Gradual Progress
54. 归妹 Gui Mei - Marriage
55. 丰 Feng - Abundance
56. 旅 Lv - Travel
57. 巽 Xun - Wind
58. 兑 Dui - Joy
59. 涣 Huan - Dispersion
60. 节 Jie - Moderation
61. 中孚 Zhong Fu - Sincerity
62. 小过 Xiao Guo - Small Excess
63. 既济 Ji Ji - Completion
64. 未济 Wei Ji - Before Completion

**Hexagram Display:**
- Chinese name (卦名)
- Unicode symbol
- Judgment (彖辞)
- Image (象辞)
- Line meanings (爻辞)
- Advice

### 5. Western Astrology (西方占星)
**Input:**
- Birth date
- Birth time
- Birth location (optional for rising sign)

**Output:**
- Sun Sign analysis
- Rising Sign (if birth time known)
- Moon Sign (if birth time known)
- Planet positions (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- 12 Houses
- Aspects between planets

**Features:**
- Daily horoscope
- Weekly horoscope
- Monthly horoscope
- Compatibility matching

### 6. Numerology (西方灵数)
**Calculations:**
- Life Path Number (from birth date)
- Expression Number (from birth name)
- Soul Urge Number (from vowels in name)
- Personality Number (from consonants in name)
- Birthday Number

**Life Path Meanings (1-33 + Master numbers):**
1. The Independent - Leader, innovator, determined
2. The Diplomat - Cooperative, sensitive, patient
3. The Creative - Expressive, social, optimistic
4. The Builder - Practical, organized, hardworking
5. The Adventurer - Freedom-loving, versatile
6. The Nurturer - Responsible, caring, harmonious
7. The Seeker - Analytical, introspective, wise
8. The Achiever - Powerful, material, ambitious
9. The Humanitarian - Compassionate, generous
11. The Master Teacher - Intuitive, spiritual
22. The Master Builder - Practical, powerful
33. The Master Healer - Compassionate, spiritual teacher

### 7. Fusion Reading (融合解读)
Combine readings from multiple systems for unified guidance:
- Bazi + Astrology personality blend
- Tarot + I Ching message correlation
- Numerology + Bazi day master synergy

---

## Design Requirements

### UI/UX
- Bottom tab navigation (5-7 tabs)
- Smooth card flip animations (Tarot)
- Shake animation for fortune drawing
- Elegant, mystical aesthetic
- Dark mode support
- Responsive design

### Color Palette
- Primary: Deep purple or mystical blue (#4A0E4E or #1A365D)
- Secondary: Soft gold (#D4AF37)
- Accent: Mystical teal (#008B8B)
- Dark backgrounds for mystical feel

### Navigation Structure
```
Home
├── Bazi (八字)
│   ├── Chart
│   ├── Daily
│   ├── Weekly
│   └── Yearly
├── Tarot (塔罗)
│   ├── Daily Draw
│   ├── 3-Card Spread
│   └── Celtic Cross
├── I Ching (易经)
│   ├── Cast Hexagram
│   ├── Reading
│   └── History
├── Astrology (占星)
│   ├── Birth Chart
│   ├── Horoscope
│   └── Compatibility
└── Numerology (灵数)
    ├── Life Path
    ├── Expression
    └── Soul Urge
```

---

## Data Requirements

### Chinese Calendar Functions
- Convert Gregorian to Lunar date
- Calculate 天干 (Heavenly Stems)
- Calculate 地支 (Earthly Branches)
- Calculate 纳音 (NaYin)
- Determine 生肖 (Zodiac Animal)

### Tarot Database Structure
```json
{
  "id": 0,
  "name": "The Fool",
  "nameChinese": "愚人",
  "symbol": "0",
  "upright": "New beginnings, innocence, spontaneity, free spirit",
  "reversed": "Recklessness, taken advantage of, squandering",
  "keywords": ["beginnings", "trust", "adventure"],
  "element": "Air"
}
```

### I Ching Database Structure
```json
{
  "number": 1,
  "name": "Qian",
  "chinese": "乾",
  "unicode": "☰",
  "judgment": "Creative force succeeds through perseverance",
  "image": "As the dragon lies hidden in the deep, do not act",
  "lines": [
    { "line": 1, "text": "Dragon hidden in the deep. Do not act." },
    { "line": 2, "text": "Dragon appearing in the field. It furthers to see the great man." }
  ]
}
```

### Numerology Name Converter
- PinYin to number mapping
- Chinese character to number (康熙字典笔画)
- Letter to number (A=1, B=2, ... Z=9)

---

## Technical Implementation Notes

### State Management
- Persist user profiles locally
- Save birth charts
- History of readings

### Animations
- Card flip for Tarot
- Shake for fortune/I Ching
- Fade transitions between pages
- Pull-to-refresh

### Offline Capability
- Core calculations work offline
- Full card/hexagram database local
- Sync readings history

---

## Example User Flows

### Daily Reading Flow
1. Open app → Home screen
2. See today's overview
3. Tap "Daily Draw" for Tarot
4. View card interpretation
5. Optionally save reading

### Bazi Analysis Flow
1. Navigate to Bazi tab
2. Enter birth date/time
3. Select gender
4. Tap "Calculate"
5. View four pillars
6. Explore different analysis tabs
7. Save profile for future

### I Ching Divination Flow
1. Navigate to I Ching tab
2. Focus on question
3. Tap "Cast Hexagram"
4. Perform 6 coin tosses
5. View resulting hexagram
6. Read interpretation
7. Save reading

---

## Success Criteria

- Clean, intuitive navigation
- Accurate calculations across all systems
- Beautiful card/hexagram visualizations
- Smooth animations
- Personalization through saved profiles
- Daily engagement features (daily card, horoscope)
- Cross-system insights (fusion readings)

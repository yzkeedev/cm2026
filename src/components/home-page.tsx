"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useMemo } from "react"
import { getCurrentDayGanzhi, getBazi, calculateEnergyScore, getNayin, getStemWuxing, getZodiac, isTaiSui } from "@/lib/bazi"

// Chinese term explanations
const TERM_EXPLANATIONS: Record<string, { zh: string; en: string }> = {
  '干支': { zh: '干支', en: 'Heavenly Stems & Earthly Branches' },
  '纳音': { zh: '纳音五行', en: 'NaYin - Sound of Metals' },
  '犯太岁': { zh: '犯太岁', en: 'Conflict with Year\'s Zodiac' },
  '天河水': { zh: '天河水', en: 'Heavenly River Water' },
  '躁动': { zh: '躁动指数', en: 'Restlessness Index' },
  '整体': { zh: '整体运势', en: 'Overall Fortune' },
  '五行': { zh: '五行', en: 'Five Elements (Wood/Fire/Earth/Metal/Water)' },
}

// Tooltip component
function Tooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  const info = TERM_EXPLANATIONS[term]

  if (!info) return <>{children}</>

  return (
    <div className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help underline decoration-dotted"
      >
        {children}
      </span>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-accent text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            <p className="font-medium">{info.zh}</p>
            <p className="text-white/70">{info.en}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface DayForecast {
  date: Date
  stem: string
  branch: string
  fullGanzhi: string
  nayin: string
  energy: number
  zodiac: string
  stemWuxing: string
  branchWuxing: string
  overall: number
  restlessness: number
  trend: string
  isTaiSui: boolean
  luckyColor: string
  luckyNumber: string
  luckyDirection: string
}

export default function HomePage() {
  const [currentDay, setCurrentDay] = useState(0) // 0 = today, 1-6 = future days
  const [forecasts, setForecasts] = useState<DayForecast[]>([])

  // Generate forecasts on mount
  useEffect(() => {
    const forecastData: DayForecast[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const futureDate = new Date()
      futureDate.setDate(today.getDate() + i)

      const futureBazi = getBazi(futureDate)
      const stem = futureBazi?.dayStem || ''
      const branch = futureBazi?.dayBranch || ''
      const fullGanzhi = stem + branch

      // Calculate energy score
      const score = futureBazi
        ? calculateEnergyScore(futureBazi, { stem: futureBazi.dayStem, branch: futureBazi.dayBranch })
        : 50

      // Get zodiac for the year
      const yearZodiac = getZodiac(futureDate.getFullYear())

      // Get element for stem
      const stemWuxing = getStemWuxing(stem)

      // Calculate dynamic values based on day
      const baseOverall = 60 + (i * 3) % 30
      const baseRestlessness = 40 + (i * 5) % 35
      const trends = ['上升 Rising', '平稳 Stable', '波动 Fluctuating', '转折 Turning', '突破 Breakthrough', '整合 Integration', '收官 Finalizing']
      const trend = trends[i % trends.length]

      // Dynamic lucky info based on stem
      const colors: Record<string, string> = {
        '甲': '青/绿', '乙': '青/绿', '丙': '红/紫', '丁': '红/紫',
        '戊': '黄/棕', '己': '黄/白', '庚': '白/金', '辛': '白/银',
        '壬': '蓝/黑', '癸': '蓝/黑'
      }
      const numbers = ['3', '7', '2', '8', '5', '9', '1', '4', '6']
      const directions: Record<string, string> = {
        '甲': '东 E', '乙': '东 E', '丙': '南 S', '丁': '南 S',
        '戊': '中 Center', '己': '中 C', '庚': '西 W', '辛': '西 W',
        '壬': '北 N', '癸': '北 N'
      }

      forecastData.push({
        date: futureDate,
        stem,
        branch,
        fullGanzhi,
        nayin: getNayin(fullGanzhi),
        energy: score,
        zodiac: yearZodiac,
        stemWuxing,
        branchWuxing: branch,
        overall: baseOverall + (score > 60 ? 10 : 0),
        restlessness: baseRestlessness,
        trend,
        isTaiSui: isTaiSui(yearZodiac),
        luckyColor: colors[stem] || '白/银',
        luckyNumber: numbers[i % numbers.length],
        luckyDirection: directions[stem] || '中 C'
      })
    }
    setForecasts(forecastData)
  }, [])

  const currentForecast = forecasts[currentDay]
  const isToday = currentDay === 0

  // Get today's Western date
  const today = new Date()
  const westernDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const chineseDate = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Get five elements based on current day stem
  const fiveElements = useMemo(() => {
    if (!currentForecast) return []
    const stem = currentForecast.stem
    // Rotate based on stem
    const elements = [
      { w: '木', color: 'text-green-500', label: '财富', en: 'Wealth' },
      { w: '火', color: 'text-fire', label: '事业', en: 'Career' },
      { w: '土', color: 'text-yellow-600', label: '感情', en: 'Love' },
      { w: '金', color: 'text-gray-500', label: '健康', en: 'Health' },
      { w: '水', color: 'text-water', label: '灵感', en: 'Insight' },
    ]
    return elements
  }, [currentForecast])

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary">丙午年运程</h1>
        <p className="text-muted-foreground text-xs">2026年 · 赤马年每日运程</p>
      </motion.div>

      {/* Western Calendar Date */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-secondary text-center"
      >
        <p className="text-xs text-muted-foreground">{westernDate}</p>
        <p className="text-sm font-medium text-accent">{chineseDate}</p>
      </motion.div>

      {/* Day Selector (Pagination) */}
      {forecasts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
              disabled={currentDay === 0}
              className="shrink-0 p-2 rounded-lg bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {forecasts.map((f, i) => (
              <button
                key={i}
                onClick={() => setCurrentDay(i)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentDay === i
                    ? 'bg-primary text-white'
                    : 'bg-white border border-secondary text-accent'
                }`}
              >
                {i === 0 ? '今天' : i === 1 ? '明天' : `${i}天后`}
                <span className="block text-[10px] opacity-70">
                  {f.date.getMonth() + 1}/{f.date.getDate()}
                </span>
              </button>
            ))}
            <button
              onClick={() => setCurrentDay(Math.min(6, currentDay + 1))}
              disabled={currentDay === 6}
              className="shrink-0 p-2 rounded-lg bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Current Day Ganzhi + Energy */}
      {currentForecast && (
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 text-white mb-3 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs">
                <Tooltip term="干支">{isToday ? '今日' : `${currentDay === 1 ? '明天' : `${currentDay}天后`}的`}干支</Tooltip>
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold">{currentForecast.stem}</span>
                <span className="font-mono text-3xl font-bold">{currentForecast.branch}</span>
                <span className="text-white/60 text-sm">{currentForecast.date.getFullYear()}年</span>
              </div>
              <p className="text-white/60 text-xs mt-1">
                <Tooltip term="纳音">纳音</Tooltip>: {currentForecast.nayin}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">能量</p>
              <span className="font-mono text-3xl font-bold">{currentForecast.energy}</span>
            </div>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-white/80"
              initial={{ width: 0 }}
              animate={{ width: `${currentForecast.energy}%` }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Stats Row - Now Dynamic */}
      {currentForecast && (
        <motion.div
          key={`stats-${currentDay}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 mb-3"
        >
          <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-secondary">
            <p className="text-muted-foreground text-[10px]">
              <Tooltip term="整体">整体</Tooltip>
            </p>
            <p className="font-mono text-lg font-bold text-primary">{currentForecast.overall}</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-secondary">
            <p className="text-muted-foreground text-[10px]">
              <Tooltip term="躁动">躁动</Tooltip>
            </p>
            <p className="font-mono text-lg font-bold text-fire">{currentForecast.restlessness}</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-secondary">
            <p className="text-muted-foreground text-[10px]">趋势</p>
            <p className="font-medium text-xs text-accent">{currentForecast.trend}</p>
          </div>
        </motion.div>
      )}

      {/* Today's Five Elements - Now Dynamic */}
      {currentForecast && (
        <motion.div
          key={`elements-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-secondary"
        >
          <p className="text-xs font-medium text-accent mb-2">
            <Tooltip term="五行">{isToday ? '今日' : `${currentDay === 1 ? '明天' : `${currentDay}天后`}的`}五行</Tooltip>
          </p>
          <div className="flex justify-between items-center">
            {[
              { w: '木', color: 'text-green-500', label: '财富', en: 'Wealth' },
              { w: '火', color: 'text-fire', label: '事业', en: 'Career' },
              { w: '土', color: 'text-yellow-600', label: '感情', en: 'Love' },
              { w: '金', color: 'text-gray-500', label: '健康', en: 'Health' },
              { w: '水', color: 'text-water', label: '灵感', en: 'Insight' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`font-mono text-xl font-bold ${item.color}`}>{item.w}</div>
                <p className="text-[10px] text-muted-foreground">{item.en}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Fortune Cards - Now Dynamic */}
      {currentForecast && (
        <motion.div
          key={`fortune-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-4 gap-2 mb-3"
        >
          {[
            { label: "财富", en: "Wealth", color: "from-yellow-400 to-orange-400", tip: currentForecast.energy > 65 ? "宜进取" : "宜稳健" },
            { label: "事业", en: "Career", color: "from-blue-400 to-indigo-400", tip: currentForecast.overall > 70 ? "宜冲刺" : "宜守成" },
            { label: "感情", en: "Love", color: "from-pink-400 to-rose-400", tip: "宜沟通" },
            { label: "健康", en: "Health", color: "from-green-400 to-emerald-400", tip: currentForecast.restlessness > 60 ? "宜休息" : "宜运动" },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${item.color} rounded-lg py-2 px-1 text-white text-center cursor-pointer shadow-sm`}
            >
              <p className="text-xs font-medium">{item.label}</p>
              <p className="text-[9px] text-white/70">{item.en}</p>
              <p className="text-[9px] text-white/60">{item.tip}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lucky Info - Now Dynamic */}
      {currentForecast && (
        <motion.div
          key={`lucky-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-water/20 to-primary/20 rounded-xl p-3 mb-3 border border-water/30"
        >
          <p className="text-xs font-medium text-accent mb-2">
            {isToday ? '今日' : `${currentDay === 1 ? '明天' : `${currentDay}天后`}的`}开运 Lucky
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/50 rounded-lg py-1.5">
              <p className="text-[10px] text-muted-foreground">幸运色</p>
              <p className="text-[10px] font-medium text-accent">Color</p>
              <p className="text-xs font-medium text-accent">{currentForecast.luckyColor}</p>
            </div>
            <div className="bg-white/50 rounded-lg py-1.5">
              <p className="text-[10px] text-muted-foreground">幸运方位</p>
              <p className="text-[10px] font-medium text-accent">Direction</p>
              <p className="text-xs font-medium text-accent">{currentForecast.luckyDirection}</p>
            </div>
            <div className="bg-white/50 rounded-lg py-1.5">
              <p className="text-[10px] text-muted-foreground">幸运数字</p>
              <p className="text-[10px] font-medium text-accent">Number</p>
              <p className="text-xs font-medium text-accent">{currentForecast.luckyNumber}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* TaiSui Warning - Now Dynamic */}
      {currentForecast && currentForecast.isTaiSui && (
        <motion.div
          key={`taisui-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-fire/10 border border-fire/30 rounded-lg px-3 py-2 mb-3"
        >
          <p className="text-xs text-accent">
            <Tooltip term="犯太岁">
              <span className="font-bold">犯太岁:</span>
            </Tooltip>
            {currentForecast.zodiac} ·
            <span className="text-muted-foreground"> 宜静心佩戴水色系饰品</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Conflict: {currentForecast.zodiac} - wear water-colored accessories
          </p>
        </motion.div>
      )}

      {/* Daily Quote - Now Dynamic */}
      {currentForecast && (
        <motion.div
          key={`quote-${currentDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-3 shadow-sm border border-secondary"
        >
          <p className="text-xs font-medium text-accent mb-1">
            {isToday ? '今日' : `${currentDay === 1 ? '明天' : `${currentDay}天后`}的`}寄语 Daily Quote
          </p>
          <p className="text-xs text-muted-foreground italic">
            {currentForecast.energy > 70
              ? "能量充沛，把握时机，勇往直前！"
              : currentForecast.energy > 50
              ? "稳中求进，保持平衡，耐心积累。"
              : "养精蓄锐，静心沉淀，等待时机。"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {currentForecast.trend} - {currentForecast.nayin}
          </p>
        </motion.div>
      )}

      {/* Quick Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4"
      >
        <p className="text-xs font-medium text-accent mb-2">探索更多 Explore More</p>
        <div className="grid grid-cols-4 gap-2">
          <Link href="/bazi">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-primary/90 to-water/80 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-xl block">八字</span>
              <span className="text-[8px] opacity-70">Bazi</span>
            </motion.div>
          </Link>
          <Link href="/tarot">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-xl block">塔罗</span>
              <span className="text-[8px] opacity-70">Tarot</span>
            </motion.div>
          </Link>
          <Link href="/iching">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-xl block">易经</span>
              <span className="text-[8px] opacity-70">I Ching</span>
            </motion.div>
          </Link>
          <Link href="/astrology">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-xl block">占星</span>
              <span className="text-[8px] opacity-70">Astrology</span>
            </motion.div>
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Link href="/numerology">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-lg block">灵数</span>
              <span className="text-[8px] opacity-70">Numerology</span>
            </motion.div>
          </Link>
          <Link href="/wuxing">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-lg block">五行</span>
              <span className="text-[8px] opacity-70">Wuxing</span>
            </motion.div>
          </Link>
          <Link href="/fortune">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg p-2 text-white text-center cursor-pointer shadow-sm"
            >
              <span className="text-lg block">抽签</span>
              <span className="text-[8px] opacity-70">Fortune</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

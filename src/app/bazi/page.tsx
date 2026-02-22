"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getBazi, getZodiac, isTaiSui, getNayin, getTaiSuiRemedies, getMeihuaHexagram, getBaGuaEarlyHeaven, getLifePathNumber, LIFE_PATH_MEANINGS, type BaziData } from "@/lib/bazi"

const TIME_BRANCHES = ['未知', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const TIME_INFO: Record<string, { zh: string; en: string }> = {
  '未知': { zh: '不确定', en: 'Unknown' },
  '子': { zh: '子时', en: '11PM-1AM' },
  '丑': { zh: '丑时', en: '1AM-3AM' },
  '寅': { zh: '寅时', en: '3AM-5AM' },
  '卯': { zh: '卯时', en: '5AM-7AM' },
  '辰': { zh: '辰时', en: '7AM-9AM' },
  '巳': { zh: '巳时', en: '9AM-11AM' },
  '午': { zh: '午时', en: '11AM-1PM' },
  '未': { zh: '未时', en: '1PM-3PM' },
  '申': { zh: '申时', en: '3PM-5PM' },
  '酉': { zh: '酉时', en: '5PM-7PM' },
  '戌': { zh: '戌时', en: '7PM-9PM' },
  '亥': { zh: '亥时', en: '9PM-11PM' },
}

type SavedProfile = {
  id: string
  name: string
  birthDate: string
  timeBranch: string
  gender: string
  zodiac: string
}

type AnalysisTab = 'daily' | 'weekly' | 'yearly' | 'chart' | 'ai' | 'meihua'

type BaziAnalysis = {
  title: string
  dayMaster: {
    stem: string
    branch: string
    personality: string
    traits: string[]
  }
  wuxing: {
    distribution: Record<string, { count: number; status: string }>
    analysis: string
    advice: string
  }
  strengths: string[]
  challenges: string[]
  career: {
    suitable: string[]
    tips: string
    luckyDirections: string[]
  }
  fortune: {
    wealth: string
    rating: string
  }
  year2026: {
    overview: string
    aspects: {
      career: string
      wealth: string
      health: string
      love: string
    }
    advice: string
  }
  lucky: {
    colors: string[]
    numbers: string[]
    directions: string[]
    animals: string[]
  }
  recommendations: string[]
}

const STORAGE_KEY = 'bazi-profiles'

// Analysis content types
interface DailyAnalysis {
  keyword: string
  eastern: string
  western: string
  radar: { dimension: string; score: number; note: string }[]
  booster: { color: string; number: string; direction: string; item: string }
  avoidance: string[]
  aiQuote: string
}

interface WeeklyAnalysis {
  overview: string
  bestDays: { day: string; energy: number; advice: string }[]
  focus: string
  warnings: string[]
}

interface YearlyAnalysis {
  yearlyFortune: string
  luckyMonths: { month: string; energy: number }[]
  keyTheme: string
  growthAreas: string[]
}

// Markdown Analysis Component - uses react-markdown with custom styling
function MarkdownAnalysis({ content }: { content: string }) {
  return (
    <div className="p-5 md:p-6 space-y-6">
      {/* Title */}
      <div className="text-center pb-4 border-b-2 border-amber-400/50">
        <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-wide">
          {content.split('\n')[0].replace(/^#+\s*/, '')}
        </h2>
      </div>

      {/* Render markdown with custom styling */}
      <div className="ai-markdown">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="font-serif text-xl font-semibold text-slate-700 mt-6 mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-semibold text-slate-600 mt-4 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-slate-600 leading-relaxed mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-1 mb-3 text-slate-600">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-1 mb-3 text-slate-600">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-slate-600">{children}</li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse text-sm">{children}</table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gradient-to-r from-slate-700 to-slate-800">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 text-left text-white font-medium">{children}</th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border border-slate-200 text-slate-600">{children}</td>
            ),
            tr: ({ children }) => (
              <tr className="bg-white">{children}</tr>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-amber-400 pl-4 italic text-slate-500 my-3">{children}</blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-slate-100 px-1 py-0.5 rounded text-xs text-slate-700">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg overflow-x-auto mb-3 text-sm">{children}</pre>
            ),
            hr: () => <hr className="my-6 border-slate-200" />,
            strong: ({ children }) => (
              <strong className="text-slate-700 font-semibold">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// Structured Analysis Component - renders JSON data beautifully
function StructuredAnalysis({ data }: { data: BaziAnalysis }) {
  return (
    <div className="p-5 md:p-6 space-y-6">
      {/* Title */}
      <div className="text-center pb-4 border-b-2 border-amber-400/50">
        <h2 className="font-serif text-2xl font-bold text-slate-800 tracking-wide">{data.title}</h2>
      </div>

      {/* Day Master Section */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
          一、日主分析
        </h3>
        <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl font-serif text-slate-600">{data.dayMaster.stem}</span>
            <span className="text-slate-400">+</span>
            <span className="text-3xl font-serif text-slate-600">{data.dayMaster.branch}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">{data.dayMaster.personality}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.dayMaster.traits.map((trait, i) => (
              <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Five Elements Section */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-emerald-400 rounded-full"></span>
          二、五行平衡
        </h3>
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-xl p-4 border border-emerald-100">
          {/* Element Distribution */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Object.entries(data.wuxing.distribution).map(([element, info]) => (
              <div key={element} className="text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-bold
                  ${element === '木' ? 'bg-green-100 text-green-700' :
                    element === '火' ? 'bg-red-100 text-red-700' :
                    element === '土' ? 'bg-amber-100 text-amber-700' :
                    element === '金' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'}`}>
                  {element}
                </div>
                <p className="text-xs text-slate-500 mt-1">{info.count}</p>
                <p className="text-[10px] text-slate-400">{info.status}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">{data.wuxing.analysis}</p>
          <p className="text-emerald-600 text-sm mt-2 font-medium">💡 {data.wuxing.advice}</p>
        </div>
      </section>

      {/* Strengths & Challenges */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-400 rounded-full"></span>
          三、优势与挑战
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <span>✨</span> 优势
            </h4>
            <ul className="space-y-2">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {/* Challenges */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <span>⚡</span> 挑战
            </h4>
            <ul className="space-y-2">
              {data.challenges.map((c, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-amber-500">!</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-400 rounded-full"></span>
          四、事业与财运
        </h3>
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-4 border border-blue-100">
          <div className="mb-3">
            <span className="text-sm font-medium text-blue-700">适合行业：</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.career.suitable.map((ind, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  {ind}
                </span>
              ))}
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{data.career.tips}</p>
          <div className="mt-3 pt-3 border-t border-blue-100">
            <span className="text-sm font-medium text-blue-700">幸运方位：</span>
            <span className="text-slate-600 text-sm ml-2">{data.career.luckyDirections.join('、')}</span>
          </div>
        </div>
      </section>

      {/* Fortune Section */}
      <section className="space-y-3">
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-amber-800">财运评级</span>
            <span className="text-2xl">{data.fortune.rating}</span>
          </div>
          <p className="text-slate-600 text-sm">{data.fortune.wealth}</p>
        </div>
      </section>

      {/* 2026 Year Outlook */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-red-400 rounded-full"></span>
          五、2026年丙午火马年展望
        </h3>
        <div className="bg-gradient-to-br from-red-50 to-orange-50/50 rounded-xl p-4 border border-red-100">
          <p className="text-slate-600 leading-relaxed mb-4">{data.year2026.overview}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="text-center p-2 bg-white/60 rounded-lg">
              <span className="text-xs text-slate-500 block">事业</span>
              <span className="text-sm font-medium text-slate-700">{data.year2026.aspects.career}</span>
            </div>
            <div className="text-center p-2 bg-white/60 rounded-lg">
              <span className="text-xs text-slate-500 block">财运</span>
              <span className="text-sm font-medium text-slate-700">{data.year2026.aspects.wealth}</span>
            </div>
            <div className="text-center p-2 bg-white/60 rounded-lg">
              <span className="text-xs text-slate-500 block">健康</span>
              <span className="text-sm font-medium text-slate-700">{data.year2026.aspects.health}</span>
            </div>
            <div className="text-center p-2 bg-white/60 rounded-lg">
              <span className="text-xs text-slate-500 block">感情</span>
              <span className="text-sm font-medium text-slate-700">{data.year2026.aspects.love}</span>
            </div>
          </div>
          <p className="text-red-600 text-sm font-medium">📋 {data.year2026.advice}</p>
        </div>
      </section>

      {/* Lucky Elements */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyan-400 rounded-full"></span>
          六、幸运元素
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-3 border border-cyan-200 text-center">
            <span className="text-xs text-cyan-600 block">幸运色</span>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {data.lucky.colors.map((c, i) => (
                <span key={i} className="text-sm text-slate-700">{c}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 border border-purple-200 text-center">
            <span className="text-xs text-purple-600 block">幸运数字</span>
            <div className="flex justify-center gap-2 mt-1">
              {data.lucky.numbers.map((n, i) => (
                <span key={i} className="text-sm text-slate-700 font-medium">{n}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-600 block">幸运方位</span>
            <div className="flex justify-center gap-1 mt-1">
              {data.lucky.directions.map((d, i) => (
                <span key={i} className="text-sm text-slate-700">{d}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-3 border border-rose-200 text-center">
            <span className="text-xs text-rose-600 block">贵人属相</span>
            <div className="flex justify-center gap-1 mt-1">
              {data.lucky.animals.map((a, i) => (
                <span key={i} className="text-sm text-slate-700">{a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
          七、个人建议
        </h3>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 rounded-xl p-4 border border-amber-200">
          <ul className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-400 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-600 text-sm leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default function BaziPage() {
  const [birthDate, setBirthDate] = useState("1990-01-01")
  const [timeBranch, setTimeBranch] = useState("子")
  const [gender, setGender] = useState("男")
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([])
  const [showProfiles, setShowProfiles] = useState(false)
  const [bazi, setBazi] = useState<BaziData | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [activeTab, setActiveTab] = useState<AnalysisTab>('daily')
  const [fortuneData, setFortuneData] = useState<DailyAnalysis | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<BaziAnalysis | string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load saved profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSavedProfiles(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse profiles', e)
      }
    }
  }, [])

  // Save profiles to localStorage
  const saveProfile = (profile: SavedProfile) => {
    const updated = [...savedProfiles.filter(p => p.id !== profile.id), profile]
    setSavedProfiles(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  // Delete profile
  const deleteProfile = (id: string) => {
    const updated = savedProfiles.filter(p => p.id !== id)
    setSavedProfiles(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  // Load profile
  const loadProfile = (profile: SavedProfile) => {
    setBirthDate(profile.birthDate)
    setTimeBranch(profile.timeBranch)
    setGender(profile.gender)
    setShowProfiles(false)
  }

  const handleCalculate = async () => {
    const date = new Date(birthDate)
    const actualTimeBranch = timeBranch === '未知' ? '子' : timeBranch
    const baziData = getBazi(date, actualTimeBranch)
    setBazi(baziData)

    // Auto-save current as "最近" if not already saved
    const currentZodiac = getZodiac(date.getFullYear())
    const existing = savedProfiles.find(p => p.birthDate === birthDate && p.timeBranch === timeBranch)
    if (!existing) {
      const newProfile: SavedProfile = {
        id: Date.now().toString(),
        name: '最近',
        birthDate,
        timeBranch,
        gender,
        zodiac: currentZodiac
      }
      saveProfile(newProfile)
    }

    // Get today's GANZHI
    const today = new Date()
    const todayBazi = getBazi(today)
    const todayGanzhi = { stem: todayBazi.dayStem, branch: todayBazi.dayBranch }

    setLoading(true)
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bazi: {
            dayStem: baziData.dayStem,
            dayBranch: baziData.dayBranch,
            yearStem: baziData.yearStem,
            yearBranch: baziData.yearBranch
          },
          todayGanzhi,
          birthDate: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          }
        })
      })
      const result = await response.json()
      if (result.success) {
        setFortuneData(result.data)
      }
    } catch (error) {
      console.error('Failed to get fortune:', error)
    } finally {
      setLoading(false)
      setShowResult(true)
    }
  }

  const zodiac = bazi ? getZodiac(new Date(birthDate).getFullYear()) : ""
  const taiSui = bazi ? isTaiSui(zodiac) : false

  // Get Western zodiac
  const getWesternZodiac = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const zodiacs = [
      { sign: 'Capricorn', start: [12, 22] },
      { sign: 'Aquarius', start: [1, 20] },
      { sign: 'Pisces', start: [2, 19] },
      { sign: 'Aries', start: [3, 21] },
      { sign: 'Taurus', start: [4, 20] },
      { sign: 'Gemini', start: [5, 21] },
      { sign: 'Cancer', start: [6, 21] },
      { sign: 'Leo', start: [7, 23] },
      { sign: 'Virgo', start: [8, 23] },
      { sign: 'Libra', start: [9, 23] },
      { sign: 'Scorpio', start: [10, 23] },
      { sign: 'Sagittarius', start: [11, 22] },
    ]
    for (const z of zodiacs) {
      if (month === z.start[0] && day >= z.start[1]) return z.sign
      if (month === z.start[0] + 1 && day < zodiacs[(zodiacs.indexOf(z) + 1) % 12].start[1]) return z.sign
    }
    return 'Capricorn'
  }

  const birthDateObj = new Date(birthDate)
  const westernZodiac = getWesternZodiac(birthDateObj)

  // Generate personalized analysis based on Bazi
  const getPersonalizedAnalysis = () => {
    if (!bazi) return null

    const dayStem = bazi.dayStem
    const dayBranch = bazi.dayBranch

    // Day Master (日主) analysis
    const dayMasters: Record<string, { element: string; personality: string; strength: string }> = {
      '甲': { element: 'Wood', personality: 'Initiator, leader, growth-oriented', strength: 'Strong in spring, weak in autumn' },
      '乙': { element: 'Wood', personality: 'Flexible, artistic, adaptive', strength: 'Gentle but resilient' },
      '丙': { element: 'Fire', personality: 'Direct, energetic, charismatic', strength: 'Powerful in summer' },
      '丁': { element: 'Fire', personality: 'Intellectual, mysterious, nuanced', strength: 'Subtle but piercing' },
      '戊': { element: 'Earth', personality: 'Stable, reliable, protective', strength: 'Strong in transitional seasons' },
      '己': { element: 'Earth', personality: 'Grounded, nurturing, detail-oriented', strength: 'Enduring patience' },
      '庚': { element: 'Metal', personality: 'Direct, justice-seeking, strong-willed', strength: 'Powerful in autumn' },
      '辛': { element: 'Metal', personality: 'Refined, artistic, precise', strength: 'Delicate but sharp' },
      '壬': { element: 'Water', personality: 'Flowing, adaptable, expansive', strength: 'Powerful in winter' },
      '癸': { element: 'Water', personality: 'Gentle, intuitive, mysterious', strength: 'Deep and penetrating' },
    }

    return dayMasters[dayStem] || null
  }

  const dayMaster = getPersonalizedAnalysis()

  // AI Analysis function
  const handleAiAnalysis = async () => {
    if (!bazi) return

    const birthDateObj = new Date(birthDate)
    setAiLoading(true)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bazi: {
            year: bazi.year,
            month: bazi.month,
            day: bazi.day,
            time: bazi.time,
            dayStem: bazi.dayStem,
            dayBranch: bazi.dayBranch,
            yearStem: bazi.yearStem,
            yearBranch: bazi.yearBranch,
            monthStem: bazi.monthStem,
            monthBranch: bazi.monthBranch,
            timeStem: bazi.timeStem,
            timeBranch: bazi.timeBranch,
          },
          birthDate: {
            year: birthDateObj.getFullYear(),
            month: birthDateObj.getMonth() + 1,
            day: birthDateObj.getDate(),
          },
          gender,
          zodiac,
          westernZodiac,
        })
      })

      const result = await response.json()
      if (result.success) {
        const analysisContent = result.data.analysis
        // Check if it starts with "{" (JSON) or "##" (markdown)
        if (analysisContent.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(analysisContent)
            setAiAnalysis(parsed as BaziAnalysis)
          } catch {
            setAiAnalysis(analysisContent)
          }
        } else {
          // Treat as markdown string
          setAiAnalysis(analysisContent)
        }
        setActiveTab('ai')
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setAiLoading(false)
    }
  }

  // Tab buttons
  const tabs: { id: AnalysisTab; label: string; icon: string }[] = [
    { id: 'chart', label: '排盘', icon: '📊' },
    { id: 'daily', label: '今日', icon: '🌅' },
    { id: 'weekly', label: '本周', icon: '📅' },
    { id: 'yearly', label: '本年', icon: '🗓️' },
    { id: 'meihua', label: '梅花', icon: '🌸' },
    { id: 'ai', label: 'AI分析', icon: '🤖' },
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary">八字排盘</h1>
        <p className="text-muted-foreground text-xs">Four Pillars Personal Analysis</p>
      </motion.div>

      {!showResult ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {/* Saved Profiles Dropdown */}
          {savedProfiles.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowProfiles(!showProfiles)}
                className="w-full bg-white rounded-xl p-3 shadow-sm border border-secondary flex items-center justify-between"
              >
                <span className="text-sm text-accent">📂 Saved / 已保存 ({savedProfiles.length})</span>
                <span className="text-muted-foreground text-xs">▼</span>
              </button>
              {showProfiles && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-secondary z-10 max-h-48 overflow-y-auto">
                  {savedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      onClick={() => loadProfile(profile)}
                      className="p-3 border-b border-secondary last:border-0 flex items-center justify-between hover:bg-muted cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium text-accent">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.birthDate} · {profile.zodiac} · {profile.gender}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProfile(profile.id); }}
                        className="text-fire text-xs px-2 py-1 hover:bg-fire/10 rounded"
                      >
                        Del
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Date & Gender Row */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
            <label className="block text-xs font-medium text-accent mb-2">Birth Date / 出生日期</label>
            <input
              type="date"
              value={birthDate}
              min="1900-01-01"
              max="2100-12-31"
              onChange={(e) => {
                const date = new Date(e.target.value)
                const year = date.getFullYear()
                if (year >= 1900 && year <= 2100) {
                  setBirthDate(e.target.value)
                }
              }}
              className="w-full p-2 text-sm border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
            />
            <div className="flex gap-2 mt-3">
              <label className="text-xs font-medium text-accent shrink-0">Gender / 性别</label>
              <div className="flex gap-2">
                {['男', '女'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-sm transition-all ${
                      gender === g
                        ? "bg-primary text-white"
                        : "bg-muted text-accent hover:bg-secondary"
                    }`}
                  >
                    {g === '男' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Branch Selection */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-secondary">
            <label className="block text-xs font-medium text-accent mb-2">Birth Hour / 出生时辰 (Optional)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {TIME_BRANCHES.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setTimeBranch(branch)}
                  className={`py-1.5 rounded text-xs transition-all ${
                    timeBranch === branch
                      ? "bg-primary text-white"
                      : "bg-muted text-accent hover:bg-secondary"
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {TIME_INFO[timeBranch]?.zh} ({TIME_INFO[timeBranch]?.en})
              {timeBranch === '未知' && ' - Will use day pillar calculation'}
            </p>
          </div>

          {/* Calculate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            className="w-full py-3 bg-primary text-white rounded-xl font-medium shadow-md"
          >
            Generate Chart / 开始排盘
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence>
          {bazi && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {/* Tab Navigation */}
              <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-secondary">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-accent hover:bg-secondary"
                    }`}
                  >
                    <span className="block">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* CHART TAB */}
              {activeTab === 'chart' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {/* Basic Info */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Zodiac / 生肖</p>
                        <p className="font-serif text-3xl text-primary">{zodiac}</p>
                        <p className="text-xs text-muted-foreground">{westernZodiac}</p>
                      </div>
                      <div className="h-12 w-px bg-secondary" />
                      <div>
                        <p className="text-muted-foreground text-xs">Gender / 性别</p>
                        <p className="font-serif text-2xl text-primary">{gender}</p>
                      </div>
                    </div>
                    {taiSui && (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-block mt-2 px-3 py-1 bg-fire/20 text-fire rounded-full text-xs"
                      >
                        犯太岁 / Conflict with Year
                      </motion.div>
                    )}
                  </div>

                  {/* Four Pillars */}
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 text-white">
                    <div className="grid grid-cols-4 gap-1 text-center">
                      {[
                        { label: 'Year / 年', value: bazi.year },
                        { label: 'Month / 月', value: bazi.month },
                        { label: 'Day / 日', value: bazi.day },
                        { label: 'Hour / 时', value: bazi.time },
                      ].map((col, i) => (
                        <div key={col.label}>
                          <p className="text-white/60 text-[10px]">{col.label}</p>
                          <div className="flex justify-center gap-0.5">
                            {col.value.split('').map((char, j) => (
                              <motion.span
                                key={j}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="font-mono text-xl"
                              >
                                {char}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NaYin */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '年', value: getNayin(bazi.year) },
                      { label: '月', value: getNayin(bazi.month) },
                      { label: '日', value: getNayin(bazi.day) },
                      { label: '时', value: getNayin(bazi.time) },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-lg p-2 text-center shadow-sm border border-secondary">
                        <span className="text-[10px] text-muted-foreground">{item.label}</span>
                        <p className="text-xs font-medium text-accent">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Day Master Analysis */}
                  {dayMaster && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
                      <h3 className="font-serif text-lg text-accent mb-3">Day Master / 日主分析</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Element / 五行:</span>
                          <span className="text-xs font-medium text-primary">{dayMaster.element}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Personality:</span>
                          <span className="text-xs font-medium text-accent">{dayMaster.personality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Strength:</span>
                          <span className="text-xs font-medium text-accent">{dayMaster.strength}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TaiSui Remedies */}
                  {taiSui && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-fire/10 border border-fire/30 rounded-xl p-3"
                    >
                      <h3 className="font-serif text-lg text-accent mb-3">Remedies / 化解建议</h3>
                      <div className="flex flex-wrap gap-2">
                        {getTaiSuiRemedies(zodiac).map((advice, i) => (
                          <span key={i} className="px-3 py-1 bg-white rounded-full text-sm text-accent shadow-sm">
                            {advice}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* DAILY TAB */}
              {activeTab === 'daily' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {loading ? (
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Analyzing...</p>
                    </div>
                  ) : fortuneData ? (
                    <>
                      {/* Keyword */}
                      <div className="bg-gradient-to-br from-primary/90 to-water/80 rounded-2xl p-5 text-white">
                        <p className="text-white/70 text-sm">Daily Keyword / 今日关键词</p>
                        <p className="font-serif text-3xl font-bold mt-1">【{fortuneData.keyword}】</p>
                      </div>

                      {/* Eastern Analysis */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                        <h3 className="font-serif text-lg text-accent mb-3">☯️ Eastern / 东方能量</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {fortuneData.eastern}
                        </p>
                      </div>

                      {/* Western Analysis */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                        <h3 className="font-serif text-lg text-accent mb-3">🌌 Western / 西方星示</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {fortuneData.western}
                        </p>
                      </div>

                      {/* Radar */}
                      <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                        <h3 className="font-serif text-lg text-accent mb-3">📊 Energy Radar / 能量雷达</h3>
                        <div className="space-y-3">
                          {fortuneData.radar.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground w-16">{item.dimension}</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score * 20}%` }}
                                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                                />
                              </div>
                              <span className="text-sm font-medium text-accent w-8">
                                {'⭐'.repeat(item.score)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Booster */}
                      <div className="bg-gradient-to-br from-water/20 to-primary/20 rounded-2xl p-5 border border-water/30">
                        <h3 className="font-serif text-lg text-accent mb-3">🍀 Lucky Boosters / 每日开运</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-white/50 rounded-lg p-3">
                            <p className="text-muted-foreground text-xs">Lucky Color / 幸运色</p>
                            <p className="font-medium text-accent">{fortuneData.booster.color}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <p className="text-muted-foreground text-xs">Lucky Number / 幸运数字</p>
                            <p className="font-medium text-accent">{fortuneData.booster.number}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <p className="text-muted-foreground text-xs">Direction / 幸运方位</p>
                            <p className="font-medium text-accent">{fortuneData.booster.direction}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-3">
                            <p className="text-muted-foreground text-xs">Item / 开运物</p>
                            <p className="font-medium text-accent">{fortuneData.booster.item}</p>
                          </div>
                        </div>
                      </div>

                      {/* Avoidance */}
                      <div className="bg-fire/10 border border-fire/30 rounded-2xl p-5">
                        <h3 className="font-serif text-lg text-accent mb-3">🚫 Avoidances / 避坑指南</h3>
                        <ul className="space-y-2">
                          {fortuneData.avoidance.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-fire mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Quote */}
                      <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20">
                        <h3 className="font-serif text-lg text-accent mb-3">💡 AI Quote / AI禅意寄语</h3>
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{fortuneData.aiQuote}"
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <p className="text-muted-foreground">Click calculate to see daily analysis</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* WEEKLY TAB */}
              {activeTab === 'weekly' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-gradient-to-br from-primary/90 to-water/80 rounded-2xl p-5 text-white">
                    <p className="text-white/70 text-sm">Weekly Overview / 本周概览</p>
                    <p className="font-serif text-xl font-bold mt-1">
                      {bazi ? `The week of ${bazi.dayStem}${bazi.dayBranch} energy` : 'Loading...'}
                    </p>
                    <p className="text-white/70 text-sm mt-2">
                      This week focuses on {dayMaster?.element || 'balanced'} energy. Your day master {dayMaster?.personality.split(',')[0].toLowerCase() || 'is adaptable'}.
                    </p>
                  </div>

                  {/* Best Days */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                    <h3 className="font-serif text-lg text-accent mb-3">🌟 Best Days / 最佳日期</h3>
                    <div className="space-y-2">
                      {['Monday', 'Wednesday', 'Friday'].map((day, i) => (
                        <div key={day} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <span className="text-sm font-medium text-accent">{day}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-secondary rounded-full">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${80 - i * 15}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{80 - i * 15}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                    <h3 className="font-serif text-lg text-accent mb-3">🎯 Focus / 需要关注</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Career advancement', 'Financial planning', 'Relationship harmony', 'Health maintenance'].map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-secondary rounded-full text-xs text-accent">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Warnings */}
                  <div className="bg-fire/10 border border-fire/30 rounded-2xl p-5">
                    <h3 className="font-serif text-lg text-accent mb-3">⚠️ Warnings / 注意事项</h3>
                    <ul className="space-y-2">
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-fire mt-1">•</span>
                        Avoid major decisions on weekends when energy is low
                      </li>
                      <li className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-fire mt-1">•</span>
                        Watch for {dayMaster?.element || 'elemental'} conflicts mid-week
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* YEARLY TAB */}
              {activeTab === 'yearly' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-gradient-to-br from-fire/80 to-primary/80 rounded-2xl p-5 text-white">
                    <p className="text-white/70 text-sm">2026 Year / 2026年</p>
                    <p className="font-serif text-2xl font-bold mt-1">赤马年 Fire Horse Year</p>
                    <p className="text-white/70 text-sm mt-2">
                      Year of intense yang fire energy. Stability and water elements are your allies.
                    </p>
                  </div>

                  {/* Yearly Fortune */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                    <h3 className="font-serif text-lg text-accent mb-3">📖 Yearly Fortune / 年运解读</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {bazi ? `Your ${bazi.dayStem}${bazi.dayBranch} day pillar interacts with the fire horse year energy. ` : ''}
                      {dayMaster?.element === 'Wood' ? 'As a Wood day master, you face challenges from the fire year but can grow through proper nourishment.' :
                       dayMaster?.element === 'Fire' ? 'As a Fire day master, this is your birth year - expect amplified energy but also potential burnout.' :
                       dayMaster?.element === 'Earth' ? 'As an Earth day master, you can ground the fire energy and find stability.' :
                       dayMaster?.element === 'Metal' ? 'As a Metal day master, fire can forge your strength but watch for overexertion.' :
                       'As a Water day master, flow with the fire energy and stay adaptable.'}
                    </p>
                  </div>

                  {/* Lucky Months */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                    <h3 className="font-serif text-lg text-accent mb-3">🗓️ Lucky Months / 幸运月份</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { month: 'Mar', energy: 85 },
                        { month: 'Jun', energy: 70 },
                        { month: 'Sep', energy: 75 },
                        { month: 'Dec', energy: 90 },
                      ].map((item) => (
                        <div key={item.month} className="text-center p-2 bg-muted rounded-lg">
                          <p className="text-xs font-medium text-accent">{item.month}</p>
                          <div className="w-full h-1.5 bg-secondary rounded-full mt-1">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.energy}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Growth Areas */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                    <h3 className="font-serif text-lg text-accent mb-3">🌱 Growth Areas / 成长方向</h3>
                    <div className="space-y-2">
                      {['Patience in financial matters', 'Balance in relationships', 'Mental health awareness', 'Strategic planning'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Theme */}
                  <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20">
                    <h3 className="font-serif text-lg text-accent mb-3">🗝️ Key Theme / 核心主题</h3>
                    <p className="text-lg font-medium text-accent text-center">
                      "Tempered in Fire, Emerge in Order"
                    </p>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      2026 is about finding structure amidst chaos. Your Bazi chart reveals the path.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* AI TAB */}
              {activeTab === 'ai' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {!aiAnalysis && !aiLoading && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3 className="font-serif text-xl text-accent mb-2">AI深度分析</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        获取结合东方八字与西方星座的综合AI分析
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAiAnalysis}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-water text-white rounded-full font-medium shadow-lg"
                      >
                        🚀 生成AI分析
                      </motion.button>
                    </div>
                  )}

                  {aiLoading && (
                    <div className="bg-white rounded-2xl p-8 text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">AI正在分析您的命盘...</p>
                      <p className="text-xs text-muted-foreground mt-2">结合东方八字与西方星座智慧</p>
                    </div>
                  )}

                  {aiAnalysis && (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="bg-gradient-to-br from-primary via-primary/95 to-water/70 rounded-2xl p-5 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">🔮</span>
                            <div>
                              <p className="font-serif text-xl tracking-wide">AI深度分析</p>
                              <p className="text-xs text-white/70">MiniMax AI智能解读 · 2026年丙午年</p>
                            </div>
                          </div>
                          <div className="text-right text-white/60 text-xs">
                            <p>命理咨询</p>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Content - Styled as magazine article */}
                      <div className="bg-white rounded-2xl shadow-sm border border-secondary/50 overflow-hidden">
                        {typeof aiAnalysis === 'string' ? (
                          /* Render as structured markdown */
                          <MarkdownAnalysis content={aiAnalysis} />
                        ) : (
                          /* Structured JSON rendering */
                          <StructuredAnalysis data={aiAnalysis as BaziAnalysis} />
                        )}

                        {/* Decorative footer */}
                        <div className="bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 px-6 py-3 flex items-center justify-center gap-2">
                          <span className="text-primary/60">✦</span>
                          <span className="text-xs text-muted-foreground/70">以上分析仅供参考 · 祝您新年吉祥</span>
                          <span className="text-primary/60">✦</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleAiAnalysis}
                          className="flex-1 py-3 bg-gradient-to-r from-primary to-water text-white rounded-xl font-medium shadow-md"
                        >
                          🔄 重新解读
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* MEIHUA (Plum Blossom) TAB */}
              {activeTab === 'meihua' && bazi && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Meihua Hexagram */}
                  {(() => {
                    const birthDateObj = new Date(birthDate)
                    const hexagram = getMeihuaHexagram(birthDateObj)
                    const baGua = getBaGuaEarlyHeaven(birthDateObj.getFullYear())
                    const lifePath = getLifePathNumber(birthDateObj.getFullYear(), birthDateObj.getMonth() + 1, birthDateObj.getDate())
                    const lifePathInfo = LIFE_PATH_MEANINGS[lifePath] || LIFE_PATH_MEANINGS[1]

                    return (
                      <>
                        {/* Hexagram Display */}
                        <div className="bg-gradient-to-br from-primary/90 to-water/80 rounded-2xl p-5 text-white">
                          <p className="text-white/70 text-sm">梅花易数 / Plum Blossom Hexagram</p>
                          <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="text-8xl font-serif">{hexagram.chinese}</div>
                            <div className="text-left">
                              <p className="text-2xl font-bold">{hexagram.name}</p>
                              <p className="text-white/70 text-sm">{hexagram.meaning}</p>
                              <p className="text-white/70 text-xs mt-2">Upper: {hexagram.upper} / Lower: {hexagram.lower}</p>
                            </div>
                          </div>
                          <p className="text-center mt-4 text-white/80">"{hexagram.advice}"</p>
                        </div>

                        {/* Ba Gua */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                          <h3 className="font-serif text-lg text-accent mb-3">☯️ 先天八卦 / Early Heaven Ba Gua</h3>
                          <div className="flex items-center justify-center gap-8">
                            <div className="text-5xl font-serif text-primary">{baGua.gua}</div>
                            <div>
                              <p className="text-sm font-medium text-accent">Element: {baGua.element}</p>
                              <p className="text-xs text-muted-foreground">{baGua.meaning}</p>
                            </div>
                          </div>
                        </div>

                        {/* Life Path Number */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-secondary">
                          <h3 className="font-serif text-lg text-accent mb-3">🔢 生命灵数 / Life Path Number</h3>
                          <div className="text-center">
                            <p className="text-5xl font-bold text-primary">{lifePath}</p>
                            <p className="text-lg font-medium text-accent mt-2">{lifePathInfo.name}</p>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-left">
                              <div className="bg-muted rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Strengths</p>
                                <p className="text-sm text-accent">{lifePathInfo.strengths}</p>
                              </div>
                              <div className="bg-muted rounded-lg p-3">
                                <p className="text-xs text-muted-foreground">Challenges</p>
                                <p className="text-sm text-accent">{lifePathInfo.challenges}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Combined Analysis */}
                        <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-5 border border-accent/20">
                          <h3 className="font-serif text-lg text-accent mb-3">🔮 Combined Insights</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Your birth creates a unique energetic signature: the {hexagram.name} hexagram ({hexagram.chinese}) from Plum Blossom Numerology, combined with {baGua.gua} from the Early Heaven Ba Gua, and Life Path {lifePath} ({lifePathInfo.name}). This year (2026 Fire Horse), focus on {hexagram.advice.toLowerCase()} while honoring your {lifePathInfo.name.toLowerCase()} nature.
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </motion.div>
              )}

              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowResult(false)}
                className="w-full py-4 bg-secondary text-accent rounded-2xl font-medium"
              >
                ← Back / 重新输入
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

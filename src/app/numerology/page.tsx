"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getNumerologyReading, NUMEROLOGY_MEANINGS, type NumerologyReading } from "@/lib/numerology"
import { useBirthDate } from "@/hooks/useBirthDate"

type TabType = 'overview' | 'lifePath' | 'expression' | 'soulUrge' | 'personality' | 'birthday'

// Number display component
function NumberDisplay({ number, size = 'normal' }: { number: number; size?: 'small' | 'normal' | 'large' }) {
  const sizeClasses = {
    small: 'w-12 h-12 text-xl',
    normal: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl'
  }

  const isMaster = [11, 22, 33].includes(number)

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold
      ${isMaster
        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30'
        : 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
      }`}>
      {number}
    </div>
  )
}

// Number card component
function NumberCard({
  title,
  subtitle,
  number,
  onClick,
  isActive
}: {
  title: string
  subtitle: string
  number: number
  onClick?: () => void
  isActive?: boolean
}) {
  const meaning = NUMEROLOGY_MEANINGS[number]

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer
        ${isActive ? 'border-primary shadow-md' : 'border-secondary hover:border-primary/50'}`}
    >
      <div className="flex items-center gap-4">
        <NumberDisplay number={number} size="small" />
        <div className="flex-1">
          <h3 className="font-medium text-accent">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {meaning?.chinese}
        </span>
      </div>
    </motion.div>
  )
}

// Detail card component
function DetailCard({
  title,
  subtitle,
  number,
  data
}: {
  title: string
  subtitle: string
  number: number
  data: NumerologyReading['lifePath']
}) {
  const meaning = NUMEROLOGY_MEANINGS[number] || NUMEROLOGY_MEANINGS[1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <NumberDisplay number={number} size="large" />
        </div>
        <h2 className="font-serif text-2xl text-primary">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
        <div className="inline-block mt-2 px-4 py-1 bg-secondary rounded-full">
          <span className="text-lg font-medium text-accent">{meaning.chinese}</span>
        </div>
      </div>

      {/* Personality */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary">
        <h3 className="font-serif text-lg text-accent mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          性格特質
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {meaning.personality}
        </p>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
            <span>優勢</span>
          </h4>
          <ul className="space-y-2">
            {meaning.strengths.map((s, i) => (
              <li key={i} className="text-sm text-green-600 flex items-center gap-2">
                <span className="text-green-400">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="font-medium text-amber-700 mb-3 flex items-center gap-2">
            <span>挑戰</span>
          </h4>
          <ul className="space-y-2">
            {meaning.challenges.map((c, i) => (
              <li key={i} className="text-sm text-amber-600 flex items-center gap-2">
                <span className="text-amber-400">!</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Careers */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary">
        <h3 className="font-serif text-lg text-accent mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          適合職業
        </h3>
        <div className="flex flex-wrap gap-2">
          {meaning.careers.map((c, i) => (
            <span key={i} className="px-3 py-1 bg-secondary text-accent text-sm rounded-full">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Relationships */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary">
        <h3 className="font-serif text-lg text-accent mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          感情關係
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {meaning.relationships}
        </p>
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-primary/10 to-water/10 rounded-xl p-5 border border-primary/20">
        <h3 className="font-serif text-lg text-accent mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
          智慧寄語
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {meaning.advice}
        </p>
      </div>
    </motion.div>
  )
}

export default function NumerologyPage() {
  const { birthDate, setBirthDate, isLoaded } = useBirthDate()

  if (!isLoaded) {
    return (
      <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const [name, setName] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [reading, setReading] = useState<NumerologyReading | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const handleCalculate = () => {
    if (!name.trim()) {
      alert("請輸入您的姓名 / Please enter your name")
      return
    }

    const date = new Date(birthDate)
    const result = getNumerologyReading(date, name)
    setReading(result)
    setShowResult(true)
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '總覽' },
    { id: 'lifePath', label: '生命靈數' },
    { id: 'expression', label: '表達靈數' },
    { id: 'soulUrge', label: '心靈靈數' },
    { id: 'personality', label: '人格靈數' },
    { id: 'birthday', label: '生日靈數' },
  ]

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary">生命靈數</h1>
        <p className="text-muted-foreground text-xs">Western Numerology Analysis</p>
      </motion.div>

      {!showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Name Input */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
            <label className="block text-xs font-medium text-accent mb-2">
              Your Name / 姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入姓名 (使用拼音或英文)"
              className="w-full p-3 text-sm border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-2">
              請使用拼音或英文姓名，例如: Zhang Wei 或 John Smith
            </p>
          </div>

          {/* Birth Date */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
            <label className="block text-xs font-medium text-accent mb-2">
              Birth Date / 出生日期
            </label>
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
              className="w-full p-3 text-sm border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-muted"
            />
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-primary/10 to-water/10 rounded-xl p-4 border border-primary/20">
            <h3 className="font-medium text-accent mb-2">生命靈數是什麼？</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              生命靈數源自西方數秘術，透過出生日期和姓名計算出專屬於你的數字能量。
              不同的數字代表不同的性格特質、人生課題和命運走向。
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/50 rounded-lg p-2">
                <span className="text-primary font-medium">生命靈數</span>
                <p className="text-muted-foreground">從出生日期計算，代表人生課題</p>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <span className="text-primary font-medium">表達靈數</span>
                <p className="text-muted-foreground">從姓名計算，代表天賦才能</p>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <span className="text-primary font-medium">心靈靈數</span>
                <p className="text-muted-foreground">從姓名母音計算，代表內心渴望</p>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <span className="text-primary font-medium">人格靈數</span>
                <p className="text-muted-foreground">從姓名子音計算，代表外在表現</p>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            disabled={!name.trim()}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            開始分析 / Calculate
          </motion.button>
        </motion.div>
      )}

      {showResult && reading && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-secondary overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-accent hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <NumberCard
                    title="生命靈數"
                    subtitle="Life Path"
                    number={reading.lifePath.number}
                    onClick={() => setActiveTab('lifePath')}
                  />
                  <NumberCard
                    title="表達靈數"
                    subtitle="Expression"
                    number={reading.expression.number}
                    onClick={() => setActiveTab('expression')}
                  />
                  <NumberCard
                    title="心靈靈數"
                    subtitle="Soul Urge"
                    number={reading.soulUrge.number}
                    onClick={() => setActiveTab('soulUrge')}
                  />
                  <NumberCard
                    title="人格靈數"
                    subtitle="Personality"
                    number={reading.personality.number}
                    onClick={() => setActiveTab('personality')}
                  />
                </div>

                {/* Birthday Number */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-secondary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-accent">生日靈數</h3>
                      <p className="text-xs text-muted-foreground">Birthday Number</p>
                    </div>
                    <NumberDisplay number={reading.birthday.number} size="small" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {reading.birthday.meaning}
                  </p>
                </div>

                {/* Life Path Summary */}
                <div className="bg-gradient-to-br from-primary/90 to-water/80 rounded-xl p-5 text-white">
                  <p className="text-white/70 text-sm mb-2">生命靈數 / Life Path Number</p>
                  <div className="flex items-center gap-4">
                    <NumberDisplay number={reading.lifePath.number} size="normal" />
                    <div>
                      <p className="text-xl font-serif">{NUMEROLOGY_MEANINGS[reading.lifePath.number]?.chinese}</p>
                      <p className="text-white/70 text-sm">{NUMEROLOGY_MEANINGS[reading.lifePath.number]?.name}</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mt-4 leading-relaxed">
                    {NUMEROLOGY_MEANINGS[reading.lifePath.number]?.personality.slice(0, 100)}...
                  </p>
                </div>

                {/* Quick Advice */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary">
                  <h3 className="font-serif text-lg text-accent mb-3">核心訊息</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    你的生命靈數是 <span className="text-primary font-medium">{reading.lifePath.number}</span> ({NUMEROLOGY_MEANINGS[reading.lifePath.number]?.chinese})，
                    這代表著你的人生課題和成長方向。點擊上方不同類別了解更詳細的分析。
                  </p>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-800 text-sm">
                      <span className="font-medium">今日建議：</span>
                      {NUMEROLOGY_MEANINGS[reading.lifePath.number]?.advice}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LIFE PATH TAB */}
            {activeTab === 'lifePath' && reading && (
              <DetailCard
                title={NUMEROLOGY_MEANINGS[reading.lifePath.number]?.name || 'Life Path'}
                subtitle="生命靈數 - 代表你的人生課題與成長方向"
                number={reading.lifePath.number}
                data={reading.lifePath}
              />
            )}

            {/* EXPRESSION TAB */}
            {activeTab === 'expression' && reading && (
              <DetailCard
                title={NUMEROLOGY_MEANINGS[reading.expression.number]?.name || 'Expression'}
                subtitle="表達靈數 - 代表你的天賦才能與表達方式"
                number={reading.expression.number}
                data={reading.expression}
              />
            )}

            {/* SOUL URGE TAB */}
            {activeTab === 'soulUrge' && reading && (
              <DetailCard
                title={NUMEROLOGY_MEANINGS[reading.soulUrge.number]?.name || 'Soul Urge'}
                subtitle="心靈靈數 - 代表你內心深處的渴望"
                number={reading.soulUrge.number}
                data={reading.soulUrge}
              />
            )}

            {/* PERSONALITY TAB */}
            {activeTab === 'personality' && reading && (
              <DetailCard
                title={NUMEROLOGY_MEANINGS[reading.personality.number]?.name || 'Personality'}
                subtitle="人格靈數 - 代表你給他人的外在印象"
                number={reading.personality.number}
                data={reading.personality}
              />
            )}

            {/* BIRTHDAY TAB */}
            {activeTab === 'birthday' && reading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <NumberDisplay number={reading.birthday.number} size="large" />
                  </div>
                  <h2 className="font-serif text-2xl text-primary">生日靈數</h2>
                  <p className="text-muted-foreground">Birthday Number</p>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm border border-secondary">
                  <h3 className="font-serif text-lg text-accent mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    數字含義
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reading.birthday.meaning}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-water/10 rounded-xl p-5 border border-primary/20">
                  <h3 className="font-serif text-lg text-accent mb-3">生日靈數的意義</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    生日靈數是出生日期中的「日」數位，代表你與生俱來的天賦特質。
                    這個數字揭示了你來到這個世界時所攜帶的禮物，
                    是不受其他因素影響的純粹能量。
                  </p>
                </div>
              </motion.div>
            )}

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowResult(false)}
              className="w-full py-4 bg-secondary text-accent rounded-xl font-medium"
            >
              重新分析 / Try Again
            </motion.button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}

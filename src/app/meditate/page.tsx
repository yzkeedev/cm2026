"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const BREATHING_GUIDE = [
  { text: "吸气", duration: 4, color: "water" },
  { text: "屏息", duration: 4, color: "primary" },
  { text: "呼气", duration: 4, color: "water" },
  { text: "放松", duration: 4, color: "secondary" },
]

const SCRIPTURES = [
  { title: "心经", content: "观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。舍利子，色不异空，空不异色，色即是空，空即是色，受想行识，亦复如是。" },
  { title: "道德经", content: "道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。故常无欲，以观其妙；常有欲，以观其徼。此两者同出而异名，同谓之玄，玄之又玄，众妙之门。" },
  { title: "清静经", content: "大道无形，生育天地；大道无情，运行日月；大道无名，长养万物。吾不知其名，强名曰道。夫道者，有清有浊，有动有静。" },
]

export default function MeditatePage() {
  const [isMeditating, setIsMeditating] = useState(false)
  const [breathPhase, setBreathPhase] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5分钟
  const [selectedScripture, setSelectedScripture] = useState<typeof SCRIPTURES[0] | null>(null)
  const [isBreathingIn, setIsBreathingIn] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 呼吸引导
  useEffect(() => {
    if (isMeditating) {
      const interval = setInterval(() => {
        setBreathPhase(prev => (prev + 1) % 4)
        const phase = (breathPhase + 1) % 4
        setIsBreathingIn(phase === 0)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isMeditating, breathPhase, isMeditating])

  // 计时器
  useEffect(() => {
    if (isMeditating && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsMeditating(false)
      // 结束时振动提醒
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isMeditating, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startMeditation = () => {
    setIsMeditating(true)
    setTimeLeft(300)
    setBreathPhase(0)
    // 开始时振动
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const stopMeditation = () => {
    setIsMeditating(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">静心打坐</h1>
        <p className="text-muted-foreground text-sm">2026火年宜静心养性</p>
      </motion.div>

      {/* 静心模式 - 呼吸 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-5 mb-3 shadow-sm border border-secondary text-center"
      >
        <h2 className="font-serif text-lg text-accent mb-4">呼吸引导</h2>

        <div className="flex justify-center mb-6">
          <motion.div
            animate={isMeditating ? {
              scale: isBreathingIn ? 1.3 : 1,
              opacity: isBreathingIn ? 0.8 : 1,
            } : {}}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-water to-primary flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
              {isMeditating ? (
                <motion.span
                  key={breathPhase}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-serif text-xl text-white"
                >
                  {BREATHING_GUIDE[breathPhase].text}
                </motion.span>
              ) : (
                <span className="text-white/60 text-sm">点击开始</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* 计时器 */}
        <p className="font-mono text-4xl text-primary mb-4">{formatTime(timeLeft)}</p>

        {/* 控制按钮 */}
        {!isMeditating ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startMeditation}
            className="px-8 py-3 bg-primary text-white rounded-xl font-medium shadow-md"
          >
            开始打坐
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={stopMeditation}
            className="px-8 py-3 bg-secondary text-accent rounded-xl font-medium"
          >
            结束
          </motion.button>
        )}
      </motion.div>

      {/* 抄经区 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-secondary"
      >
        <h2 className="font-serif text-lg text-accent mb-4 flex items-center gap-2">
          <span>📜</span> 静心抄经
        </h2>

        <div className="space-y-3">
          {SCRIPTURES.map((item, i) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedScripture(item)}
              className="w-full p-4 bg-muted rounded-xl text-left hover:bg-secondary/50 transition-colors"
            >
              <p className="font-medium text-accent">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 经文弹窗 */}
      <AnimatePresence>
        {selectedScripture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedScripture(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-serif text-2xl text-primary mb-4 text-center">
                {selectedScripture.title}
              </h3>
              <div className="bg-muted rounded-xl p-4">
                <p className="font-serif text-accent leading-loose text-sm">
                  {selectedScripture.content}
                </p>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">
                建议抄写此经文三遍，可静心养性
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedScripture(null)}
                className="w-full mt-3 py-3 bg-secondary text-accent rounded-lg font-medium"
              >
                关闭
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 静心提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-water/20 border border-water/40 rounded-xl p-4 mb-3"
      >
        <h3 className="font-medium text-accent mb-2">🧘 静心建议</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 2026年火年，心火旺盛，宜每日静坐10-30分钟</li>
          <li>• 打坐时保持背部挺直，双腿自然放松</li>
          <li>• 意念集中于呼吸，排除杂念</li>
          <li>• 可配合抄经一同进行，效果更佳</li>
        </ul>
      </motion.div>
    </div>
  )
}

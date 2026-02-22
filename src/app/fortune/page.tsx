"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { drawFortune } from "@/lib/bazi"

export default function FortunePage() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [fortune, setFortune] = useState<{ number: number; title: string; content: string; advice: string } | null>(null)
  const [shakeCount, setShakeCount] = useState(0)
  const shakeContainerRef = useRef<HTMLDivElement>(null)

  // 振动API
  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 100])
    }
  }

  const handleDraw = async () => {
    if (isDrawing) return

    setIsDrawing(true)
    setFortune(null)

    // 摇晃动画
    const shakeInterval = setInterval(() => {
      setShakeCount(prev => prev + 1)
      triggerVibration()
    }, 150)

    // 摇晃3秒后出结果
    setTimeout(async () => {
      clearInterval(shakeInterval)

      // 最后的强振动
      if (navigator.vibrate) {
        navigator.vibrate(200)
      }

      // 延迟一点显示结果
      await new Promise(resolve => setTimeout(resolve, 300))
      setFortune(drawFortune())
      setIsDrawing(false)
    }, 3000)
  }

  // 签筒摇晃动画
  const shakeAnimation = {
    rotate: [0, -15, 15, -10, 10, -5, 5, 0],
    transition: { duration: 0.15, repeat: shakeCount < 20 ? Infinity : 0 }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">求签问卜</h1>
        <p className="text-muted-foreground text-sm">心诚则灵，摇动签筒</p>
      </motion.div>

      {/* 签筒 */}
      <div className="flex justify-center mb-6">
        <motion.div
          ref={shakeContainerRef}
          animate={isDrawing ? shakeAnimation : {}}
          className="relative cursor-pointer"
          onClick={handleDraw}
        >
          {/* 签筒主体 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="w-32 h-48 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-3xl rounded-b-lg relative shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #B8860B 0%, #8B6914 50%, #654321 100%)',
            }}
          >
            {/* 签筒顶部装饰 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />

            {/* 签孔 */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-amber-950 rounded-full" />

            {/* 签 */}
            <AnimatePresence>
              {isDrawing && shakeCount > 5 && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -100, opacity: 0 }}
                      animate={{
                        y: [-80, -60, -80],
                        opacity: [0, 1, 1, 0],
                        x: Math.sin(i) * 10,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="absolute left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-amber-100 to-amber-300 rounded-t-sm"
                      style={{ top: '20%' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* 签筒底部 */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-amber-800 rounded-full" />
          </motion.div>

          {/* 底座 */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-40 h-4 bg-amber-950 rounded-full" />
        </motion.div>
      </div>

      {/* 提示文字 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-muted-foreground text-sm mb-6"
      >
        {isDrawing ? '诚心摇动中...' : '点击签筒开始求签'}
      </motion.p>

      {/* 结果展示 */}
      <AnimatePresence>
        {fortune && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="bg-white rounded-xl p-5 shadow-md border border-primary/20"
          >
            {/* 签号 */}
            <div className="text-center mb-4">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-block px-6 py-2 bg-gradient-to-r from-primary to-water rounded-full text-white font-bold"
              >
                第{fortune.number}签
              </motion.span>
            </div>

            {/* 签运 */}
            <div className="text-center mb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`font-serif text-3xl mb-2 ${
                  fortune.title.includes('上上') ? 'text-yellow-500' :
                  fortune.title.includes('上') ? 'text-primary' :
                  fortune.title.includes('下') ? 'text-fire' : 'text-muted-foreground'
                }`}
              >
                {fortune.title}
              </motion.h2>
            </div>

            {/* 签文 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-muted rounded-lg p-4 mb-3"
            >
              <p className="text-center font-serif text-lg text-accent leading-relaxed">
                {fortune.content}
              </p>
            </motion.div>

            {/* 解签 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">解签</p>
              <p className="text-accent">{fortune.advice}</p>
            </motion.div>

            {/* 重新抽签 */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDraw}
              className="w-full mt-4 py-3 bg-secondary text-accent rounded-lg font-medium"
            >
              再抽一次
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 抽签按钮 (无结果时) */}
      {!fortune && !isDrawing && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDraw}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium shadow-md"
        >
          开始摇签
        </motion.button>
      )}
    </div>
  )
}

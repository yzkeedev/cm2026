"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCurrentDayGanzhi, getLuckyColors, getLuckyDirection, getBazi } from "@/lib/bazi"

const COLOR_SWATCHES: Record<string, string> = {
  '青色': '#00A86B',
  '绿色': '#228B22',
  '蓝色': '#1E90FF',
  '黑色': '#1C1C1C',
  '红色': '#DC143C',
  '紫色': '#8B008B',
  '白色': '#FFFFFF',
  '银色': '#C0C0C0',
  '黄色': '#FFD700',
  '棕色': '#8B4513',
  '金色': '#FFD700',
  '灰色': '#808080',
}

export default function WuxingPage() {
  const [todayGanzhi, setTodayGanzhi] = useState<{ stem: string; branch: string; full: string } | null>(null)
  const [luckyColors, setLuckyColors] = useState<string[]>([])
  const [luckyDirection, setLuckyDirection] = useState("")

  useEffect(() => {
    const ganzhi = getCurrentDayGanzhi()
    setTodayGanzhi(ganzhi)
    setLuckyColors(getLuckyColors(ganzhi.stem))
    setLuckyDirection(getLuckyDirection(ganzhi.stem))
  }, [])

  return (
    <div className="min-h-screen pb-20 md:pb-4 pt-2 px-3 md:px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">五行穿搭</h1>
        <p className="text-muted-foreground text-sm">今日幸运色与方位指南</p>
      </motion.div>

      {/* 今日干支 */}
      {todayGanzhi && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-5 text-white mb-4 shadow-md text-center"
        >
          <p className="text-white/80 text-sm mb-1">今日干支 · {todayGanzhi.full}</p>
          <p className="text-white/60 text-xs">天干五行为您定制穿搭建议</p>
        </motion.div>
      )}

      {/* 幸运色 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-secondary"
      >
        <h2 className="font-serif text-lg text-accent mb-4 flex items-center gap-2">
          <span>🎨</span> 今日幸运色
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {luckyColors.map((color, i) => (
            <motion.div
              key={color}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div
                className="w-16 h-16 mx-auto rounded-xl shadow-md border-2 border-white"
                style={{
                  backgroundColor: COLOR_SWATCHES[color] || '#ccc',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              />
              <p className="mt-2 text-sm font-medium text-accent">{color}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 幸运方位 */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-secondary"
      >
        <h2 className="font-serif text-lg text-accent mb-4 flex items-center gap-2">
          <span>🧭</span> 幸运方位
        </h2>
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative w-40 h-40"
          >
            {/* 八卦图简化版 */}
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />
            <div className="absolute inset-4 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-serif text-5xl text-primary"
              >
                {luckyDirection}
              </motion.span>
            </div>
            {/* 方位标记 */}
            {['东', '南', '西', '北'].map((dir, i) => (
              <div
                key={dir}
                className="absolute text-xs text-muted-foreground"
                style={{
                  top: i < 2 ? '10%' : '80%',
                  left: i === 0 || i === 3 ? '50%' : 'auto',
                  right: i === 1 || i === 2 ? '50%' : 'auto',
                  transform: 'translateX(-50%)',
                }}
              >
                {dir}
              </div>
            ))}
          </motion.div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          面向{luckyDirection}方位可吸纳今日气场
        </p>
      </motion.div>

      {/* 穿搭建议 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-secondary"
      >
        <h2 className="font-serif text-lg text-accent mb-4 flex items-center gap-2">
          <span>👔</span> 穿搭建议
        </h2>
        <div className="space-y-3">
          {[
            { title: '上衣', suggestion: `推荐${luckyColors[0]}或${luckyColors[1]}色系上衣` },
            { title: '配饰', suggestion: '金属或玉石饰品有助于提升运势' },
            { title: '鞋履', suggestion: luckyColors.includes('白色') ? '白色鞋子最佳' : '与幸运色呼应' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-3 bg-muted rounded-xl"
            >
              <p className="text-sm font-medium text-accent">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.suggestion}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 2026火年提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-water/20 border border-water/40 rounded-xl p-4 mb-3"
      >
        <h3 className="font-medium text-accent mb-2">🔥 2026火年提示</h3>
        <p className="text-sm text-muted-foreground">
          今年为丙午火年，宜多用水色系物品调和。可佩戴蓝色、黑色饰品，多喝水，室内可放置水培植物。
        </p>
      </motion.div>
    </div>
  )
}

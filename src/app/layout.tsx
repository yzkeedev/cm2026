import type { Metadata } from "next"
import { DM_Mono } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "赤马年运程 - 2026每日运程查询",
  description: "2026年丙午年每日运程查询、八字排盘、AI智能解读、五行穿搭建议",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen ink-wash-bg font-sans">
        <div className="chinese-pattern fixed inset-0 pointer-events-none z-0" />
        <div className="relative z-10">
          {children}
          <Navigation />
        </div>
      </body>
    </html>
  )
}

"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface BirthDateContextType {
  birthDate: string
  setBirthDate: (date: string) => void
  timeBranch: string
  setTimeBranch: (branch: string) => void
  gender: string
  setGender: (gender: string) => void
  isLoaded: boolean
}

const BirthDateContext = createContext<BirthDateContextType | undefined>(undefined)

const STORAGE_KEY = "global-birth-date"

export function BirthDateProvider({ children }: { children: ReactNode }) {
  const [birthDate, setBirthDateState] = useState("1990-01-01")
  const [timeBranch, setTimeBranchState] = useState("子")
  const [gender, setGenderState] = useState("男")
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const data = JSON.parse(stored)
          if (data.birthDate) setBirthDateState(data.birthDate)
          if (data.timeBranch) setTimeBranchState(data.timeBranch)
          if (data.gender) setGenderState(data.gender)
        } catch (e) {
          console.error("Failed to parse stored birth date", e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when values change
  const setBirthDate = (date: string) => {
    setBirthDateState(date)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ birthDate: date, timeBranch, gender }))
    }
  }

  const setTimeBranch = (branch: string) => {
    setTimeBranchState(branch)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ birthDate, timeBranch: branch, gender }))
    }
  }

  const setGender = (g: string) => {
    setGenderState(g)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ birthDate, timeBranch, gender: g }))
    }
  }

  return (
    <BirthDateContext.Provider
      value={{
        birthDate,
        setBirthDate,
        timeBranch,
        setTimeBranch,
        gender,
        setGender,
        isLoaded,
      }}
    >
      {children}
    </BirthDateContext.Provider>
  )
}

export function useBirthDate() {
  const context = useContext(BirthDateContext)
  if (context === undefined) {
    throw new Error("useBirthDate must be used within a BirthDateProvider")
  }
  return context
}

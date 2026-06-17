'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from './api'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  token: string | null
  isPremium: boolean
  isTrialActive: boolean
  showAds: boolean
  isAdmin: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isPremium: false,
  isTrialActive: false,
  showAds: true,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    const me = await api.auth.me()
    setUser(me)
  }

  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (saved) {
      setToken(saved)
      api.auth.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const isPremium = Boolean(user?.is_premium)
  const isTrialActive = Boolean(user?.is_trial_active)
  const isAdmin = user?.plan === 'admin'
  const showAds = !isPremium

  return (
    <AuthContext.Provider value={{ user, token, isPremium, isTrialActive, showAds, isAdmin, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

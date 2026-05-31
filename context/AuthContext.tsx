"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { AuthUser, onAuthChange, getSession } from "@/lib/supabase-browser"

type AuthContextType = {
  user:          AuthUser | null
  loading:       boolean
  openAuthModal: (mode?: "signin" | "signup") => void
  closeAuthModal: () => void
  authModalOpen: boolean
  authModalMode: "signin" | "signup"
}

const AuthContext = createContext<AuthContextType>({
  user:          null,
  loading:       true,
  openAuthModal: () => {},
  closeAuthModal:() => {},
  authModalOpen: false,
  authModalMode: "signin",
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,          setUser]          = useState<AuthUser | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin")

  useEffect(() => {
    // Try to read existing session on mount
    let didInit = false
    try {
      getSession().then(session => {
        setUser(session?.user ?? null)
        setLoading(false)
        didInit = true
      }).catch(() => {
        setLoading(false)
        didInit = true
      })
    } catch {
      setLoading(false)
      didInit = true
    }

    // Subscribe to auth state changes
    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = onAuthChange(u => {
        setUser(u)
        if (!didInit) setLoading(false)
      })
    } catch {
      // Supabase not configured — silently degrade
      setLoading(false)
    }

    return () => unsubscribe?.()
  }, [])

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  const closeAuthModal = () => setAuthModalOpen(false)

  return (
    <AuthContext.Provider value={{ user, loading, openAuthModal, closeAuthModal, authModalOpen, authModalMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

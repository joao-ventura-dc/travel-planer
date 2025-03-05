'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const auth = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(auth === 'true')
    setIsInitialized(true)

    // Redirect to login if not authenticated and not already on login page
    if (!auth && pathname !== '/login') {
      router.push('/login')
    }
  }, [pathname, router])

  const login = async () => {
    return new Promise<void>((resolve) => {
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      resolve()
    })
  }

  const logout = async () => {
    return new Promise<void>((resolve) => {
      setIsAuthenticated(false)
      localStorage.removeItem('isAuthenticated')
      router.push('/login')
      resolve()
    })
  }

  // Don't render children until we've initialized auth state
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
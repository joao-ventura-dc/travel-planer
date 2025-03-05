'use client'

import Sidebar from "./Sidebar"
import { useAuth } from "../context/AuthContext"

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className="flex h-full">
      <Sidebar />
      {/* Main Content */}
      <main className={`flex-1 ${isAuthenticated ? 'lg:pl-64' : ''}`}>
        {/* Mobile-friendly padding wrapper */}
        <div className="pt-20 px-4 lg:pt-6 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  )
} 
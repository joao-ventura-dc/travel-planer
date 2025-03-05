'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

const menuItems = [
  { 
    href: "/", 
    icon: (
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22v-10h6v10"/>
    ), 
    label: "Properties",
    color: "from-violet-500 to-indigo-500"
  },
  { 
    href: "/favorites", 
    icon: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    ), 
    label: "Favorites",
    color: "from-pink-500 to-rose-500"
  },
  { 
    href: "/votes", 
    icon: (
      <g>
        <path d="m9 12 2 2 4-4"/>
        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
        <path d="M22 19H2"/>
      </g>
    ), 
    label: "Votes",
    color: "from-sky-500 to-blue-500"
  }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't show sidebar if not authenticated or on login page
  if (!isAuthenticated || pathname === '/login') {
    return null
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-lg border"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12"/>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              )}
            </svg>
          </motion.div>
        </motion.button>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: (!isOpen && isMobile) ? -320 : 0,
          width: isMobile ? 320 : 256
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="fixed top-0 left-0 bottom-0 bg-card/95 backdrop-blur-sm border-r z-50"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <motion.div 
            className="h-16 flex items-center px-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/" 
              className="flex items-center gap-3 text-lg font-medium hover:opacity-80 transition-opacity"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                ✈️
              </motion.span>
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-semibold">
                Travel Planner
              </span>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            <motion.div 
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {menuItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${pathname === item.href 
                        ? 'text-white shadow-lg' 
                        : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
                      }
                      group
                    `}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {pathname === item.href && (
                      <motion.div
                        layoutId="active-pill"
                        className={`absolute inset-0 rounded-lg bg-gradient-to-r ${item.color}`}
                        initial={false}
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={pathname === item.href ? 'text-white' : 'group-hover:text-accent'}
                      >
                        {item.icon}
                      </svg>
                    </motion.div>
                    <span className="font-medium relative">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </nav>

          {/* Settings and Logout */}
          <motion.div 
            className="p-3 border-t bg-muted/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-2">
              <Link 
                href="/settings" 
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${pathname === '/settings' 
                    ? 'text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/10'
                  }
                  group
                `}
                onClick={() => isMobile && setIsOpen(false)}
              >
                {pathname === '/settings' && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-neutral-500 to-stone-500"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </motion.div>
                <span className="font-medium relative">Settings</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                         text-muted-foreground hover:text-red-500 hover:bg-red-500/10 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </motion.div>
                <span className="font-medium relative">Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
} 
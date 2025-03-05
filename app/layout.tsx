import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import RootLayoutContent from "./components/RootLayoutContent"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Planner | Group Trip Planning Made Easy",
  description: "Plan your perfect group trip with our easy-to-use travel planner. Compare properties, track votes, and make decisions together.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}


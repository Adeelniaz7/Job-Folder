'use client'
import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function PageTransitionLoader() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  // Hide loader when navigation is complete (indicated by path/search param changes)
  useEffect(() => {
    setLoading(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const handleLinkClick = (e) => {
      // Find the nearest anchor element
      const target = e.target.closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (!href) return

      // Skip external links, hashes, mailto, tel, blank targets
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank'
      ) {
        return
      }

      // Check if it's the current path (to avoid spinner triggering on same-page hash links)
      const targetPath = href.split('?')[0].split('#')[0]
      const currentPath = window.location.pathname
      if (targetPath === currentPath) {
        return
      }

      // Trigger the loader
      setLoading(true)
    }

    document.addEventListener('click', handleLinkClick)
    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-xl shadow-2xl max-w-xs w-full text-center">
        <div className="relative flex items-center justify-center">
          {/* Inner pulsating glow */}
          <div className="absolute h-10 w-10 rounded-full bg-indigo-500/30 blur-md animate-pulse"></div>
          {/* Outer spinner */}
          <svg className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <div className="space-y-1">
          <span className="text-slate-900 dark:text-white text-base font-bold tracking-wide">Loading Page</span>
          <p className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">Please wait a moment...</p>
        </div>
      </div>
    </div>
  )
}

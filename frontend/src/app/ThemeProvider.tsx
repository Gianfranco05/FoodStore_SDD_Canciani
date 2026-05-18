import { useEffect } from 'react'
import { useUIStore } from '../stores/uiStore'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  // Initialize: read stored/system preference on mount
  useEffect(() => {
    const initial = getInitialTheme()
    setTheme(initial)
  }, [setTheme])

  // Sync theme → DOM + localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)

    // Update meta theme-color for browser chrome
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute(
        'content',
        theme === 'dark' ? '#1a2a1f' : '#ffffff'
      )
    }
  }, [theme])

  // Listen for system preference changes (only when no explicit stored preference)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme')
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setTheme])

  return <>{children}</>
}

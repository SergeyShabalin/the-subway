import { type ReactNode, useLayoutEffect } from 'react'
import { useLocalStorage } from '../hooks/use-local-storage.ts'
import { THEME_VALUE } from '@components/theme-toggle/const.ts'
import type {
  IThemeContextType,
  TTheme,
} from '@components/theme-toggle/types.ts'
import { ThemeContext } from '@/context/theme-context.ts'

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useLocalStorage<TTheme>('theme', THEME_VALUE.DARK)

  useLayoutEffect(() => {
    if (theme === THEME_VALUE.DARK) {
      document.documentElement.classList.add(THEME_VALUE.DARK)
    } else document.documentElement.classList.remove(THEME_VALUE.DARK)
  }, [theme])

  const contextValue: IThemeContextType = {
    theme,
    setTheme: (newTheme: TTheme) => setTheme(newTheme),
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }

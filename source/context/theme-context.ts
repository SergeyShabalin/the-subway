import { createContext } from 'react'
import type { IThemeContextType } from '@components/theme-toggle/types.ts'
import { THEME_VALUE } from '@components/theme-toggle/const.ts'

// Дефолтные значения
const defaultThemeContext: IThemeContextType = {
  theme: THEME_VALUE.DARK,
  setTheme: () => {
    console.warn('ThemeProvider not found')
  },
}

// Создаем и экспортируем контекст
export const ThemeContext =
  createContext<IThemeContextType>(defaultThemeContext)

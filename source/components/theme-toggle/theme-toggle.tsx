import React, { useContext } from 'react'
import styles from './theme-toggle.module.css'
import { MoonIcon } from '@assets/theme-icons/moon-icon.tsx'
import { SunIcon } from '@assets/theme-icons/sun-icon.tsx'

import { THEME_VALUE } from '@components/theme-toggle/const.ts'
import { ThemeContext } from 'source/context'

const ThemeToggle: React.FC = () => {
  const themeContext = useContext(ThemeContext)

  // Проверяем, что контекст существует
  if (!themeContext) {
    throw new Error('ThemeToggle must be used within a ThemeProvider')
  }

  const { theme, setTheme } = themeContext

  const changeTheme = () => {
    setTheme(theme === THEME_VALUE.LIGHT ? THEME_VALUE.DARK : THEME_VALUE.LIGHT)
  }

  return (
    <div className={styles.container}>
      <label htmlFor="themeSwitch" className={styles.toggle}>
        <input
          type="checkbox"
          className={styles.input}
          id="themeSwitch"
          checked={theme === THEME_VALUE.LIGHT}
          onChange={changeTheme}
        />

        {/* Обе иконки должны быть всегда в DOM для CSS анимаций */}
        <div className={`${styles.icon} ${styles.iconMoon}`}>
          <MoonIcon />
        </div>
        <div className={`${styles.icon} ${styles.iconSun}`}>
          <SunIcon />
        </div>
      </label>
    </div>
  )
}

export { ThemeToggle }

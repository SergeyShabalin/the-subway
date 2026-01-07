import { createSlice } from '@reduxjs/toolkit'

interface ThemeState {
  isDark: boolean
}

// Функция должна быть ВНЕ слайса
const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return true
  const saved = localStorage.getItem('metro-theme')
  return saved ? JSON.parse(saved) : true
}

const initialState: ThemeState = {
  isDark: getInitialTheme() // Инициализируем сразу правильным значением
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark
    },
    setTheme: (state, action: { payload: boolean }) => {
      state.isDark = action.payload
    }
  }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
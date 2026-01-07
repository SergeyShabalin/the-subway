
import { useSelector, useDispatch } from 'react-redux'
import type { AppDispatch, RootState } from '@/store'
import { setTheme, toggleTheme } from '../slices/theme-slice/theme-slice.ts'


export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isDark = useSelector((state: RootState) => state.theme.isDark)

  return {
    isDark,
    toggle: () => dispatch(toggleTheme()),
    setTheme: (dark: boolean) => dispatch(setTheme(dark))
  }
}
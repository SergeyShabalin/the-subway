import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/theme-slice/theme-slice.ts'
import metroReducer from './slices/metro-slices/metro-slices.ts'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    metro: metroReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

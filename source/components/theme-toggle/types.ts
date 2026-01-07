export type TTheme = 'light' | 'dark'

export interface IThemeContextType {
  theme: TTheme
  setTheme: (theme: TTheme) => void
}
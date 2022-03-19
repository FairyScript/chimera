import React from 'react'
import defaultTheme, { Theme, ThemeColors } from '.'

/**
 * API:
 *
 * You can create custom themes using Object.assign:
 *
 *
 * Pass that theme to the theme provider. A theme should always
 * provide a dark and light color mode.
 *
 * <ThemeProvider theme={customTheme}><App /></ThemeProvider>
 *
 *
 * When you want to use a dark mode:
 *
 * function App () {
 *  return <Dark><SomeContent /></Dark>
 * }
 *
 *
 * To consume a theme, use `useTheme` hook
 *
 * const theme = useTheme()
 * // theme.colors.text.default (will be dark or light depending on the mode)
 * // theme.colors.mode === 'dark' or 'light'
 */

const ThemeContext = React.createContext(defaultTheme)

/**
 * Provide a theme to your app using React Context
 */

export interface ThemeProviderProps {
  children: React.ReactNode
  theme?: Theme
}

export const ThemeProvider = ({
  theme = defaultTheme,
  children,
}: ThemeProviderProps) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

/**
 * A hook for consuming the theme
 */

export function useTheme() {
  return React.useContext(ThemeContext)
}

/**
 * Switch color modes (typically between light (default) and dark)
 */

type RenderCallbackType = (theme: Theme) => React.ReactNode

export interface ColorModeProps {
  colors: ThemeColors
  children: RenderCallbackType | React.ReactNode
  ref: React.Ref<any>
}

import { Theme as DefaultTheme } from '../Theme'

declare module '@emotion/react' {
  interface Theme extends DefaultTheme {}
}

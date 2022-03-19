import styled from '@emotion/styled'
import { Box } from './FlexBox'

export type BoxElevations = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** The size of the shadow to use */
  elevation?: BoxElevations
  /** The contents of the layer */
  children: React.ReactNode
}

export const Card = styled(Box)<CardProps>`
  padding: 0.5rem;
  position: relative;
  background: ${({ theme }) => theme.colors.background.layer};
  box-shadow: ${({ theme, elevation = 'md' }) => theme.shadows[elevation]};
  border-radius: ${({ theme }) => theme.radii.sm};
`

//https://github.com/rebassjs/rebass/blob/master/packages/reflexbox/src/index.js

import styled from '@emotion/styled'

interface BoxProps {
  width?: number
}

export const Box = styled.div<BoxProps>`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  width: ${props =>
    props.width !== undefined ? props.width * 100 + '%' : 'auto'};
`

interface FlexProps {
  column?: boolean
}

export const Flex = styled(Box)<FlexProps>`
  display: flex;
  flex-direction: ${props => (props.column ? 'column' : 'row')};
`

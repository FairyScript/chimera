//https://github.com/bmcmahen/sancho/blob/master/src/Embed.tsx

import { css } from '@emotion/react'

export interface EmbedProps extends React.HTMLAttributes<Element> {
  /** The relative width of the embed container */
  width: number
  /** The relative height of the embed container */
  height: number
}

export function getEmbedStyles(width: number, height: number) {
  const percentage = (height / width) * 100
  return css`
    position: relative;
    display: block;
    width: 100%;
    padding: 0;
    & > * {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    ::before {
      display: block;
      content: '';
      padding-top: ${percentage}%;
    }
  `
}

/**
 * The Embed component maintains the provided aspect ratio determined
 * by the width and height props. It's useful for avoiding content shifting on image
 * loading.
 */

export const Embed: React.FC<EmbedProps> = ({
  width = 4,
  height = 3,
  ...other
}) => {
  return <div css={getEmbedStyles(width, height)} {...other} />
}

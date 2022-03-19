import { animated, useSpring } from '@react-spring/web'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useMeasure } from './Hooks/use-measure'
import { useUid } from './Hooks/use-uid'

export function useCollapse(defaultShow: boolean = false) {
  const [show, setShow] = useState(defaultShow)
  const id = useUid()

  function onClick() {
    setShow(!show)
  }

  return {
    show,
    id,
    buttonProps: {
      onClick,
      'aria-controls': id,
      'aria-expanded': show ? true : false,
    },
    collapseProps: {
      id,
      show,
    },
  }
}

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A unique id required for accessibility purposes. */
  id: string
  /** Controls whether the children should be visible */
  show: boolean
  /** Any element that you want to reveal */
  children: React.ReactNode
}

/**
 * Hide and reveal content with an animation. Supports dynamic
 * heights.
 */
export const Collapse: React.FunctionComponent<CollapseProps> = ({
  children,
  id,
  show,
  ...other
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const { bounds } = useMeasure(ref)
  const prevShow = usePrevious(show)

  const { height } = useSpring({
    from: { height: 0 },
    to: { height: show ? bounds.height : 0 },
    immediate: prevShow !== null && prevShow === show,
  }) as any

  return (
    <animated.div
      id={id}
      css={{
        overflow: 'hidden',
        willChange: 'height, opacity',
      }}
      style={{ height } as any}
      {...other}
    >
      <div ref={ref}>{children}</div>
    </animated.div>
  )
}

Collapse.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

import { Text } from './Text'
import { CloseButton } from './IconButton'
import { useTransition, animated } from '@react-spring/web'
import { Overlay } from './Overlay'
import { useFocusElement } from './Hooks/use-focus-trap'
import PropTypes from 'prop-types'
import useScrollLock from './Lib/use-scroll-lock'
import { useTheme } from './Theme/Providers'
import {
  HTMLAttributes,
  ReactNode,
  FunctionComponent,
  useRef,
  Fragment,
} from 'react'

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the dialog is showing */
  isOpen: boolean
  /** An optional title. If set, a header will be added to your dialog. */
  title?: string
  /** Fill the entire screen on mobile devices */
  mobileFullscreen?: boolean
  /** A callback for closing the dialog. */
  onRequestClose: () => void
  /** The contents of the dialog */
  children: ReactNode
}

/**
 * A dialog is useful for displaying infomation that
 * commands the user's attention.
 */

export const Dialog: FunctionComponent<DialogProps> = ({
  isOpen,
  onRequestClose,
  mobileFullscreen,
  title,
  children,
  ...other
}) => {
  const theme = useTheme()
  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: { mass: 1, tension: 185, friction: 26 },
  })

  const scrollableRef = useRef(null)
  const ref = useRef<HTMLDivElement | null>(null)

  useFocusElement(ref, isOpen)
  useScrollLock(isOpen, scrollableRef)

  return (
    <Fragment>
      <Overlay onRequestClose={onRequestClose} isOpen={isOpen}>
        <Fragment>
          {transitions(
            (animationProps, item) =>
              item && (
                <animated.div
                  className="Dialog"
                  aria-modal="true"
                  ref={ref}
                  tabIndex={-1}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                  style={
                    {
                      opacity: animationProps.opacity,
                      transform: animationProps.transform,
                    } as any
                  }
                  css={[
                    {
                      zIndex: theme.zIndices.modal,
                      background: theme.colors.background.default,
                      boxShadow: theme.shadows.md,
                      borderRadius: theme.radii.lg,
                      margin: '16px',
                      width: 'calc(100% - 32px)',
                      outline: 'none',
                      [theme.mediaQueries.sm]: {
                        maxWidth: '500px',
                        margin: '30px auto',
                      },
                      [theme.mediaQueries.lg]: {
                        maxWidth: '650px',
                        margin: '30px auto',
                      },
                    },
                    mobileFullscreen && {
                      maxWidth: 'none',
                      margin: 0,
                      width: '100vw',
                      height: '100vh',
                      borderRadius: 0,
                      boxShadow: 'none',
                      [theme.mediaQueries.sm]: {
                        maxWidth: 'none',
                        margin: '0',
                      },
                      [theme.mediaQueries.md]: {
                        maxWidth: '500px',
                        margin: '30px auto',
                        height: 'auto',
                        boxShadow: theme.shadows.md,
                        borderRadius: theme.radii.lg,
                        width: 'calc(100% - 32px)',
                      },
                    },
                  ]}
                  {...other}
                >
                  <Fragment>
                    {title && (
                      <DialogHeader
                        className="Dialog__header"
                        css={{
                          display: 'flex',
                          justifyContent: 'space-between',

                          alignItems: 'center',
                          padding: `${theme.spaces.lg} ${theme.spaces.lg} 0 ${theme.spaces.lg}`,
                        }}
                        title={title}
                        onRequestClose={onRequestClose}
                      />
                    )}
                    <div ref={scrollableRef}>{children}</div>
                  </Fragment>
                </animated.div>
              )
          )}
        </Fragment>
      </Overlay>
    </Fragment>
  )
}

Dialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  mobileFullscreen: PropTypes.bool,
  children: PropTypes.node,
}

interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** The title of the header */
  title: string
  /** An optional callback for closing the dialog. If set, a close button will be added to the header */
  onRequestClose?: () => void
}

export const DialogHeader: FunctionComponent<DialogHeaderProps> = ({
  title,
  onRequestClose,
  ...other
}) => (
  <div {...other}>
    <Text wrap={false} variant="h4">
      {title}
    </Text>
    {onRequestClose && <CloseButton onClick={onRequestClose} />}
  </div>
)

DialogHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func,
}

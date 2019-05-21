import * as React from 'react'

interface Props {
  duration: number
  onComplete?: () => void
}

function useCountdownTimer(props: Props): number {
  const [remaining, setRemaining] = React.useState<number>(props.duration)

  React.useEffect(() => {
    let interval = setInterval(() => {
      if (remaining === 0) {
        props.onComplete()
        clearInterval(interval)
      } else {
        setRemaining(remaining - 1)
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return remaining
}

export {
  useCountdownTimer,
  useCountdownTimer as default
}
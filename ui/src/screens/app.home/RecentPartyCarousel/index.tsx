import './style.css'
import * as React from 'react'
import { useState, useMemo } from 'react'

const c = {
  SLIDE_WIDTH: 316,
  SLIDE_HOVER_WIDTH: 500,
  SLIDE_NORMAL_HOVER_MULTIPLIER: 1.5822784810126582,
  SLIDE_MARGIN: 8
}

function RecentPartyCarousel() {
  const [data, setData] = useState(() => {
    return Array.from({ length: 5 }).fill(0)
  })
  const [active, setActive] = useState(-1)

  const styles = useMemo(() => {
    return data.map((_, i) => {
      const currentRow = Math.ceil((i + 1) / c.ITEMS_PER_ROW)

      if (active === -1) {
        return {
          transition: '400ms all ease',
          transform: 'translateX(0) scale(1)',
        }
      }

      const scale = c.SLIDE_HOVER_WIDTH / c.SLIDE_WIDTH
      const translate = (c.SLIDE_HOVER_WIDTH - c.SLIDE_WIDTH) / 2
      const offset = (() => {
        if (active === 0) {
          return (c.SLIDE_HOVER_WIDTH / 4) - (c.SLIDE_MARGIN * 4)
        }
        
        if (active === data.length - 1) {
          return -((c.SLIDE_HOVER_WIDTH / 4) - (c.SLIDE_MARGIN * 4))
        }
        
        return 0
      })()

      if (active === i) {
        return {
          transition: '400ms all ease',
          transform: `translateX(${offset}px) scale(${scale})`,
        }
      }

      if (i < active) {
        return {
          transition: '400ms all ease',
          transform: `translateX(-${translate - offset}px) scale(1)`,
        }
      }

      if (i > active) {
        return {
          transition: '400ms all ease',
          transform: `translateX(${translate + offset}px) scale(1)`,
        }
      }

      return {}
    })
  }, [active])

  return (
    <div className="recent-party-carousel">
      <div className="slider">
        {data.map((party, i) => (
          <div className="item" style={styles[i]} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} key={i}>
            <div className="card"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentPartyCarousel
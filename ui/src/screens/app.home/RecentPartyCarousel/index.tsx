import './style.css'
import * as React from 'react'
import { useState, useMemo, useRef } from 'react'
import { useElementSize } from '~/hooks/useElementSize'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import UiButton from '~/components/UiButton'
import UiShowCardDetailText from '~/components/UiShowCardDetailText'
import StandardAspectRatioBox from '~/components/StandardAspectRatioBox'
import parseStandardTime from '~/utils/date/parseStandardTime'

const c = {} as any
c.SLIDE_HOVER_WIDTH = 500
c.SLIDE_COUNT = 5
c.SLIDE_MARGIN = 8

function RecentPartyCarousel() {
  const [active, setActive] = useState(-1)
  const [data, setData] = useState(() => {
    return Array.from({ length: 5 }).fill({
      show: {
        title: 'One Piece',
        preview_image: 'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/yesterday/yesterday-preview-16-9.jpg',
        air_start: '2019-10-12'
      },
      video: {
        video_url:
          'https://caretv.sgp1.cdn.digitaloceanspaces.com/videos/the-possession-of-hannah-grace/the-possession-of-hannah-grace.mp4'
      },
      members: [{ id: 1, avatar: '', name: 'Kier' }]
    })
  })

  const containerRef = useRef<HTMLDivElement>()
  const { width } = useElementSize(containerRef)
  const containerWidth = width - 16
  const slideWidth = useMemo(() => containerWidth / c.SLIDE_COUNT, [containerWidth])
  const slideScale = useMemo(() => c.SLIDE_HOVER_WIDTH / slideWidth, [slideWidth])
  const slideTranslate = useMemo(() => (c.SLIDE_HOVER_WIDTH - slideWidth) / 2, [slideWidth])

  const offset = useMemo(() => {
    if (active === 0) {
      return c.SLIDE_HOVER_WIDTH / 4 - c.SLIDE_MARGIN * 4
    }

    if (active === data.length - 1) {
      return -(c.SLIDE_HOVER_WIDTH / 4 - c.SLIDE_MARGIN * 4)
    }

    return 0
  }, [active])

  const styles = useMemo(() => {
    return data.map((_, i) => {
      if (active === -1) {
        return {
          transition: '400ms all ease',
          transform: 'translateX(0) scale(1)'
        }
      }

      if (active === i) {
        return {
          transition: '400ms all ease',
          transform: `translateX(${offset}px) scale(${slideScale})`
        }
      }

      if (i < active) {
        return {
          transition: '400ms all ease',
          transform: `translateX(-${slideTranslate - offset}px) scale(1)`
        }
      }

      if (i > active) {
        return {
          transition: '400ms all ease',
          transform: `translateX(${slideTranslate + offset}px) scale(1)`
        }
      }

      return {}
    })
  }, [active])

  return (
    <div className="recent-party-carousel" ref={containerRef}>
      <div className="slider">
        {data.map((party, i) => (
          <div
            className="item"
            style={{ ...styles[i], width: slideWidth }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            key={i}>
            <StandardAspectRatioBox
              className="recent-party-carousel-card"
              style={{ backgroundImage: `url(${party.show.preview_image})` }}
              onClick={() => handleShowClick(show)}>
              <div className="overlay" />

              <div className="timestamp">
                <UiShowCardDetailText>5 Days Ago</UiShowCardDetailText>
              </div>

              <div className="memberlist">
                <UiAvatarGroup users={party.members} />
              </div>

              <div className="rejoin">
                <UiButton variant="clear-white">Rejoin Party</UiButton>
              </div>

              <div className="details">
                <UiShowCardDetailText>{parseStandardTime(party.show.air_start).getFullYear()}</UiShowCardDetailText>

                <h3 className="title">{party.show.title}</h3>
              </div>

              <div className="progresstext">
                <UiShowCardDetailText>15 of 25m</UiShowCardDetailText>
              </div>

              <div className="progress">
                <div className="bar"></div>
              </div>
            </StandardAspectRatioBox>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentPartyCarousel

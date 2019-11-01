import './style.css'
import * as React from 'react'
import { useState, useMemo, useRef } from 'react'
import { useElementSize } from '~/hooks/useElementSize'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import UiButton from '~/components/UiButton'
import UiShowCardDetailText from '~/components/UiShowCardDetailText'
import StandardAspectRatioBox from '~/components/StandardAspectRatioBox'
import parseStandardTime from '~/utils/date/parseStandardTime'
import { SLIDE_HOVER_WIDTH, SLIDE_COUNT } from './constants'
import { getOffset, getStyles } from './utils'

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
  const { width: containerWidth } = useElementSize(containerRef)
  const slideWidth = useMemo(() => containerWidth / SLIDE_COUNT, [containerWidth])
  const slideScale = useMemo(() => SLIDE_HOVER_WIDTH / slideWidth, [slideWidth])
  const slideTranslate = useMemo(() => (SLIDE_HOVER_WIDTH - slideWidth) / 2, [slideWidth])
  const offset = useMemo(() => getOffset({ active, data }), [active])
  const styles = useMemo(() => getStyles({ active, data, offset, scale: slideScale, translate: slideTranslate }), [
    active
  ])

  return (
    <div className="recent-party-carousel">
      <div className="slider" ref={containerRef}>
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

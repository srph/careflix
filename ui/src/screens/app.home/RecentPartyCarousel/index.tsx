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

interface Props {
  parties: AppParty[]
  isLoading: boolean
}

function RecentPartyCarousel(props: Props) {
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLDivElement>()
  const { width: containerWidth } = useElementSize(containerRef)
  const slideWidth = useMemo(() => containerWidth / SLIDE_COUNT, [containerWidth])
  const slideScale = useMemo(() => SLIDE_HOVER_WIDTH / slideWidth, [slideWidth])
  const slideTranslate = useMemo(() => (SLIDE_HOVER_WIDTH - slideWidth) / 2, [slideWidth])
  const offset = useMemo(() => getOffset({ active, data: props.parties }), [active])
  const styles = useMemo(
    () => getStyles({ active, data: props.parties, offset, scale: slideScale, translate: slideTranslate }),
    [active]
  )

  return (
    <div className="recent-party-carousel">
      <div className="slider" ref={containerRef}>
        {props.parties.map((party, i) => (
          <div
            className="item"
            style={{ ...styles[i], width: slideWidth }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            key={i}>
            <StandardAspectRatioBox
              className="recent-party-carousel-card"
              style={{ backgroundImage: `url(${party.video.show.preview_image})` }}
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
                <UiShowCardDetailText>
                  {parseStandardTime(party.video.show.air_start).getFullYear()}
                </UiShowCardDetailText>

                <h3 className="title">{party.video.show.title}</h3>
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

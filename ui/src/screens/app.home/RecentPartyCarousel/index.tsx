import './style.css'
import * as React from 'react'
import { useState, useMemo, useRef } from 'react'
import { useElementSize } from '~/hooks/useElementSize'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import UiButton from '~/components/UiButton'
import UiContainer from '~/components/UiContainer'
import UiShowCardDetailText from '~/components/UiShowCardDetailText'
import StandardAspectRatioBox from '~/components/StandardAspectRatioBox'
import ShowCardPlaceholder from '~/components/ShowCardPlaceholder'
import parseStandardTime from '~/utils/date/parseStandardTime'
import history from '~/lib/history'
import {
  SLIDE_HOVER_WIDTH,
  SLIDE_HOVER_WIDTH_SMALL,
  CONTAINER_MARGINS,
  SLIDE_MARGINS,
  LOADER_BLOCKS,
  SLIDE_COUNT
} from './constants'
import { getOffset, getStyles } from './utils'

interface Props {
  parties: AppParty[]
  isLoading: boolean
}

function RecentPartyCarousel(props: Props) {
  const [active, setActive] = useState(-1)
  const containerRef = useRef<HTMLDivElement>()
  const { width } = useElementSize(containerRef)
  const containerWidth = width - CONTAINER_MARGINS
  const slideWidth = useMemo(() => containerWidth / SLIDE_COUNT - SLIDE_MARGINS, [containerWidth])
  const slideHoverWidth = slideWidth >= 320 ? SLIDE_HOVER_WIDTH : SLIDE_HOVER_WIDTH_SMALL
  const slideScale = useMemo(() => slideHoverWidth / slideWidth, [slideWidth])
  const slideTranslate = useMemo(() => (slideHoverWidth - slideWidth) / 2, [slideWidth])
  const offset = useMemo(() => getOffset({ active, width: slideWidth, hoverWidth: slideHoverWidth }), [active])
  const styles = useMemo(
    () => getStyles({ active, data: props.parties, offset, scale: slideScale, translate: slideTranslate }),
    [active]
  )

  return (
    <React.Fragment>
      <UiContainer>
        <div className="recent-party-section">Recent Parties</div>
      </UiContainer>

      <div className="recent-party-carousel">
        <div className="inner" ref={containerRef}>
          {props.parties.map((party, i) => (
            <div className="item" onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(-1)} key={i}>
              <StandardAspectRatioBox
                className="recent-party-carousel-card"
                style={{ backgroundImage: `url(${party.video.show.preview_image})`, ...styles[i] }}
                onClick={() => {
                  history.push(`/watch/${party.id}`)
                }}>
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
    </React.Fragment>
  )
}

function RecentPartyCarouselWrapper(props: Props) {
  if (props.isLoading) {
    return (
      <div className="recent-party-carousel-loader">
        {LOADER_BLOCKS.map((_, i) => (
          <div className="column" key={i}>
            <ShowCardPlaceholder />
          </div>
        ))}
      </div>
    )
  }

  return <RecentPartyCarousel {...props} />
}

export default RecentPartyCarouselWrapper

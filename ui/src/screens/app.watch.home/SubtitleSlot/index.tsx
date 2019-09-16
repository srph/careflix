import './style'

import * as React from 'react'
import cx from 'classnames'
import { useState, useMemo } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import axios from '~/lib/axios'
import { placements, HAS_PLACEMENT_PATTERN } from './constants'
import { srt2obj, Track } from './utils'

interface State {
  tracks: Track[]
}

interface Props {
  video: AppShowVideo
  time: number
  isEnabled: boolean
  isPlayerOpen: boolean
}

function SubtitleSlot(props: Props) {
  const [state, setState] = useState<State>(() => ({ tracks: [] }))

  useAsyncEffect(
    async () => {
      if (!props.video.subtitle_url) {
        return
      }

      const [err, res] = await axios.get(`api/videos/${props.video.id}/subtitle`, {
        validation: false
      })

      if (err != null) {
        return //
      }

      setState({
        tracks: srt2obj(res.data.subtitle)
      })
    },
    null,
    []
  )

  if (!props.video.subtitle_url) {
    return null
  }

  if (!state.tracks.length) {
    return null
  }

  if (!props.isEnabled) {
    return null
  }

  const subtitles = state.tracks.filter(track => {
    return props.time >= track.start && props.time <= track.end
  })

  if (!subtitles.length) {
    return null
  }

  return (
    <React.Fragment>
      {placements.map((placement, i) => {
        const placementSubtitles = subtitles.filter(subtitle => {
          // We want to position default tracks (tracks without specified positioning)
          // to be placed to the bottom center.
          if (placement.className === 'is-bottom-center-subtitle' && !HAS_PLACEMENT_PATTERN.test(subtitle.text)) {
            return true
          }

          return subtitle.text.includes(placement.indicator)
        })

        const className = cx('subtitle-slot', {
          'is-player-open': props.isPlayerOpen,
          [placement.className]: true
        })

        return (
          <div key={placement.className} className={className}>
            {placementSubtitles.map(subtitle => (
              <p
                className="subtitle"
                key={subtitle.index}
                dangerouslySetInnerHTML={{
                  __html: subtitle.text.replace('\n', '<br />').replace(placement.indicator, '')
                }}
              />
            ))}
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default SubtitleSlot

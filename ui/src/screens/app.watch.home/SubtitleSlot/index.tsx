import './style'

import * as React from 'react'
import originalSrt2Obj from 'srt-to-obj'
import { useState } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import fromReadableTime from '~/utils/date/fromReadableTime'
import axios from '~/lib/axios'

interface State {
  tracks: Track[]
}

interface Props {
  video: AppShowVideo
  time: number
}

function SubtitleSlot(props: Props) {
  const [state, setState] = useState(() => ({ tracks: [] }))

  useAsyncEffect(async () => {
    if (props.video.subtitle_url) {
      return
    }

    const [err, data] = await axios.get(props.video.subtitle_url)

    if (err != null) {
      return //
    }

    setState({
      tracks: srt2obj(data)
    })
  }, null, [])

  if (!props.video.subtitle_url) {
    return null
  }

  if (!state.tracks.length) {
    return null
  }

  const subtitle = state.tracks.find((track) => {
    return props.time >= track.start && props.time <= track.end
  })
  
  return (
    <p className="subtitle-slot">
      {subtitle}
    </p>
  )
}

interface OriginalTrack {
  index: string
  timestamp: string
  start: string
  end: string
  text: string
}

interface Track {
  index: string
  timestamp: string
  start: number
  end: number
  text: string
}

/**
 * Transforms the return type of srt-to-obj
 * 
 * { start: '00:00:03,300' } -> { start: 3 }
 * { end: '00:00:04,000' } -> { end: 4 }
 */
function srt2obj(str: string): Track[] {
  const result: OriginalTrack[] = originalSrt2Obj(str)

  return result.map((track: OriginalTrack) => {
    return {
      ...track,
      start: fromReadableTime(track.start),
      end: fromReadableTime(track.end)
    }
  })
}

export default SubtitleSlot
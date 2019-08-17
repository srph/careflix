import './style'

import * as React from 'react'
import cx from 'classnames'
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
  isEnabled: boolean
  isPlayerOpen: boolean
}

function SubtitleSlot(props: Props) {
  const [state, setState] = useState(() => ({ tracks: [] }))

  useAsyncEffect(async () => {
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
  }, null, [])

  if (!props.video.subtitle_url) {
    return null
  }

  if (!state.tracks.length) {
    return null
  }

  if (!props.isEnabled) {
    return null
  }

  const subtitle = state.tracks.find((track) => {
    return props.time >= track.start && props.time <= track.end
  })

  if (subtitle == null) {
    return null
  }
  
  return (
    <p className={cx('subtitle-slot', { 'is-player-open': props.isPlayerOpen })} dangerouslySetInnerHTML={{ __html: subtitle.text.replace('\n', '<br />') }} />
  )
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

interface OriginalTrack {
  index: string
  timestamp: string
  start: string
  end: string
  text: string
}

// https://github.com/radiovisual/srt-to-obj/blob/master/parse-srt.js
function originalSrt2Obj (srtData) {
	const a = [];
	const normalizedSrtData = srtData.replace(/\r\n/g, '\n');
	const lines = normalizedSrtData.split('\n');
	const len = lines.length;

	let o = {
		text: ''
	} as any;

	for (let i = 0; i < len; i++) {
		const line = lines[i].trim();
		let times;
		let lineBreak = '\n';

		if (typeof parseInt(line, 10) === 'number' && (i === 0 || lines[i - 1] === '')) {
			// we found an index
			o.index = line;
		} else if (line.indexOf(' --> ') > -1) {
			// we found a timestamp
			o.timestamp = line;
			times = line.split(' --> ');
			o.start = times[0];
			o.end = times[1];
		} else if (line === '') {
			// we found an empty string, so push o and reset everything
			a.push(o);
			o = {text: ''};
		} else {
			// we must have text to enter since it's not an index, timestamp or empty string.
			// don't add `\n` to the end of the last line of text
			if (lines[i + 1] === '') {
				lineBreak = '';
			}
			o.text += line + lineBreak;
		}
	}
	return a;
};

export default SubtitleSlot
import './style.css'
import * as React from 'react'
import { useState, } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import UiContainer from '~/components/UiContainer'
import UiButton from '~/components/UiButton'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import UiPlainButton from '~/components/UiPlainButton'
import axios from '~/lib/axios'
import getVideoPreviewImage from '~/utils/shows/getVideoPreviewImage';
import getFormattedDuration from '~/utils/date/getFormattedDuration';
import getAirDetails from '~/utils/shows/getAirDetails';
import { toast } from '~/components/Toast'

/**
 * @TODO For series, include current season & episode
 * @TODO Update members real-time
 */
function YouWereWatching() {
  const [isLoading, setIsLoading] = useState(true)
  const [party, setParty] = useState<AppParty>(null)

  useAsyncEffect(async () => {
    const [err, res] = await axios.get('/api/me/recent-party')

    if (err != null) {
      // Do something
    }

    setIsLoading(false)
    setParty(res.data.party)
  }, null, [])

  if (isLoading) {
    return null
  }

  if (party == null) {
    return null
  }

  function handleDismiss() {
    axios.put('/api/me/dismiss-recent-party', {
      party_id: party.id
    }, {
      app: {
        validation: false
      }
    })

    toast('Party was dismissed.')

    setParty(null)
  }

  return (
    <div className="you-were-watching">
      <img src={getVideoPreviewImage(party)} className="cover" alt={party.video.show.title} />

      <div className="overlay" />

      <div className="dismiss">
        <UiContainer size="xl">
          <div className="you-were-watching-dismiss">
            <div className="desktop">
              <UiButton onClick={handleDismiss}>
                Dismiss
              </UiButton>
            </div>

            <div className="iconbtn">
              <UiPlainButton type="button" onClick={handleDismiss}>
                <div className="you-were-watching-dismiss-icon-button">
                  <i className="fa fa-close" />
                </div>
              </UiPlainButton>
            </div>
          </div>
        </UiContainer>
      </div>

      <div className="content">
        <UiContainer size="xl">
          <div className="you-were-watching-content">
            {party.video.show.title_type === 'movie' && <div className="tags">
              <span className="tag">{getAirDetails(party.video.show)}</span>
              <span className="tag">•</span>
              <span className="tag">{getFormattedDuration(party.video.duration)}</span>
            </div>}

            {party.video.show.title_type === 'series' && <div className="tags">
              <span className="tag">{getAirDetails(party.video.show)}</span>
            </div>}


            <h1 className="title">{party.video.show.title}</h1>

            <p className="description">{party.video.show.synopsis}</p>

            <div className="actions">
              {party.members.length > 1 && <div className="avatar">
                <UiAvatarGroup images={party.members.map(member => member.avatar)} />
              </div>}

              <UiButton link to={`/watch/${party.id}`} variant="primary">
                {party.members.length > 1 ? 'Rejoin Party' : 'Continue Watching'}
              </UiButton>
            </div>
          </div>
        </UiContainer>
      </div>
    </div>
  )
}

export default YouWereWatching
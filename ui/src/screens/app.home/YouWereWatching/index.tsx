import './style.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import axios from '~/lib/axios'
import history from '~/lib/history'
import UiContainer from '~/components/UiContainer'
import UiButton from '~/components/UiButton'
import getFormattedDuration from '~/utils/date/getFormattedDuration';
import getAirDetails from '~/utils/shows/getAirDetails';

/**
 * @TODO Update members real-time
 */
function YouWereWatching() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [featured, setFeatured] = useState<AppShow>(null)

  useEffect(() => {
    async function fetch() {
      const [err, res] = await axios.get('/api/shows/featured')
      setIsLoading(false)
      setFeatured(res.data)
    }

    fetch()
  }, [])

  if (isLoading) {
    return null
  }

  if (featured == null) {
    return null
  }


  async function handleWatch() {
    if (isCreating) {
      return
    }

    setIsCreating(true)
    
    const [err, res] = await axios.post('/api/parties', {
      show_video_id: featured.movie.id
    })

    if (err) {
      // Launch toast notification
      return
    }

    history.push(`/watch/${res.data.id}`)
  }

  return (
    <div className="you-were-watching">
      <img src={featured.preview_image} className="cover" alt={featured.title} />

      <div className="overlay" />

      <div className="content">
        <UiContainer size="xl">
          <div className="you-were-watching-content">
            {featured.title_type === 'movie' && <div className="tags">
              <span className="tag">{getAirDetails(featured)}</span>
              <span className="tag">•</span>
              <span className="tag">{getFormattedDuration(featured.movie.duration)}</span>
            </div>}

            {/* {featured.title_type === 'series' && <div className="tags">
              <span className="tag">{featured.video.group.title}: {featured.video.title}</span>
            </div>} */}

            <h1 className="title">{featured.title}</h1>

            <p className="description">{featured.synopsis}</p>

            <div className="actions">
              <UiButton onClick={handleWatch} variant="primary">
                Watch Now
              </UiButton>
            </div>
          </div>
        </UiContainer>
      </div>
    </div>
  )
}

export default YouWereWatching
import './style'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useCollectionState } from '~/hooks/useCollectionState'
import axios from '~/lib/axios'
import UiContainer from '~/components/UiContainer'
import UiPlainButton from '~/components/UiPlainButton'
import UiSpacer from '~/components/UiSpacer'
import ShowModal from '../ShowModal'
import { InfiniteScroll as Infinite } from 'react-simple-infinite-scroll'
import YouWereWatching from '../YouWereWatching'
import parseStandardTime from '~/utils/date/parseStandardTime'

const PLACEHOLDER_BLOCKS = Array.from({ length: 5 })

function AuthHome() {
  const [collection, setCollection] = useCollectionState<AppShow>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedShow, setSelectedShow] = useState<AppShow | null>()

  useEffect(() => {
    fetch()
  }, [])

  async function fetch(page = 1) {
    setIsLoading(true)
    const [err, res] = await axios.get(`/api/shows?page=${page}`)

    if (err) {
      setError('An error occured.')
      // @TODO Launch toast notification
    }

    setCollection({
      ...res.data,
      data: [...collection.data, ...res.data.data]
    })
    setIsLoading(false)
  }

  function handleLoadMore() {
    fetch(collection.current_page + 1)
  }

  async function handleShowClick(show: AppShow) {
    setSelectedShow(show)
  }

  function handleShowClose() {
    setSelectedShow(null)
  }

  return (
    <React.Fragment>
      <YouWereWatching />

      <UiSpacer size={4} />

      <UiContainer>
        <h5 className="ui-subheading">New Releases</h5>

        <UiSpacer size={2} />

        <Infinite
          throttle={100}
          threshold={300}
          isLoading={isLoading}
          hasMore={collection.current_page === 1 || collection.current_page !== collection.last_page}
          onLoadMore={handleLoadMore}
          data={collection}>
          <div className="show-layout">
            {collection.data.map((show, j) => (
              <div className="column" key={j}>
                <UiPlainButton className="show-carousel-card-button">
                  <div className="show-carousel-card-container">
                    <div
                      className="show-carousel-card"
                      style={{ backgroundImage: `url(${show.preview_image})` }}
                      onClick={() => handleShowClick(show)}>
                      <div className="overlay" />

                      <div className="details">
                        <div className="tags">
                          <span className="tag">{parseStandardTime(show.air_start).getFullYear()}</span>
                        </div>

                        <h3 className="title">{show.title}</h3>
                      </div>
                    </div>
                  </div>
                </UiPlainButton>
              </div>
            ))}

            {isLoading &&
              PLACEHOLDER_BLOCKS.map((_, i) => (
                <div className="column">
                  <div className="show-carousel-placeholder" key={i}>
                    <div className="block" />
                  </div>
                </div>
              ))}
          </div>
        </Infinite>

        <ShowModal show={selectedShow} onClose={handleShowClose} />
      </UiContainer>
    </React.Fragment>
  )
}

export default AuthHome

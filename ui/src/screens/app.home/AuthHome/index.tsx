import './style'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useCollectionState } from '~/hooks/useCollectionState'
import { useUpdateDebounce } from '~/hooks/useUpdateDebounce'
import { useQueryParam, StringParam } from 'use-query-params'
import axios from '~/lib/axios'
import UiContainer from '~/components/UiContainer'
import UiInput from '~/components/UiInput'
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

  const [search, setSearch] = useQueryParam('search', StringParam)

  // The input is kept locally so typing stays instant -- `?search=` only
  // catches up once typing settles, and that's what triggers the request.
  const [input, setInput] = useState(search || '')

  // Only the newest request may write to the collection, so a slow response
  // for an earlier keystroke can't land on top of a newer one.
  const requestRef = useRef(0)

  useUpdateDebounce(
    () => {
      setSearch(input.trim() || undefined, 'replaceIn')
    },
    500,
    [input]
  )

  useEffect(() => {
    fetch()
  }, [search])

  async function fetch(page = 1) {
    const request = ++requestRef.current

    setIsLoading(true)
    setError('')

    const [err, res] = await axios.get('/api/shows', {
      params: search ? { page, search } : { page }
    })

    // A newer search already took over while this was in flight.
    if (request !== requestRef.current) {
      return
    }

    if (err) {
      setError('An error occured.')
      // @TODO Launch toast notification
      setIsLoading(false)
      return
    }

    setCollection(prev => ({
      ...res.data,
      data: page === 1 ? res.data.data : [...prev.data, ...res.data.data]
    }))
    setIsLoading(false)
  }

  function handleLoadMore() {
    fetch(collection.current_page + 1)
  }

  function handleSearchInput(evt: React.FormEvent<HTMLInputElement>) {
    setInput(evt.currentTarget.value)
  }

  async function handleShowClick(show: AppShow) {
    setSelectedShow(show)
  }

  function handleShowClose() {
    setSelectedShow(null)
  }

  const isEmpty = !isLoading && !error && !collection.data.length

  return (
    <React.Fragment>
      {!search && <YouWereWatching />}

      <UiSpacer size={4} />

      <UiContainer>
        <div className="show-searchbar">
          <UiInput
            isRound
            type="text"
            placeholder="Search for a movie or show..."
            value={input}
            onChange={handleSearchInput}
          />
        </div>

        <UiSpacer size={3} />

        <h5 className="ui-subheading">{search ? `Results for "${search}"` : 'New Releases'}</h5>

        <UiSpacer size={2} />

        <Infinite
          throttle={100}
          threshold={300}
          isLoading={isLoading}
          hasMore={collection.current_page < collection.last_page}
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
                <div className="column" key={i}>
                  <div className="show-carousel-placeholder">
                    <div className="block" />
                  </div>
                </div>
              ))}
          </div>
        </Infinite>

        {error && <p className="show-layout-message">{error}</p>}

        {isEmpty && (
          <p className="show-layout-message">
            {search ? `No shows match "${search}".` : 'There are no shows yet.'}
          </p>
        )}

        <ShowModal show={selectedShow} onClose={handleShowClose} />
      </UiContainer>
    </React.Fragment>
  )
}

export default AuthHome

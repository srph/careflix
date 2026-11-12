import * as React from 'react'
import { cn } from '~/utils/cn'
import { useMemo, useState } from 'react'
import { UiSelect } from '~/components/ui-select/ui-select'
import { StandardImageAspectRatio } from '~/components/standard-image-aspect-ratio/standard-image-aspect-ratio'
import { getFormattedDurationWithoutSeconds } from '~/utils/date/get-formatted-duration-without-seconds'

interface Props {
  /** The show's seasons; nothing shows until there are some. */
  groups: AppShowGroup[]
  show: AppShow | null
  currentVideo?: AppShowVideo
  onEpisodeClick: (video: AppShowVideo) => void
  mode?: 'dark' | 'light'
}

/**
 * @TODO For series with no shows, we'll show an empty placeholder.
 */
export function SeasonSelection(props: Props) {
  const [selectedGroupId, setSelectedGroupId] = useState<AppId>(
    props.currentVideo ? props.currentVideo.show_group_id : -1
  )

  const groups = props.groups
  // Without a selection, the first season.
  const group = useMemo(() => {
    return groups.find((group) => group.id === selectedGroupId) ?? groups[0]
  }, [groups, selectedGroupId])

  function handleGroupChange(evt: React.FormEvent<HTMLSelectElement>) {
    setSelectedGroupId(Number(evt.currentTarget.value))
  }

  function handleEpisodeClick(video: AppShowVideo) {
    if (props.currentVideo && video.id === props.currentVideo.id) {
      // @TODO Show a toast message, "this is already playing."
      // @TODO Add API validation.
      return
    }

    props.onEpisodeClick(video)
  }

  const show = props.show
  if (!show || show.title_type === 'movie' || !groups.length) {
    return null
  }

  const light = props.mode === 'light'

  return (
    <React.Fragment>
      <div className="mb-4 w-1/2">
        <UiSelect value={group.id} onChange={handleGroupChange} mode={props.mode}>
          {groups.map((group) => (
            <option value={group.id} key={group.id}>
              {group.title}
            </option>
          ))}
        </UiSelect>
      </div>

      <section>
        {group.videos.map((video) => {
          const active = props.currentVideo?.id === video.id

          return (
            <button
              type="button"
              className={cn(
                'flex w-full cursor-pointer items-center py-4 text-left not-last:border-b first:border-t',
                light ? 'border-neutral-200 text-neutral-700' : 'border-neutral-800 text-white'
              )}
              key={video.id}
              onClick={() => handleEpisodeClick(video)}>
              <div className="relative mr-3 w-30 shrink-0">
                {active && (
                  <span className="absolute top-1 right-1 z-1 inline-block rounded-sm bg-pink-500 p-1 text-white">
                    <h5 className="font-label text-10 leading-none font-bold tracking-label uppercase">Playing</h5>
                  </span>
                )}
                <div className="relative overflow-hidden rounded-sm">
                  <StandardImageAspectRatio src={show.preview_image} />
                </div>
              </div>

              <div className="mr-6 w-full">
                <div className="text-neutral-400">
                  <h5 className="font-label text-xs font-bold uppercase">
                    {getFormattedDurationWithoutSeconds(video.duration)}
                  </h5>
                </div>

                <h3 className="text-xl font-bold">{video.title}</h3>
              </div>

              {!active && (
                <span className={cn('shrink-0', light ? 'text-neutral-300' : 'text-neutral-400')}>
                  <i className="fa fa-play" />
                </span>
              )}
            </button>
          )
        })}
      </section>
    </React.Fragment>
  )
}

import { notifyManager } from '@tanstack/react-query'

/**
 * Makes cache writes, and any React state updates in `alongside`, show up in one render.
 *
 * Query tells components about a cache write a tick later, and about each write separately, so two
 * writes (or a write plus a setState) can otherwise render one frame apart.
 */
export function inOneRender(writes: () => void, alongside?: () => void) {
  notifyManager.batch(() => {
    writes()
    if (alongside) notifyManager.schedule(alongside)
  })
}

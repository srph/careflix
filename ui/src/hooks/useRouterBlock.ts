import history from '~/lib/history'
import { useEffect } from 'react';

type Callback = (location, action) => string | null

function useRouterBlock(cb: Callback, args: any[]) {
  useEffect(() => {
    return history.block(cb)
  }, args)
}

export {
  useRouterBlock,
  useRouterBlock as default
}
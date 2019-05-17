export interface State {
  party: AppParty | null
  isLoading: boolean
}

export type Action = ReducerAction<'data:init'>
 | ReducerAction<'data:success', { party: AppParty }>
 | ReducerAction<'data:error'>
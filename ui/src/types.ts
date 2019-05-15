// declare module '@srph/react-notification'
declare module 'cookie-machine'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

type AsyncGoReturn<T = any> = [Error] | [null, T] | []

interface ReactComponentWrapper {
  children: React.ReactNode
}

type AppValidationBag = {
  [key: string]: string[]
}

interface ReducerAction<T> {
  type: string
  payload: T
}

interface AppUser {
  id: number
  email: string
  name: string
  avatar: string
  created_at: string
  updated_at: string
}

interface AppPartyInvitation {
  id: number
  party_id: number
  invitation_code: string
}

interface AppPartyLog {
  id: number
  party_id: number
  type: 'activity' | 'message'
  activity?: {
    id: string
    text: string
  }
  message?: {
    id: string
    text: string
  }
  created_at: string
  updated_at: string
}

interface AppShowVideo {
  id: number
  show_id: number
  show_group_id: number
  synopsis: string
  title: string
  preview_image: string
  video_url: string
  created_at: string
  updated_at: string
}

interface AppShow {
  id: number
  title: string
  title_type: 'movie' | 'series'
  preview_image?: string
  synopsis: string
  language: string
  air_start: string
  air_end: string
  age_rating: string
  created_at: string
  updated_at: string
  movie: AppShowVideo | null
}

type AppPartyMember = AppUser & {
  pivot: {
    is_active: boolean
  }
}

interface AppParty {
  id: number
  show_video_id: number
  is_playing: boolean
  current_time: number
  show: AppShow
  members: AppPartyMember[]
  last_activity_at: string
  created_at: string
  updated_at: string
}
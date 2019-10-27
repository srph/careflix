// declare module '@srph/react-notification'
declare module 'cookie-machine'
declare module 'color-hash'

type AsyncGoReturn<T = any> = [Error] | [null, T] | []

interface ReactComponentWrapper {
  children: React.ReactNode
}

type AppValidationBag = {
  [key: string]: string[]
}

interface ReducerAction<T, P = {}> {
  type: T
  payload?: P
}

type AppId = string | number

interface AppUser {
  id: AppId
  email: string
  name: string
  avatar: string
  invitations?: AppPartyInvitation[]
  is_online: boolean
  created_at: string
  updated_at: string
}

interface AppPartyInvitation {
  id: AppId
  party_id: AppId
  invitation_code: string
  party?: AppParty
  sender: AppUser
  action: 'pending' | 'cancelled' | 'accepted' | 'declined'
  recipient: AppUser
  expires_at: string
  created_at: string
  updated_at: string
}

interface AppPartyLog {
  id: AppId
  party_id: AppId
  type: 'activity' | 'message'
  activity?: {
    id: string
    text: string
    user: AppUser
    created_at: string
    updated_at: string
  }
  message?: {
    id: string
    text: string
    user: AppUser
    created_at: string
    updated_at: string
  }
  created_at: string
  updated_at: string
}

interface AppShowVideo {
  id: AppId
  show_id: AppId
  show_group_id: AppId
  synopsis: string
  title: string
  preview_image: string
  video_url: string
  show?: AppShow
  group?: AppShowGroup
  duration: number
  subtitle_url: string
  created_at: string
  updated_at: string
}

interface AppShowGroup {
  id: AppId
  show_id: AppId
  title: string
  show?: AppShow
  videos: AppShowVideo[]
  created_at: string
  updated_at: string
}

interface AppShow {
  id: AppId
  title: string
  title_type: 'movie' | 'series'
  preview_image: string
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
  id: AppId
  show_video_id: AppId
  is_playing: boolean
  current_time: number
  video?: AppShowVideo
  invitations?: AppPartyInvitation[]
  members: AppPartyMember[]
  last_activity_at: string
  created_at: string
  updated_at: string
}

interface AppPartyState {
  is_playing: boolean
  current_time: number
}

interface PusherPresenceEvent<T = {}> {
  id: number
  info: T
}
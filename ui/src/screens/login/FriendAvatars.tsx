import memoji1 from '~/assets/login/memoji-1.webp'
import memoji2 from '~/assets/login/memoji-2.webp'
import memoji3 from '~/assets/login/memoji-3.webp'

const faces = [memoji1, memoji2, memoji3]

export default function FriendAvatars() {
  return <span className="login-friend-avatars" aria-hidden="true" data-reaction-layout>
    {faces.map(src => <span className="login-friend-avatar" key={src}>
      <span className="login-friend-avatar-circle" />
      <span className="login-friend-avatar-face"><img src={src} alt="" draggable={false} /></span>
    </span>)}
  </span>
}

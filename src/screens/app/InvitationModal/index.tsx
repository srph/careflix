import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiButton from '~/components/UiButton'
import UiAvatar from '~/components/UiAvatar'
import useCountdownTimer from '~/components/CountdownTimer'

function InvitationModal() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  const countdown: number = useCountdownTimer({
    duration: 5,
    onComplete: () => {
      setIsOpen(false)
    }
  })
  
  return (
    <UiModal isOpen={isOpen} shouldCloseOnOverlayClick={false}>
      <div className="invitation-modal">
        <div className="actions">
          <UiButton onClick={() => setIsOpen(false)}>Decline</UiButton>
          <UiButton onClick={() => setIsOpen(false)} variant="primary">Accept</UiButton>
        </div>

        <div className="invitation-modal-card">
          <div className="user">
            <div className="avatar">
              <UiAvatar size="m" img={require('~/assets/dummy-avatar.png')} />
            </div>

            <div className="details">
              <h2>Kier Borromeo</h2>
              <div className="subheading">
                <h6 className="ui-subheading">Invited you to watch</h6>
              </div>
            </div>
          </div>

          <div className="thumbnail" style={{ backgroundImage: `url(${require('~/assets/show-thumbnail-218x146.jpg')})` }}>
            <div className="overlay" />
            <div className="details">
              <div className="tag">
                <h6 className="ui-subheading">Season 3: Episode 23</h6>
              </div>
              <h3 className="title">Boku no Hero Academia</h3>
            </div>
          </div>
        </div>

        <div className="invitation-modal-expiration">
          <h6 className="ui-subheading">Expires in {countdown}<span className="invitation-modal-expiration-lowercaps">s</span></h6>
        </div>
      </div>
    </UiModal>
  )
}

export default InvitationModal
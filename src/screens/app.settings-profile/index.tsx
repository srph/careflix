import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiContainer from '~/components/UiContainer'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiButton from '~/components/UiButton'
import UiFormSpacer from '~/components/UiFormSpacer'

function AppSettingsProfile(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <div className="settings-profile-avatar">
        <div className="avatar">
          <UiAvatar size="l" img={require('~/assets/dummy-avatar.png')} />

          <div className="action">
            <i className="fa fa-pencil" />
          </div>
        </div>
      </div>
      
      <UiContainer>
        <UiFormGroup label="Email">
          <UiInput placeholder="john@doe.com" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Name">
          <UiInput placeholder="Kier Borromeo" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiButton variant="primary" block size="l">
          Update Profile
        </UiButton>
      </UiContainer>
    </React.Fragment>
  )
}

export default AppSettingsProfile
import asset_0 from '~/assets/dummy-avatar.png'
import './style.css'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiContainer from '~/components/UiContainer'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiButton from '~/components/UiButton'
import UiFormSpacer from '~/components/UiFormSpacer'
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'

function AppSettingsProfile(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <AppHeadingSettings title="Account Settings" backUrl="/settings" />

      <div className="settings-profile-avatar">
        <div className="avatar">
          <UiAvatar size="l" img={asset_0} />

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
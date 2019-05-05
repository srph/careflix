import './style'

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
      <AppHeadingSettings title="Change Password" backUrl="/settings" />
      <UiContainer>
        <UiFormGroup label="Current Password">
          <UiInput type="password" placeholder="*********" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="New Password">
          <UiInput type="password" placeholder="*********" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Confirm New Password">
          <UiInput type="password" placeholder="*********" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiButton variant="primary" block size="l">
          Update Password
        </UiButton>
      </UiContainer>
    </React.Fragment>
  )
}

export default AppSettingsProfile
import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiContainer from '~/components/UiContainer'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'
import { useAuth } from '~/contexts/Auth'

function AppSettingsProfile(props: ReactComponentWrapper) {
  const { data: user } = useAuth()
  return (
    <React.Fragment>
      <AppHeadingSettings title="Account Settings" backUrl="/settings" />

      <div className="mb-8 flex items-center justify-center">
        <div>
          <UiAvatar size="l" user={user} />
        </div>
      </div>

      <UiContainer>
        <div className="flex flex-col gap-4">
          <UiFormGroup label="Email">
            <UiInput value={user.email || 'Not shared by Discord'} readOnly aria-label="Email" />
          </UiFormGroup>

          <UiFormGroup label="Name">
            <UiInput value={user.name} readOnly aria-label="Name" />
          </UiFormGroup>

          <p>Your profile comes from Discord. Changes appear the next time you sign in.</p>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default AppSettingsProfile

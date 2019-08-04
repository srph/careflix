import './style'
import * as React from 'react'
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'
import UiContainer from '~/components/UiContainer'
import UiSpacer from '~/components/UiSpacer'
import UiAccordion from '~/components/UiAccordion'

import asset_downloadImage from '~/assets/download-img.svg'
import faqs from './faq'

// What is this?
// For whom is this?
// How do you profit?
// Can you see which users registered?
// Can you see our password?
// Can you see our messages?
// How do I request movies?
// How do I report bugs?
function AppSettingsFaq(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <AppHeadingSettings title="FAQ" backUrl="/" />

      <UiContainer size="sm">
        <div className="app-download-heading">
          <img src={asset_downloadImage} />
          <p className="text">Enjoy a more immersive experience. Now on Android.</p>
        </div>

        <UiAccordion>
          {faqs.map((faq, i) => (
            <UiAccordion.Section icon={<i className="fa fa-android" />} title={faq.title} key={i}>
              {faq.content.map((p, j) => (
                <p
                  className="app-settings-faq-text"
                  key={j}
                  dangerouslySetInnerHTML={{
                    __html: p
                      .replace(':facebook', '<a href="https://www.facebook.com/kierb" target="_blank">Facebook</a>')
                      .replace(':twitter', '<a href="https://twitter.com/_srph" target="_blank">Twitter</a>')
                      .replace(':author', '<a href="https://kierb.com" target="_blank">Kier Borromeo</a>')
                      .replace(':github', '<a href="https://github.com/srph/careflix" target="_blank">Github</a>')
                  }}
                />
              ))}
            </UiAccordion.Section>
          ))}
        </UiAccordion>
      </UiContainer>

      <UiSpacer size={10} />
    </React.Fragment>
  )
}

export default AppSettingsFaq

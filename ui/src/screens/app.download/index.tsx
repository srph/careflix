import './style'
import * as React from 'react'
import { useEffect } from 'react'
import { useIsPWA } from '~/hooks/useIsPWA'
import useWindowSize from 'react-use/lib/useWindowSize'
import history from '~/lib/history'

import AppHeadingSettings from '~/screens/app/AppHeadingSettings'
import UiContainer from '~/components/UiContainer'
import UiSpacer from '~/components/UiSpacer'
import UiAccordion from '~/components/UiAccordion'

import asset_downloadImage from '~/assets/download-img.svg'
import asset_downloadStep1 from '~/assets/download-step-1.png'
import asset_downloadStep2 from '~/assets/download-step-2.png'
import asset_downloadStep3 from '~/assets/download-step-3.png'
import asset_downloadStep4 from '~/assets/download-step-4.png'

function AppDownload(props: ReactComponentWrapper) {
  const { width } = useWindowSize()

  const isPWA = useIsPWA()

  useEffect(() => {
    if (width >= 1120 || isPWA) {
      history.push('/')
    }
  }, [width, isPWA])

  return (
    <React.Fragment>
      <AppHeadingSettings title="Download The App" backUrl="/" />

      <UiContainer size="xl">
        <div className="app-download-heading">
          <img src={asset_downloadImage} />
          <p className="text">Enjoy a more immersive experience. Now on Android.</p>
        </div>

        <UiAccordion>
          <UiAccordion.Section icon={<i className="fa fa-android" />} title="Download on Android">
            <div className="app-download-step">
              <div className="count">
                <h5 className="ui-subheading">Step 1</h5>
              </div>
              <img src={asset_downloadStep1} className="thumb" />
              <p className="text">On the right portion of the url bar, press the triple dots icon.</p>
            </div>

            <div className="app-download-step">
              <div className="count">
                <h5 className="ui-subheading">Step 2</h5>
              </div>
              <img src={asset_downloadStep2} className="thumb" />
              <p className="text">Scroll down until you find the <span className="highlight">Add To Home Screen</span> menu.</p>
            </div>

            <div className="app-download-step">
              <div className="count">
                <h5 className="ui-subheading">Step 3</h5>
              </div>
              <img src={asset_downloadStep3} className="thumb" />
              <p className="text">A popup will appear to download the app. Simply press <span className="highlight">OK</span>.</p>
            </div>

            <div className="app-download-step">
              <div className="count">
                <h5 className="ui-subheading">Step 3</h5>
              </div>
              <img src={asset_downloadStep4} className="thumb" />
              <p className="text">Go back to your home screen, then find <span className="highlight">Care.tv</span>. You should be good to go!</p>
            </div>
          </UiAccordion.Section>

          <UiAccordion.Section icon={<i className="fa fa-apple" />} title="Download on Apple">
            <div className="app-download-apple-note">
              <div className="soon">
                <h5 className="ui-subheading">Coming soon!</h5>
              </div>
              <div className="text">
                Ironically, I use an Apple device, but I haven't made it work yet. Coming really, really soon.
              </div>
            </div>
          </UiAccordion.Section>
        </UiAccordion>
      </UiContainer>

      <UiSpacer size={5} />
    </React.Fragment>
  )
}

export default AppDownload
import * as React from 'react'
import { useEffect } from 'react'
import { useIsPWA } from '~/hooks/use-is-pwa'
import { useNavigate } from 'react-router'

import { AppHeadingSettings } from '~/screens/app/app-heading-settings'
import { UiContainer } from '~/components/ui-container/ui-container'
import { UiAccordion } from '~/components/ui-accordion/ui-accordion'

import asset_downloadImage from '~/assets/download-img.svg'
import asset_downloadStep1 from '~/assets/download-step-1.png'
import asset_downloadStep2 from '~/assets/download-step-2.png'
import asset_downloadStep3 from '~/assets/download-step-3.png'
import asset_downloadStep4 from '~/assets/download-step-4.png'

function Step({ label, image, children }: { label: string; image: string; children: React.ReactNode }) {
  return (
    <div className="not-last:mb-6">
      <div className="mb-2">
        <h5 className="font-label text-xs font-bold tracking-label uppercase">{label}</h5>
      </div>
      <img src={image} className="mb-2 block w-full rounded-sm border border-neutral-400" />
      <p className="text-sm">{children}</p>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="border-b border-dashed border-neutral-400">{children}</span>
}

export function AppDownloadPage() {
  const navigate = useNavigate()
  const isPWA = useIsPWA()

  useEffect(() => {
    if (isPWA) {
      navigate('/')
    }
  }, [isPWA])

  return (
    <React.Fragment>
      <AppHeadingSettings title="Download The App" backUrl="/" />

      <UiContainer size="sm">
        <div className="mb-6 pt-6 text-center">
          <img src={asset_downloadImage} className="mb-6 inline max-w-40" />
          <p className="text-2xl">Enjoy a more immersive experience. Now on Android.</p>
        </div>

        <UiAccordion>
          <UiAccordion.Section icon={<i className="fa fa-android" />} title="Download on Android">
            <Step label="Step 1" image={asset_downloadStep1}>
              On the right portion of the url bar, press the triple dots icon.
            </Step>

            <Step label="Step 2" image={asset_downloadStep2}>
              Scroll down until you find the <Highlight>Add To Home Screen</Highlight> menu.
            </Step>

            <Step label="Step 3" image={asset_downloadStep3}>
              A popup will appear to download the app. Simply press <Highlight>OK</Highlight>.
            </Step>

            <Step label="Step 3" image={asset_downloadStep4}>
              On your home screen, you should find <Highlight>Careflix</Highlight>.
            </Step>
          </UiAccordion.Section>

          <UiAccordion.Section icon={<i className="fa fa-apple" />} title="Download on Apple">
            <div>
              <div className="mb-1 text-neutral-400">
                <h5 className="font-label text-xs font-bold tracking-label uppercase">Coming soon!</h5>
              </div>
              <div className="text-sm">
                Ironically, I use an Apple device, but I haven't made it work yet. Coming really, really soon.
              </div>
            </div>
          </UiAccordion.Section>
        </UiAccordion>
      </UiContainer>

      <div className="h-10" />
    </React.Fragment>
  )
}

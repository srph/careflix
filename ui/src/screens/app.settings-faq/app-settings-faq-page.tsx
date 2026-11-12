import * as React from 'react'
import { AppHeadingSettings } from '~/screens/app/app-heading-settings'
import { UiContainer } from '~/components/ui-container/ui-container'
import { UiAccordion } from '~/components/ui-accordion/ui-accordion'

import asset_faqImage from '~/assets/faq-img.svg'
import { appSettingsFaqQuestions as faqs } from './app-settings-faq-questions'

// What is this?
// For whom is this?
// How do you profit?
// Can you see which users registered?
// Can you see our password?
// Can you see our messages?
// How do I request movies?
// How do I report bugs?
export function AppSettingsFaqPage() {
  return (
    <React.Fragment>
      <AppHeadingSettings title="FAQ" backUrl="/settings" />

      <UiContainer size="sm">
        <div className="mb-6 pt-6 text-center">
          <img src={asset_faqImage} className="mb-6 inline max-w-40" />
          <p className="text-2xl">Frequently Asked Questions.</p>
        </div>

        <UiAccordion>
          {faqs.map((faq, i) => (
            <UiAccordion.Section icon={<i className="fa fa-android" />} title={faq.title} key={i}>
              {faq.content.map((p, j) => (
                <p
                  className="text-sm not-last:mb-4 [&_a]:border-b [&_a]:border-dashed [&_a]:border-neutral-400"
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

      <div className="h-20" />
    </React.Fragment>
  )
}

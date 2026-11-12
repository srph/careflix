import { PageTitle } from '~/components/page-title/page-title'

interface Props {
  title: string
  backUrl: string
}

export function AppHeadingSettings({ title }: Props) {
  return <PageTitle title={title} />
}

import { PageTitle } from '~/components/page-title/page-title'

interface Props {
  title: string
  backUrl: string
}

export default function AppHeadingSettings({ title }: Props) {
  return <PageTitle title={title} />
}

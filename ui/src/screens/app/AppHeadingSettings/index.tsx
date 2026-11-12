import PageTitle from '~/components/PageTitle'

interface Props {
  title: string
  backUrl: string
}

export default function AppHeadingSettings({ title }: Props) {
  return <PageTitle title={title} />
}

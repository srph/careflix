import { config } from '~/config'

export function PageTitle({ title }: { title: string }) {
  return <title>{`${title} • ${config.app.title}`}</title>
}

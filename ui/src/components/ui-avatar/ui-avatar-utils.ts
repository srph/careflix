import ColorHash from 'color-hash'

const hash = new ColorHash()

export function getBgFromInitials(initials: string): string {
  return hash.hex(initials)
}

export function getInitials(name: string) {
  const [f, l]: string[] = name.split(' ')
  return [f.charAt(0).toUpperCase(), (l || '').charAt(0).toUpperCase()].join('')
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface ReactComponentWrapper {
  children: React.ReactNode
}
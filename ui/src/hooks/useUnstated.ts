import { Container, ContainersType } from 'unstated'
import { useRef, useContext } from 'react'

/**
 * https://github.com/jamiebuilds/unstated/blob/600462224be7ed50626493ecf822baf45b2ec046/src/unstated.js
 */
export function useUnstated(...containers: ContainersType) {
  const map: ContainerMapType | null = useContext(StateContext)
  if (map === null) {
    throw new Error('You must wrap your hook component with a <Provider>')
  }

  const [state, setState] = useState({})
  const instances = useRef([])
  const unmounted = useRef(false)

  useEffect(
    () => () => {
      unmounted.current = true
      unsubscribe()
    },
    []
  )

  const onUpdate = useRef(
    () =>
      new Promise(resolve => {
        if (!unmounted.current) setState(DUMMY_STATE, resolve)
        else resolve()
      })
  )

  function unsubscribe() {
    instances.current.forEach(container => {
      container.unsubscribe(onUpdate.current)
    })
  }

  function createInstances() {
    let safeMap = map
    unsubscribe()

    const newInstances = containers.map(ContainerItem => {
      let instance

      if (typeof ContainerItem === 'object' && ContainerItem instanceof Container) {
        instance = ContainerItem
      } else {
        instance = safeMap.get(ContainerItem)

        if (!instance) {
          instance = new ContainerItem()
          safeMap.set(ContainerItem, instance)
        }
      }

      instance.unsubscribe(onUpdate.current)
      instance.subscribe(onUpdate.current)

      return instance
    })

    instances.current = newInstances
    return instances.current
  }

  return useMemo(() => createInstances(), containers)
}

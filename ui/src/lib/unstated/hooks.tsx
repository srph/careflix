import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Container, ContainerConstructor } from './container';
import { StateContext } from './provider';
import { shallowEqual } from './shallowEqual';

export type ContainerType<C extends Container> = ContainerConstructor<C> | C;
type ShouldUpdateFn<C, R> = (c: C) => R;

/*
* Get the state of containers.
*/
export function useContainer<C extends Container>(
  ContainerItem: ContainerType<C>
): C {
  const map = useContext(StateContext);
  if (map === null) {
      throw new Error('You must wrap your hook component with a <Provider>');
  }

  return useMemo(() => {
      let instance;
      if (
          typeof ContainerItem === 'object' &&
          ContainerItem instanceof Container
      ) {
          instance = ContainerItem;
      } else {
          instance = map.get(ContainerItem);

          if (!instance) {
              instance = new ContainerItem();
              map.set(ContainerItem, instance);
          }
      }
      return instance;
  }, [map, ContainerItem]);
}

/*
* Get the state of containers and listen to updates.
*/
export function useUnstated<C extends Container, UpdateCriteria = []>(
  ContainerItem: ContainerType<C>,
  /*
   * Function to determine for which criteria the component should be updated.
   * When a boolean is passed, it always update (or never).
   */
  shouldUpdate?: ShouldUpdateFn<C, UpdateCriteria>
): C {
  const instance = useContainer(ContainerItem);
  const setUpdates = useState(0)[1];
  const instanceRef = useRef<C | null>(null);
  const updateCriteriaRef = useRef<UpdateCriteria | null>(null);
  const shouldUpdateRef = useRef<
      ShouldUpdateFn<C, UpdateCriteria> | undefined
  >(shouldUpdate);
  const unmountedRef = useRef(false);

  shouldUpdateRef.current = shouldUpdate;

  const computeShouldRender = (): boolean => {
      if (!shouldUpdateRef.current) {
          return true;
      }

      const result = shouldUpdateRef.current(instance);
      return !shallowEqual(updateCriteriaRef.current, result);
  };

  const onUpdate = useCallback(() => {
      if (!computeShouldRender()) {
          return;
      }

      return new Promise(resolve => {
          if (!unmountedRef.current) {
              setUpdates(prev => prev + 1);
              resolve();
          } else {
              resolve();
          }
      });
  }, []);

  const unsubscribe = () => {
      if (instanceRef.current) {
          instanceRef.current.unsubscribe(onUpdate);
      }
  };

  useEffect(() => {
      return () => {
          unmountedRef.current = true;
          unsubscribe();
      };
  }, []);

  // Return instances with listeners
  return useMemo(() => {
      // Unsubscribe from previous instance
      unsubscribe();

      instance.unsubscribe(onUpdate);
      instance.subscribe(onUpdate);

      computeShouldRender();

      instanceRef.current = instance;
      return instance;
  }, [instance]);
}
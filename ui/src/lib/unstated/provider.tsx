import * as React from 'react';
import { Container, ContainerConstructor } from './container';

export type ContextType = Map<ContainerConstructor<Container>, Container>;

const StateContext = React.createContext<ContextType | null>(null);

/*
 * Provide a set of containers to children tree.
 */
function Provider(props: {
    inject?: Container[];
    children: React.ReactNode;
}): React.ReactElement {
    const { inject, children } = props;
    const parentMap = React.useContext(StateContext);

    const childMap = React.useMemo(() => {
        const newChildMap = new Map(parentMap);

        if (inject) {
            inject.forEach(instance => {
                newChildMap.set(
                    instance.constructor as ContainerConstructor<Container>,
                    instance
                );
            });
        }

        return newChildMap;
    }, [parentMap, ...(inject || [])]);

    return (
        <StateContext.Provider value={childMap}>
            {children}
        </StateContext.Provider>
    );
}

export { Provider, StateContext };
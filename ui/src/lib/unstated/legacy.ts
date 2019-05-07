import * as React from 'react';
import { Container } from './container';
import { ContainerType, useUnstated } from './hooks';

/*
 * This component is deprecated and should not be used.
 * You should use the hooks instead.
 */
function Subscribe<C extends Container>(props: {
    to: ContainerType<C> | Array<ContainerType<C>>;
    children: (instance: C) => React.ReactNode;
}): React.ReactElement {
    const { to, children } = props;
    const instance = useUnstated(Array.isArray(to) ? to[0] : to);

    return children(instance);
}

export { Subscribe };
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

    // This isn't part of the original unstated library (@gitbookIO/unstated).
    // Since I couldn't make it work, I decided to copy-paste the library instead.
    // @see https://github.com/GitbookIO/unstated/issues/1
    // 
    // But anyway, we'll fix it because want minimal modifications to the copy-paste.
    // @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
    return <React.Fragment>{children(instance)}</React.Fragment>;
}

export { Subscribe };
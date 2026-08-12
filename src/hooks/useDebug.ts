import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void) {
    window.addEventListener('hashchange', onStoreChange);
    return () => window.removeEventListener('hashchange', onStoreChange);
}

function getSnapshot() {
    return window.location.hash;
}

export function useDebug() {
    const hash = useSyncExternalStore(subscribe, getSnapshot);

    return hash === '#debug';
}

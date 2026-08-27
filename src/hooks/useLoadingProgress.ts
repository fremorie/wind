import { useProgress } from '@react-three/drei';
import { useSyncExternalStore } from 'react';

let highestProgress = 0;

function subscribe(onStoreChange: () => void) {
    return useProgress.subscribe(onStoreChange);
}

function getSnapshot() {
    highestProgress = Math.max(
        highestProgress,
        useProgress.getState().progress,
    );

    return highestProgress;
}

export function useLoadingProgress() {
    return useSyncExternalStore(subscribe, getSnapshot);
}

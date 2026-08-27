import { useCallback, useEffect, useRef } from 'react';

import {
    createCrossfadeLoop,
    type CrossfadeLoopOptions,
} from '../utils/crossfadeLoop';

export function useCrossfadeLoop({
    url,
    volume,
    crossfadeDuration,
}: CrossfadeLoopOptions) {
    const loopRef = useRef<ReturnType<typeof createCrossfadeLoop> | null>(null);

    useEffect(() => {
        const loop = createCrossfadeLoop({ url, volume, crossfadeDuration });
        loopRef.current = loop;

        return () => {
            loop.dispose();
            loopRef.current = null;
        };
    }, [url, volume, crossfadeDuration]);

    return useCallback(() => loopRef.current?.start(), []);
}

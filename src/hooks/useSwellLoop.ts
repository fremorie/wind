import { useCallback, useEffect, useRef } from 'react';

import { createSwellLoop, type SwellLoopOptions } from '../utils/swellLoop';

export function useSwellLoop({ url, volume, swellDuration }: SwellLoopOptions) {
    const loopRef = useRef<ReturnType<typeof createSwellLoop> | null>(null);

    useEffect(() => {
        const loop = createSwellLoop({ url, volume, swellDuration });
        loopRef.current = loop;

        return () => {
            loop.dispose();
            loopRef.current = null;
        };
    }, [url, volume, swellDuration]);

    return useCallback(() => loopRef.current?.start(), []);
}

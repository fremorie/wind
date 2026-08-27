import { useLayoutEffect } from 'react';

export function SceneReady({ onReady }: { onReady: () => void }) {
    useLayoutEffect(() => {
        const frame = requestAnimationFrame(onReady);
        return () => cancelAnimationFrame(frame);
    }, [onReady]);

    return null;
}

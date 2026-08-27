import { useCallback, useEffect, useRef } from 'react';

interface LoopingSoundOptions {
    url: string;
    volume: number;
}

export function useLoopingSound({ url, volume }: LoopingSoundOptions) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        const handleVisibilityChange = () => {
            if (document.hidden) audio.pause();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, [url, volume]);

    return useCallback((isPlaying: boolean) => {
        const audio = audioRef.current;
        if (!audio || isPlaying === !audio.paused) return;

        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, []);
}

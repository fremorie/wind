export interface SwellLoopOptions {
    url: string;
    volume: number;
    swellDuration: number;
}

// One fade-in/fade-out cycle: silent at both ends, peaking mid-swell.
export function swellGain(phase: number) {
    return 0.5 * (1 - Math.cos(phase * Math.PI * 2));
}

export function createSwellLoop({
    url,
    volume,
    swellDuration,
}: SwellLoopOptions) {
    let audio: HTMLAudioElement | null = null;

    let animationFrameId: number | null = null;
    let isRunning = false;
    let wasPlayingWhileHidden = false;

    let phase = 0;
    let lastTimestamp: number | null = null;

    // Every swell plays a different stretch of the recording, so the birds do
    // not repeat the same phrase and the loop seam never lands mid-swell.
    const seekToRandomOffset = () => {
        if (!audio) return;

        const { duration } = audio;
        if (!Number.isFinite(duration) || duration <= swellDuration) return;

        audio.currentTime = Math.random() * (duration - swellDuration);
    };

    const updateVolume = (timestamp: number) => {
        if (audio) {
            const delta =
                lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            phase += delta / swellDuration;
            if (phase >= 1) {
                phase -= Math.floor(phase);
                seekToRandomOffset();
            }

            audio.volume = swellGain(phase) * volume;
        }

        animationFrameId = requestAnimationFrame(updateVolume);
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            if (audio && !audio.paused) {
                wasPlayingWhileHidden = true;
                audio.pause();
            }
        } else if (isRunning) {
            if (wasPlayingWhileHidden) {
                audio?.play().catch(() => {});
                wasPlayingWhileHidden = false;
            }
            lastTimestamp = null;
            animationFrameId = requestAnimationFrame(updateVolume);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return {
        start() {
            if (isRunning) return;
            isRunning = true;

            audio = new Audio(url);
            audio.loop = true;
            audio.volume = 0;
            audio.play().catch(() => {});

            phase = 0;
            lastTimestamp = null;
            animationFrameId = requestAnimationFrame(updateVolume);
        },

        dispose() {
            isRunning = false;
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            if (audio) {
                audio.pause();
                audio.src = '';
                audio = null;
            }
        },
    };
}

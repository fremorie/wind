export interface CrossfadeLoopOptions {
    url: string;
    volume: number;
    crossfadeDuration: number;
}

export function equalPowerFade(
    playbackPosition: number,
    duration: number,
    fadeDuration: number,
) {
    if (!Number.isFinite(duration) || duration <= 0) return 0;

    const fadeInProgress = Math.min(playbackPosition / fadeDuration, 1);
    const fadeOutProgress = Math.min(
        (duration - playbackPosition) / fadeDuration,
        1,
    );
    const progress = Math.max(0, Math.min(fadeInProgress, fadeOutProgress));

    return Math.sin((progress * Math.PI) / 2);
}

export function createCrossfadeLoop({
    url,
    volume,
    crossfadeDuration,
}: CrossfadeLoopOptions) {
    let voices: HTMLAudioElement[] = [];

    let animationFrameId: number | null = null;
    let isRunning = false;
    let voicesPausedWhileHidden: HTMLAudioElement[] = [];

    const startVoice = (voice: HTMLAudioElement) => {
        voice.currentTime = 0;
        voice.volume = 0;
        voice.play().catch(() => {});
    };

    const updateVoiceVolumes = () => {
        voices.forEach((voice, voiceIndex) => {
            if (voice.paused) return;

            const { currentTime, duration } = voice;
            voice.volume =
                equalPowerFade(currentTime, duration, crossfadeDuration) *
                volume;

            const otherVoice = voices[1 - voiceIndex];
            if (
                duration - currentTime <= crossfadeDuration &&
                otherVoice.paused
            ) {
                startVoice(otherVoice);
            }
        });

        animationFrameId = requestAnimationFrame(updateVoiceVolumes);
    };

    const handleVisibilityChange = () => {
        if (document.hidden) {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            voicesPausedWhileHidden = voices.filter((voice) => !voice.paused);
            voicesPausedWhileHidden.forEach((voice) => voice.pause());
        } else if (isRunning) {
            voicesPausedWhileHidden.forEach((voice) => {
                voice.play().catch(() => {});
            });
            voicesPausedWhileHidden = [];
            animationFrameId = requestAnimationFrame(updateVoiceVolumes);
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return {
        start() {
            if (isRunning) return;
            isRunning = true;

            voices = [new Audio(url), new Audio(url)];
            voices.forEach((voice) => {
                voice.loop = false;
                voice.volume = 0;
            });

            startVoice(voices[0]);
            animationFrameId = requestAnimationFrame(updateVoiceVolumes);
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
            voices.forEach((voice) => {
                voice.pause();
                voice.src = '';
            });
            voices = [];
        },
    };
}

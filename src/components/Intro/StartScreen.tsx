import { useState, type AnimationEvent } from 'react';

import './StartScreen.css';

interface StartScreenProps {
    isReady: boolean;
    onStart: (isAudioEnabled: boolean) => void;
}

export function StartScreen({ isReady, onStart }: StartScreenProps) {
    const [isLeaving, setIsLeaving] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    if (!isReady || isDismissed) return null;

    const enterExperience = (isAudioEnabled: boolean) => () => {
        onStart(isAudioEnabled);
        setIsLeaving(true);
    };

    const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
        if (!isLeaving || event.target !== event.currentTarget) return;
        setIsDismissed(true);
    };

    return (
        <div
            className={`start-screen ${isLeaving ? 'is-leaving' : ''}`}
            onAnimationEnd={handleAnimationEnd}
        >
            <div
                className="start-screen__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="start-screen-title"
            >
                <h1 className="start-screen__title" id="start-screen-title">
                    Sunday ride
                </h1>
                <p className="start-screen__subtitle">
                    Best enjoyed with sound.
                </p>

                <div className="start-screen__buttons">
                    <button
                        type="button"
                        className="start-screen__button is-primary"
                        onClick={enterExperience(true)}
                        autoFocus
                    >
                        Ride with sound
                    </button>
                    <button
                        type="button"
                        className="start-screen__button"
                        onClick={enterExperience(false)}
                    >
                        I prefer silence
                    </button>
                </div>
            </div>
        </div>
    );
}

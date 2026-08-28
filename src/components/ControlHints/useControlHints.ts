import { useEffect, useState, type AnimationEvent } from 'react';
import { useKeyboardControls } from '@react-three/drei';

import useGame from '../../store/useGame';

const SPRINT_HINT_DELAY = 1500;

export type Phase =
    'move' | 'move-out' | 'gap' | 'sprint' | 'sprint-out' | 'done';

function useKeyTracking() {
    const markMoved = useGame((state) => state.markMoved);
    const markSprinted = useGame((state) => state.markSprinted);

    const [subscribeKeys] = useKeyboardControls();

    useEffect(
        () =>
            subscribeKeys(
                (state) =>
                    state.forward ||
                    state.backward ||
                    state.leftward ||
                    state.rightward,
                (isSteering) => {
                    if (isSteering) markMoved();
                },
            ),
        [subscribeKeys, markMoved],
    );

    useEffect(
        () =>
            subscribeKeys(
                (state) => state.sprint,
                (isSprinting) => {
                    if (isSprinting) markSprinted();
                },
            ),
        [subscribeKeys, markSprinted],
    );
}

function usePhase() {
    const [phase, setPhase] = useState<Phase>(() =>
        useGame.getState().hasMoved ? 'gap' : 'move',
    );

    useEffect(
        () =>
            useGame.subscribe(
                (state) => state.hasMoved,
                (hasMoved) => {
                    if (!hasMoved) return;
                    setPhase((current) =>
                        current === 'move' ? 'move-out' : current,
                    );
                },
            ),
        [],
    );

    useEffect(
        () =>
            useGame.subscribe(
                (state) => state.hasSprinted,
                (hasSprinted) => {
                    if (!hasSprinted) return;
                    setPhase((current) => {
                        if (current === 'sprint') return 'sprint-out';
                        if (current === 'gap') return 'done';
                        return current;
                    });
                },
            ),
        [],
    );

    useEffect(() => {
        if (phase !== 'gap') return;

        const timeout = window.setTimeout(() => {
            setPhase(useGame.getState().hasSprinted ? 'done' : 'sprint');
        }, SPRINT_HINT_DELAY);
        return () => clearTimeout(timeout);
    }, [phase]);

    const isLeaving = phase === 'move-out' || phase === 'sprint-out';

    const onAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
        if (!isLeaving || event.target !== event.currentTarget) return;
        setPhase(phase === 'move-out' ? 'gap' : 'done');
    };

    return { phase, isLeaving, onAnimationEnd };
}

export function useControlHints() {
    useKeyTracking();
    return usePhase();
}

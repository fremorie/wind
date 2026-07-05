import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface GameState {
    isMovingForward: boolean;
    moveForward: () => void;
    stop: () => void;
}

export default create<GameState>()(
    subscribeWithSelector((set) => {
        return {
            isMovingForward: false,

            moveForward: () =>
                set(() => ({
                    isMovingForward: true,
                })),

            stop: () =>
                set(() => ({
                    isMovingForward: false,
                })),
        };
    }),
);

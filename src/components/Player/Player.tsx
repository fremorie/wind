import { useEffect, useMemo } from 'react';
import { useKeyboardControls } from '@react-three/drei';

import { getPlayerPosition } from '../Terrain/utils';
import useGame from '../../store/useGame';

export function Player() {
    const position = useMemo(() => getPlayerPosition(), []);
    const [subscribeKeys] = useKeyboardControls();

    const moveForward = useGame((state) => state.moveForward);
    const stop = useGame((state) => state.stop);

    useEffect(() => {
        const unsubscribeMoveForward = subscribeKeys(
            (state) => state.forward,
            (value) => {
                if (value) {
                    console.log('Moving forward');
                    moveForward();
                } else {
                    console.log('Stopping');
                    stop();
                }
            },
        );

        return () => unsubscribeMoveForward();
    }, [moveForward, stop, subscribeKeys]);

    return (
        <mesh position={position}>
            <sphereGeometry />
            <meshBasicMaterial color="mediumpurple" />
        </mesh>
    );
}

import { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { curveOffset, getElevation } from '../../utils/elevation';
import { GRID_TOTAL_WIDTH } from '../../utils/constants';

const MODEL_URL = './models/rabbit/rabbit.glb';
const WALK_CLIP = 'Bunny|Bunny_walk';

const SCALE = 3;
const FOOT_OFFSET = 0.175 * SCALE;
const HEADING = 0;

const CLEARING_X = 260;
const CLEARING_Z = GRID_TOTAL_WIDTH / 2 - 35;
const RADIUS = 70;

const SPEED = 5;
const ANGULAR_SPEED = SPEED / RADIUS;

export function Rabbit() {
    const groupRef = useRef<THREE.Group>(null);
    const angle = useRef(12); // close enough to the road

    const { scene, animations } = useGLTF(MODEL_URL);
    const { actions } = useAnimations(animations, groupRef);

    const playerPosition = useGame((state) => state.playerPosition);

    useEffect(() => {
        const walk = actions[WALK_CLIP];
        if (!walk) return;

        walk.setEffectiveTimeScale(2);
        walk.reset().play();

        return () => {
            walk.stop();
        };
    }, [actions]);

    useFrame((_, delta) => {
        const group = groupRef.current;
        if (!group) return;

        angle.current += ANGULAR_SPEED * delta;

        const x = CLEARING_X + Math.cos(angle.current) * RADIUS;
        const z = CLEARING_Z + Math.sin(angle.current) * RADIUS;

        group.rotation.y = HEADING - angle.current;

        group.position.set(
            x,
            getElevation(x, z) +
                FOOT_OFFSET -
                curveOffset(x, z, playerPosition.x, playerPosition.z),
            z,
        );
    });

    return (
        <group ref={groupRef} scale={SCALE}>
            <primitive object={scene} />
        </group>
    );
}

useGLTF.preload(MODEL_URL);

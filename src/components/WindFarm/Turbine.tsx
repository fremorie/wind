import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InstanceProps } from '@react-three/drei';
import * as THREE from 'three';

import {
    WIND_FARM_CENTER_Z,
    WIND_FARM_REACHABLE_X,
} from '../../utils/constants';
import { curveOffset, getElevation } from '../../utils/elevation';
import useGame from '../../store/useGame';

export type TurbineInstance = {
    key: string;
    x: number;
    z: number;
    yaw: number;
    scale: number;
    // Blade phase offset + spin speed, so turbines don't rotate in lockstep.
    phase: number;
    speed: number;
};

type Part = React.FC<InstanceProps>;
export type TurbineParts = {
    Nacelle: Part;
    Hub: Part;
    BladeA: Part;
    BladeB: Part;
    TowerA: Part;
    TowerB: Part;
};

type Props = {
    data: TurbineInstance;
    parts: TurbineParts;
};

export function Turbine({ data, parts }: Props) {
    const { Nacelle, Hub, BladeA, BladeB, TowerA, TowerB } = parts;

    const rootRef = useRef<THREE.Group>(null);
    const rotorRef = useRef<THREE.Group>(null);
    const playerPosition = useGame((state) => state.playerPosition);

    // Sampled at the turbine's resting spot, not under it: while the farm
    // follows the player it slides over the terrain and would bob.
    const restZ = WIND_FARM_CENTER_Z + data.z;
    const restElevation = getElevation(WIND_FARM_REACHABLE_X + data.x, restZ);

    useFrame((state) => {
        // Follows the player, staying out of reach on the horizon, until
        // WIND_FARM_REACHABLE_X pins it to the world.
        const root = rootRef.current;
        if (root) {
            const anchorX = Math.min(playerPosition.x, WIND_FARM_REACHABLE_X);
            const worldX = anchorX + data.x;

            // The bend depends on this turbine's own distance to the player,
            // so the farm cannot be positioned as one rigid group.
            root.position.set(
                worldX,
                restElevation -
                    curveOffset(
                        worldX,
                        restZ,
                        playerPosition.x,
                        playerPosition.z,
                    ),
                restZ,
            );
        }

        const rotor = rotorRef.current;
        if (!rotor) return;

        rotor.rotation.z = data.phase + state.clock.elapsedTime * data.speed;
    });

    return (
        <group ref={rootRef} rotation-y={data.yaw} scale={data.scale}>
            {/* Tower */}
            <group scale={[0.809, 3, 0.809]}>
                <TowerA />
                <TowerB />
            </group>

            {/* Nacelle assembly */}
            <group position={[0, 9, 0.011]}>
                <Nacelle />

                {/* Rotor: this whole group spins, carrying the blades with it */}
                <group ref={rotorRef} position={[0, 0, -0.804]}>
                    <Hub />
                    <group position={[0, 0, 0.314]}>
                        <BladeA />
                        <BladeB />
                    </group>
                </group>
            </group>
        </group>
    );
}

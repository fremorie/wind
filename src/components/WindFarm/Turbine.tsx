import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { InstanceProps } from '@react-three/drei';
import * as THREE from 'three';

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

    const rotorRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const rotor = rotorRef.current;
        if (!rotor) return;

        rotor.rotation.z = data.phase + state.clock.elapsedTime * data.speed;
    });

    return (
        <group
            position={[data.x, 0, data.z]}
            rotation-y={data.yaw}
            scale={data.scale}
        >
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

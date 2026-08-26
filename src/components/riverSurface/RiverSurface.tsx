import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { riverSurfaceGeometry } from './geometry';
import useGame from '../../store/useGame';
import { RiverSurfaceMaterial } from '../../materials/riverSurfaceMaterial';
import { WORLD_SETTINGS } from '../../utils/constants';

const material = new RiverSurfaceMaterial({ transparent: true });

export function RiverSurface() {
    const riverSurfaceRef = useRef<THREE.Mesh>(null);
    const playerPosition = useGame((state) => state.playerPosition);

    useFrame(() => {
        if (!riverSurfaceRef.current) {
            return;
        }

        riverSurfaceRef.current.position.set(
            playerPosition.x,
            WORLD_SETTINGS.uRiverSurfaceLevel,
            playerPosition.z,
        );
    });

    return (
        <mesh
            ref={riverSurfaceRef}
            geometry={riverSurfaceGeometry}
            material={material}
        />
    );
}

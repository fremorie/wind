import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { createFoliage } from '../../../utils/foliage';
import {
    bushMaterial,
    bushDepthMaterial,
} from '../../../materials/bushMaterial';
import useGame from '../../../store/useGame';

type Props = {
    positions: Array<[x: number, y: number, z: number]>;
};

export function Bushes({ positions }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const foliageTexture = useTexture('./textures/foliage/foliage.png');
    const playerPosition = useGame((state) => state.playerPosition);

    const bushGeometry = useMemo(() => createFoliage(), []);

    useEffect(() => {
        (
            bushMaterial as THREE.Material & { alphaMap?: THREE.Texture | null }
        ).alphaMap = foliageTexture;
        bushMaterial.needsUpdate = true;
        bushDepthMaterial.needsUpdate = true;
    }, [foliageTexture]);

    useEffect(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < positions.length; i++) {
            const dummyObject = new THREE.Object3D();
            const [x, y, z] = positions[i];
            dummyObject.position.set(x, y, z);
            dummyObject.rotation.set(0, -Math.PI / 2, 0);
            dummyObject.scale.set(2, 2, 2);
            dummyObject.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [positions]);

    useFrame(() => {
        bushMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[bushGeometry, bushMaterial, positions.length]}
            frustumCulled={false}
            customDepthMaterial={bushDepthMaterial}
            receiveShadow
            castShadow
        />
    );
}

useTexture.preload('./textures/foliage/foliage.png');

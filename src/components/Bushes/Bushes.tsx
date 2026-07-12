import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { createFoliage } from '../../utils/foliage';
import { CHUNK_SIZE, GRID_SIZE_Z } from '../../utils/constants';
import { bushMaterial, bushDepthMaterial } from '../../materials/bushMaterial';
import useGame from '../../store/useGame';

type Props = {
    count: number;
};

export function Bushes({ count }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const foliageTexture = useTexture('./textures/foliage/foliage.png');
    const playerPosition = useGame((state) => state.playerPosition);

    const bushGeometry = useMemo(() => createFoliage(), []);

    useEffect(() => {
        for (const material of [bushMaterial, bushDepthMaterial]) {
            (
                material as THREE.Material & { alphaMap?: THREE.Texture | null }
            ).alphaMap = foliageTexture;
            material.needsUpdate = true;
        }
    }, [foliageTexture]);

    useEffect(() => {
        if (!meshRef.current) return;

        const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;

        for (let i = 0; i < count; i++) {
            const dummyObject = new THREE.Object3D();
            const x = center - 20 + i * 10;
            const z = center;
            dummyObject.position.set(x, 3, z);
            dummyObject.rotation.set(0, -Math.PI / 2, 0);
            dummyObject.scale.set(2, 2, 2);
            dummyObject.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count]);

    useFrame(() => {
        bushMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[bushGeometry, bushMaterial, count]}
            frustumCulled={false}
            receiveShadow
            castShadow
        />
    );
}

useTexture.preload('./textures/foliage/foliage.png');

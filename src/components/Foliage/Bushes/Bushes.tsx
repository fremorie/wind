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
import { composeInstanceMatrix, type Instance } from '../../../utils/instances';

type Props = {
    instances: Instance[];
};

export function Bushes({ instances }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const foliageTexture = useTexture('./textures/foliage/foliage.png');
    const playerPosition = useGame((state) => state.playerPosition);

    const bushGeometry = useMemo(() => createFoliage(), []);

    useEffect(() => {
        bushMaterial.alphaMap = foliageTexture;
        bushMaterial.needsUpdate = true;
        bushDepthMaterial.needsUpdate = true;
    }, [foliageTexture]);

    useEffect(() => {
        if (!meshRef.current) return;

        const matrix = new THREE.Matrix4();
        for (let i = 0; i < instances.length; i++) {
            meshRef.current.setMatrixAt(
                i,
                composeInstanceMatrix(instances[i], matrix),
            );
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [instances]);

    useFrame(() => {
        bushMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[bushGeometry, bushMaterial, instances.length]}
            frustumCulled={false}
            customDepthMaterial={bushDepthMaterial}
            castShadow
        />
    );
}

useTexture.preload('./textures/foliage/foliage.png');

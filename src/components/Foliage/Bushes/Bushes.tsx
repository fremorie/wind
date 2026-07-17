import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

import { createFoliage } from '../../../utils/foliage';
import {
    bushMaterial,
    bushDepthMaterial,
} from '../../../materials/bushMaterial';
import useGame from '../../../store/useGame';
import { writeInstanceMatrices } from '../../../utils/instances';
import { getBushesAttributes } from '../../../utils/bushes';
import { recycleInstances } from '../../../utils/foliageField';

type Props = {
    count: number;
};

export function Bushes({ count }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const foliageTexture = useTexture('./textures/foliage/foliage.png');
    const playerPosition = useGame((state) => state.playerPosition);

    const bushGeometry = useMemo(() => createFoliage(), []);
    const bushes = useMemo(() => getBushesAttributes(count), [count]);

    useEffect(() => {
        bushMaterial.alphaMap = foliageTexture;
        bushMaterial.needsUpdate = true;
        bushDepthMaterial.needsUpdate = true;
    }, [foliageTexture]);

    useLayoutEffect(() => {
        if (meshRef.current) writeInstanceMatrices(meshRef.current, bushes);
    }, [bushes]);

    useFrame(() => {
        const moved = recycleInstances(
            bushes,
            playerPosition.x,
            playerPosition.z,
        );

        if (moved && meshRef.current) {
            writeInstanceMatrices(meshRef.current, bushes);
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[bushGeometry, bushMaterial, bushes.length]}
            frustumCulled={false}
            customDepthMaterial={bushDepthMaterial}
            castShadow
        />
    );
}

useTexture.preload('./textures/foliage/foliage.png');

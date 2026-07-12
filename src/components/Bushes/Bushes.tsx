import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

import { createFoliage } from '../../utils/foliage';
import { CHUNK_SIZE, GRID_SIZE } from '../../utils/constants';

type Props = {
    count: number;
};

export function Bushes({ count }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const foliageTexture = useTexture('./textures/foliage/foliage.png');

    const bushGeometry = useMemo(() => createFoliage(), []);

    useEffect(() => {
        if (!meshRef.current) return;

        const center = ((GRID_SIZE - 1) * CHUNK_SIZE) / 2;

        for (let i = 0; i < count; i++) {
            const dummyObject = new THREE.Object3D();
            const x = center - 20 + i * 10;
            const z = center + 10;
            dummyObject.position.set(x, 3, z);
            dummyObject.rotation.set(0, -Math.PI / 2, 0);
            dummyObject.scale.set(2, 2, 2);
            dummyObject.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count]);

    return (
        <instancedMesh
            ref={meshRef}
            args={[bushGeometry, undefined, count]}
            frustumCulled={false}
            receiveShadow
            castShadow
        >
            <meshStandardMaterial
                alphaMap={foliageTexture}
                alphaTest={0.5}
                color="#3a521c"
                side={THREE.DoubleSide}
            />
        </instancedMesh>
    );
}

useTexture.preload('./textures/foliage/foliage.png');

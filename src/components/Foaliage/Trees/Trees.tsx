import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';

import { treeMaterial } from '../../../materials/treeMaterial';
import useGame from '../../../store/useGame';

type GLTFResult = GLTF & {
    nodes: {
        Tree: THREE.Mesh;
    };
};

type Props = {
    positions: Array<[x: number, y: number, z: number]>;
    scales: Array<number>;
};

export function Trees({ positions, scales }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const playerPosition = useGame((state) => state.playerPosition);
    const { nodes } = useGLTF(
        './models/tree/tree.glb',
    ) as unknown as GLTFResult;

    useEffect(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < positions.length; i++) {
            const dummyObject = new THREE.Object3D();
            dummyObject.position.set(...positions[i]);
            dummyObject.scale.set(scales[i], scales[i], scales[i]);
            dummyObject.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [positions, scales]);

    useFrame(() => {
        treeMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[nodes.Tree.geometry, treeMaterial, positions.length]}
            frustumCulled={false}
            receiveShadow
            castShadow
        />
    );
}

useGLTF.preload('./models/tree/tree.glb');

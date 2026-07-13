import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';

import { treeMaterial } from '../../materials/treeMaterial';
import useGame from '../../store/useGame';
import { getTreesPositions } from '../../utils/trees';

type GLTFResult = GLTF & {
    nodes: {
        Tree: THREE.Mesh;
    };
};

type Props = {
    count: number;
};

const TREE_SCALE = 3;

export function Trees({ count }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const playerPosition = useGame((state) => state.playerPosition);
    const { nodes } = useGLTF(
        './models/tree/tree.glb',
    ) as unknown as GLTFResult;

    useEffect(() => {
        if (!meshRef.current) return;

        const positions = getTreesPositions(count);

        for (let i = 0; i < positions.length; i++) {
            const dummyObject = new THREE.Object3D();
            dummyObject.position.set(...positions[i]);
            dummyObject.scale.set(TREE_SCALE, TREE_SCALE, TREE_SCALE);
            dummyObject.updateMatrix();
            meshRef.current.setMatrixAt(i, dummyObject.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count]);

    useFrame(() => {
        treeMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[nodes.Tree.geometry, treeMaterial, count]}
            frustumCulled={false}
            receiveShadow
            castShadow
        />
    );
}

useGLTF.preload('./models/tree/tree.glb');

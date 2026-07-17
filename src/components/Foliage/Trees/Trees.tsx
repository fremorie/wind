import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';

import {
    treeDepthMaterial,
    treeMaterial,
} from '../../../materials/treeMaterial';
import {
    bushDepthMaterial,
    bushMaterial,
} from '../../../materials/bushMaterial';
import useGame from '../../../store/useGame';
import { useTreeControls } from './useTreeControls';
import { writeInstanceMatrices } from '../../../utils/instances';
import { getTreesAttributes } from '../../../utils/trees';
import {
    CANOPY_BUSHES_PER_TREE,
    getBushesAsTreeFoliageAttributes,
} from '../../../utils/bushes';
import { createFoliage } from '../../../utils/foliage';
import { recycleTreesWithCanopies } from '../../../utils/foliageField';

type GLTFResult = GLTF & {
    nodes: {
        Tree: THREE.Mesh;
    };
};

type Props = {
    count: number;
};

export function Trees({ count }: Props) {
    const trunkRef = useRef<THREE.InstancedMesh>(null);
    const canopyRef = useRef<THREE.InstancedMesh>(null);
    const playerPosition = useGame((state) => state.playerPosition);

    useTreeControls();

    const normalMap = useTexture(
        './textures/wood/bark_willow_02_nor_gl_1k.jpg',
    );
    const { nodes } = useGLTF(
        './models/tree/tree.glb',
    ) as unknown as GLTFResult;

    useEffect(() => {
        treeMaterial.normalMap = normalMap;
        treeMaterial.needsUpdate = true;
    }, [normalMap]);

    // Trees own their canopies: the two arrays are mutated together as a rigid
    // body when a tree recycles, so they are generated once and kept in refs.
    const trees = useMemo(() => getTreesAttributes(count), [count]);
    const canopies = useMemo(
        () => getBushesAsTreeFoliageAttributes(trees),
        [trees],
    );

    const bushGeometry = useMemo(() => createFoliage(), []);

    useLayoutEffect(() => {
        if (trunkRef.current) writeInstanceMatrices(trunkRef.current, trees);
        if (canopyRef.current)
            writeInstanceMatrices(canopyRef.current, canopies);
    }, [trees, canopies]);

    useFrame(() => {
        const moved = recycleTreesWithCanopies(
            trees,
            canopies,
            CANOPY_BUSHES_PER_TREE,
            playerPosition.x,
            playerPosition.z,
        );

        if (!moved) return;

        if (trunkRef.current) writeInstanceMatrices(trunkRef.current, trees);
        if (canopyRef.current)
            writeInstanceMatrices(canopyRef.current, canopies);
    });

    return (
        <>
            <instancedMesh
                ref={trunkRef}
                args={[nodes.Tree.geometry, treeMaterial, trees.length]}
                frustumCulled={false}
                customDepthMaterial={treeDepthMaterial}
                receiveShadow
                castShadow
            />
            <instancedMesh
                ref={canopyRef}
                args={[bushGeometry, bushMaterial, canopies.length]}
                frustumCulled={false}
                customDepthMaterial={bushDepthMaterial}
                castShadow
            />
        </>
    );
}

useGLTF.preload('./models/tree/tree.glb');
useTexture.preload('./textures/wood/bark_willow_02_nor_gl_1k.jpg');

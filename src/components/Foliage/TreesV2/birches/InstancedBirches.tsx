import { useGLTF, useTexture, createInstances } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';
import * as THREE from 'three';
import { useEffect, useMemo } from 'react';

import {
    birchFoliageDepthMaterial,
    birchFoliageMaterial,
} from '../../../../materials/foliage/birchMaterial';
import { useFrame } from '@react-three/fiber';
import { bushDepthMaterial } from '../../../../materials/bushMaterial';

type GLTFResult = GLTF & {
    nodes: {
        Foliage: THREE.Mesh;
        Mesh_1007: THREE.Mesh;
        Mesh_1007_1: THREE.Mesh;
    };
    materials: {
        'White.001': THREE.Material;
        'Black.001': THREE.Material;
    };
};

type Props = {
    count: number;
};

type TreeParams = {
    position: [x: number, y: number, z: number];
    id: number | string;
};

export function InstancedBirches({ count }: Props) {
    const foliageTexture = useTexture('./textures/foliage/birch.png');
    const { nodes, materials } = useGLTF(
        './models/trees/BirchFlat.glb',
    ) as unknown as GLTFResult;

    const perlinNoiseTexture = useTexture('./textures/perlinNoise/perlin.png');

    // eslint-disable-next-line
    foliageTexture.wrapS = THREE.RepeatWrapping;
    // eslint-disable-next-line
    foliageTexture.wrapT = THREE.RepeatWrapping;

    // eslint-disable-next-line
    useEffect(() => {
        birchFoliageMaterial.alphaMap = foliageTexture;

        // eslint-disable-next-line
        perlinNoiseTexture.wrapS = THREE.RepeatWrapping;
        perlinNoiseTexture.wrapT = THREE.RepeatWrapping;
        perlinNoiseTexture.needsUpdate = true;

        birchFoliageMaterial.uniforms.uPerlinNoiseTexture.value =
            perlinNoiseTexture;
        birchFoliageMaterial.needsUpdate = true;
        bushDepthMaterial.needsUpdate = true;
    }, [foliageTexture, perlinNoiseTexture]);

    const trees: Array<TreeParams> = useMemo(
        () => [
            { position: [0, 0, 0], id: 1 },
            { position: [0, 0, 10], id: 2 },
            { position: [0, 0, 25], id: 3 },
        ],
        [],
    );

    const [FoliageInstances, FoliageInstance] = useMemo(
        () => createInstances(),
        [],
    );
    const [BarkInstances, BarkInstance] = useMemo(() => createInstances(), []);
    const [StripeInstances, StripeInstance] = useMemo(
        () => createInstances(),
        [],
    );

    useFrame((_, delta) => {
        birchFoliageMaterial.uniforms.uTime.value += delta;
    });

    return (
        <FoliageInstances
            geometry={nodes.Foliage.geometry}
            material={birchFoliageMaterial}
            customDepthMaterial={birchFoliageDepthMaterial}
            castShadow
            limit={count}
        >
            <BarkInstances
                geometry={nodes.Mesh_1007.geometry}
                material={materials['White.001']}
                castShadow
                receiveShadow
                limit={count}
            >
                <StripeInstances
                    geometry={nodes.Mesh_1007_1.geometry}
                    material={materials['Black.001']}
                    limit={count}
                >
                    {trees.map((tree) => (
                        <group
                            key={tree.id}
                            position={tree.position}
                            scale={2.3}
                            rotation-y={-Math.PI / 2}
                        >
                            <FoliageInstance position={[0, 3.284, 0.054]} />
                            <BarkInstance />
                            <StripeInstance />
                        </group>
                    ))}
                </StripeInstances>
            </BarkInstances>
        </FoliageInstances>
    );
}

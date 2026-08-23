import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';
import type CustomShaderMaterial from 'three-custom-shader-material/vanilla';

import {
    barkDepthMaterial,
    canopyDepthMaterial,
    foliageUniforms,
} from '../../../materials/foliage/foliageMaterials';
import useGame from '../../../store/useGame';
import {
    createSpawnTimes,
    stampSpawnTime,
    type Instance,
    writeInstanceMatrices,
} from '../../../utils/instances';
import { type TreeSpeciesName } from '../../../utils/treesV2';
import { recycleInstances } from '../../../utils/foliageField';

/**
 * Everything that differs between a birch, a maple and an oak. The shared
 * component below turns one of these into a set of grounded, recycling
 * InstancedMeshes -- one per part.
 */
export type TreeSpecies = {
    name: TreeSpeciesName;
    /** Path to the .glb. */
    model: string;
    /** The leafy part: swayed by the wind shader, cut out by its own mask. */
    canopy: {
        /** Mesh name inside the .glb. */
        node: string;
        material: CustomShaderMaterial;
    };
    /** The woody parts. A birch has two (pale bark, dark stripes); others one. */
    bark: Array<{
        node: string;
        material: CustomShaderMaterial;
    }>;
};

type GLTFResult = GLTF & {
    nodes: Record<string, THREE.Mesh | undefined>;
};

type Props = {
    trees: Instance[];
    species: TreeSpecies;
    recycle: boolean;
};

export function InstancedTree({ trees, species, recycle }: Props) {
    const meshRefs = useRef<Array<THREE.InstancedMesh | null>>([]);
    const playerPosition = useGame((state) => state.playerPosition);

    const { nodes } = useGLTF(species.model) as unknown as GLTFResult;

    // Every part is baked into one instance matrix per tree, so a part's own
    // node transform has to move into its geometry. Without that, the shader
    // would ground a canopy by its own raised origin and snap it to the floor.
    const parts = useMemo(() => {
        const bake = (nodeName: string) => {
            const node = nodes[nodeName];

            if (!node) {
                throw new Error(
                    `${species.model} has no mesh named "${nodeName}"`,
                );
            }

            node.updateMatrix();

            return node.geometry.clone().applyMatrix4(node.matrix);
        };

        return [
            {
                node: species.canopy.node,
                geometry: bake(species.canopy.node),
                material: species.canopy.material,
                depthMaterial: canopyDepthMaterial,
                receiveShadow: false,
            },
            ...species.bark.map((part) => ({
                node: part.node,
                geometry: bake(part.node),
                material: part.material,
                depthMaterial: barkDepthMaterial,
                receiveShadow: true,
            })),
        ];
    }, [nodes, species]);

    // One attribute per species: every part of a tree has to grow in step.
    const spawnTimes = useMemo(
        () => createSpawnTimes(trees.length),
        [trees.length],
    );

    useLayoutEffect(() => {
        for (const part of parts) {
            part.geometry.setAttribute('aSpawnTime', spawnTimes);
        }
    }, [parts, spawnTimes]);

    useLayoutEffect(() => {
        for (const mesh of meshRefs.current) {
            if (mesh) writeInstanceMatrices(mesh, trees);
        }
    }, [trees, parts]);

    useFrame(() => {
        if (recycle) {
            const moved = recycleInstances(
                trees,
                playerPosition.x,
                playerPosition.z,
                (index) =>
                    stampSpawnTime(
                        spawnTimes,
                        index,
                        foliageUniforms.uTime.value,
                    ),
            );

            if (!moved) return;

            for (const mesh of meshRefs.current) {
                if (mesh) writeInstanceMatrices(mesh, trees);
            }
        }
    });

    return (
        <>
            {parts.map((part, index) => (
                <instancedMesh
                    key={part.node}
                    ref={(mesh) => {
                        meshRefs.current[index] = mesh;
                    }}
                    args={[part.geometry, part.material, trees.length]}
                    frustumCulled={false}
                    customDepthMaterial={part.depthMaterial}
                    receiveShadow={part.receiveShadow}
                    castShadow
                />
            ))}
        </>
    );
}

import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { type GLTF } from 'three-stdlib';

import {
    birchBarkDarkMaterial,
    birchBarkDepthMaterial,
    birchBarkMaterial,
    birchFoliageDepthMaterial,
    birchFoliageMaterial,
    birchUniforms,
} from '../../../../materials/foliage/birchMaterial';
import useGame from '../../../../store/useGame';
import { writeInstanceMatrices } from '../../../../utils/instances';
import { getBirchesAttributes } from '../../../../utils/birches';
import { recycleInstances } from '../../../../utils/foliageField';

type GLTFResult = GLTF & {
    nodes: {
        Foliage: THREE.Mesh;
        Mesh_1007: THREE.Mesh;
        Mesh_1007_1: THREE.Mesh;
    };
};

type Props = {
    count: number;
};

// The wind reads the noise at each vertex's world position, which runs far
// outside 0..1, so it has to tile. Hoisted out of the component because
// useTexture only re-runs its onLoad when the callback identity changes.
function tileTexture(texture: THREE.Texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
}

export function InstancedBirches({ count }: Props) {
    const foliageRef = useRef<THREE.InstancedMesh>(null);
    const barkRef = useRef<THREE.InstancedMesh>(null);
    const stripesRef = useRef<THREE.InstancedMesh>(null);
    const playerPosition = useGame((state) => state.playerPosition);

    const foliageTexture = useTexture('./textures/foliage/birch.png');
    const perlinNoiseTexture = useTexture(
        './textures/perlinNoise/perlin.png',
        tileTexture,
    );
    const { nodes } = useGLTF(
        './models/trees/BirchFlat.glb',
    ) as unknown as GLTFResult;

    useEffect(() => {
        birchFoliageMaterial.alphaMap = foliageTexture;
        birchFoliageMaterial.needsUpdate = true;
    }, [foliageTexture]);

    useEffect(() => {
        birchUniforms.uPerlinNoiseTexture.value = perlinNoiseTexture;
    }, [perlinNoiseTexture]);

    // The GLB parks the canopy in a child node lifted above the trunk. All three
    // parts share one instance matrix here, so that offset has to move into the
    // geometry: the shader grounds an instance by its own origin, and a canopy
    // whose origin sat 3.3 units up would be snapped down onto the ground.
    const foliageGeometry = useMemo(() => {
        nodes.Foliage.updateMatrix();

        return nodes.Foliage.geometry
            .clone()
            .applyMatrix4(nodes.Foliage.matrix);
    }, [nodes]);

    // One transform list for the whole tree, written into all three meshes, so
    // canopy and trunk can never drift apart.
    const birches = useMemo(() => getBirchesAttributes(count), [count]);

    useLayoutEffect(() => {
        for (const ref of [foliageRef, barkRef, stripesRef]) {
            if (ref.current) writeInstanceMatrices(ref.current, birches);
        }
    }, [birches]);

    useFrame((_, delta) => {
        birchUniforms.uTime.value += delta;

        const moved = recycleInstances(
            birches,
            playerPosition.x,
            playerPosition.z,
        );

        if (!moved) return;

        for (const ref of [foliageRef, barkRef, stripesRef]) {
            if (ref.current) writeInstanceMatrices(ref.current, birches);
        }
    });

    return (
        <>
            <instancedMesh
                ref={foliageRef}
                args={[foliageGeometry, birchFoliageMaterial, birches.length]}
                frustumCulled={false}
                customDepthMaterial={birchFoliageDepthMaterial}
                castShadow
            />
            <instancedMesh
                ref={barkRef}
                args={[
                    nodes.Mesh_1007.geometry,
                    birchBarkMaterial,
                    birches.length,
                ]}
                frustumCulled={false}
                customDepthMaterial={birchBarkDepthMaterial}
                castShadow
                receiveShadow
            />
            <instancedMesh
                ref={stripesRef}
                args={[
                    nodes.Mesh_1007_1.geometry,
                    birchBarkDarkMaterial,
                    birches.length,
                ]}
                frustumCulled={false}
                customDepthMaterial={birchBarkDepthMaterial}
                castShadow
                receiveShadow
            />
        </>
    );
}

useGLTF.preload('./models/trees/BirchFlat.glb');
useTexture.preload('./textures/foliage/birch.png');
useTexture.preload('./textures/perlinNoise/perlin.png');

import { useTexture } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';

import useGame from '../../store/useGame';
import {
    GrassBladeMaterial,
    type GrassBladeMaterialImpl,
} from '../../materials/grassBladeMaterial';
import {
    BLADE_HEIGHT,
    BLADE_WIDTH,
    generateGrassBladesAttributes,
} from '../../utils/grass';

type Props = {
    positions: Array<[number, number, number]>;
};

export function GrassField({ positions, ...props }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const materialRef = useRef<GrassBladeMaterialImpl>(null);
    const bladeAlphaMap = useTexture('./textures/grassBladeSimplified.jpg');

    const playerPosition = useGame((state) => state.playerPosition);

    const { shadowColor } = useControls('Grass Shadow', {
        shadowColor: '#88a9c4',
    });

    const bladeGeometry = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(
            BLADE_WIDTH,
            BLADE_HEIGHT,
            1,
            1,
        );
        // Move the origin to the base of the blade so it plants on the terrain
        // surface instead of sinking its lower half below ground.
        geometry.translate(0, BLADE_HEIGHT / 2, 0);
        return geometry;
    }, []);

    const { count, matrices, bladeRandoms } = useMemo(
        () => generateGrassBladesAttributes(positions),
        [positions],
    );

    useEffect(() => {
        const mesh = meshRef.current;
        if (!mesh) return;

        for (let i = 0; i < count; i++) {
            mesh.setMatrixAt(i, matrices[i]);
        }
        mesh.instanceMatrix.needsUpdate = true;

        mesh.geometry.setAttribute(
            'aBladeRandom',
            new THREE.InstancedBufferAttribute(bladeRandoms, 1),
        );
    }, [count, matrices, bladeRandoms]);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.uShadowColor = new THREE.Color(shadowColor);
        }
    }, [shadowColor]);

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta;
            materialRef.current.uPlayerPosition.set(
                playerPosition.x,
                playerPosition.z,
            );
        }
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[bladeGeometry, undefined, count]}
            frustumCulled={false}
            receiveShadow
        >
            <grassBladeMaterial
                key={GrassBladeMaterial.key}
                ref={materialRef}
                uAlphaMap={bladeAlphaMap}
                //uCenterColor={centerColor}
                alphaToCoverage
                {...props}
            />
        </instancedMesh>
    );
}

useTexture.preload('./textures/grassBladeSimplified.jpg');

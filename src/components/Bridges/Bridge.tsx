import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { type ThreeElements, useFrame } from '@react-three/fiber';
import useGame from '../../store/useGame';
import { curveOffset, getElevation } from '../../utils/elevation';
import { useRef } from 'react';

type GLTFResult = {
    nodes: {
        [key: string]: THREE.Mesh;
    };
    materials: {
        [key: string]: THREE.Material;
    };
};

type Props = ThreeElements['group'];

export function Bridge(props: Props) {
    const { nodes, materials } = useGLTF(
        './models/bridge/Bridge.glb',
    ) as unknown as GLTFResult;
    const groupRef = useRef<THREE.Group>(null);

    const playerPosition = useGame((state) => state.playerPosition);

    useFrame(() => {
        const group = groupRef.current;
        if (!group) return;

        const x = group.position.x;
        const z = group.position.z;

        console.log(playerPosition.x, playerPosition.z);

        group.position.set(
            x,
            getElevation(x, z) -
                curveOffset(x, z, playerPosition.x, playerPosition.z),
            z,
        );
    });

    return (
        <group ref={groupRef} dispose={null} {...props}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bridge_Small.geometry}
                material={materials.Wood}
            />
        </group>
    );
}

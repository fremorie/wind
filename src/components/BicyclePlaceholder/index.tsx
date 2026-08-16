import { useGLTF } from '@react-three/drei';
import { type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

type GLTFResult = {
    nodes: {
        [key: string]: THREE.Mesh;
    };
    materials: {
        [key: string]: THREE.Material;
    };
};

export function BicyclePlaceholder(props: ThreeElements['group']) {
    const { nodes, materials } = useGLTF(
        './models/bicyclePlaceholder/BicyclePlaceholder.glb',
    ) as unknown as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube.geometry}
                material={nodes.Cube.material}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.WheelFront.geometry}
                material={materials.PlaceholderFront}
                position={[0, 0, 1.15]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.WheelRear.geometry}
                material={materials.PlaceholderRear}
                position={[0, 0, -1.15]}
            />
        </group>
    );
}

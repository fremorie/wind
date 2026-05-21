import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import grassFragmentShader from '../shaders/grass/fragment.glsl'
import grassVertexShader from '../shaders/grass/vertex.glsl'

export function Grass() {
    const materialRef = useRef<any>(null)

    const uniforms = useRef({
        uTime: new THREE.Uniform(0)
    })

    useFrame((state) => {
        uniforms.current.uTime = state.clock.elapsedTime
    })

    return (
        <>
            <mesh receiveShadow position-y={ 0 } rotation-x={ - Math.PI * 0.5 } scale={ 20 }>
                <planeGeometry />
                <meshStandardMaterial color="#A1DF50" />
            </mesh>
            <mesh receiveShadow castShadow position-y={0.35} scale={ [0.2, 0.7, 1] }>
                <planeGeometry />
                <CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial>
                    ref={materialRef}
                    baseMaterial={THREE.MeshStandardMaterial}
                    color="#79D021"
                    vertexShader={grassVertexShader}
                    fragmentShader={grassFragmentShader}
                    uniforms={uniforms.current}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    )
}
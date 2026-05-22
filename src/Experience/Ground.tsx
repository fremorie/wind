import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import {useTexture} from "@react-three/drei";
import {useRef} from "react";

import vertexShader from '../shaders/lake/vertex.glsl'
import fragmentShader from '../shaders/lake/fragment.glsl'

const PLANE_SIZE = 20;

export function Ground() {
    const lakeAlphaMap = useTexture('./lake_alpha.png')
    const uniforms = useRef({
        uAlphaMap: new THREE.Uniform(lakeAlphaMap),
        uPlaneSize: new THREE.Uniform(PLANE_SIZE),

        uColorWaterDeep: new THREE.Uniform(new THREE.Color('#002b3d')),
        uColorWaterSurface: new THREE.Uniform(new THREE.Color('#66a8ff')),
        uColorGrass: new THREE.Uniform(new THREE.Color('#A1DF50')),
    })

    return (
        <group>
            <mesh receiveShadow castShadow position-y={0} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 128, 128]}/>
                <CustomShaderMaterial
                    baseMaterial={THREE.MeshStandardMaterial}
                    color="#A1DF50"
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms.current}
                />
            </mesh>
        </group>
    )
}

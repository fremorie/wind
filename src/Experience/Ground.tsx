import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialVanilla from 'three-custom-shader-material/vanilla'
import {useTexture} from "@react-three/drei";
import {useMemo, useRef} from "react";

import vertexShader from '../shaders/lake/vertex.glsl'
import fragmentShader from '../shaders/lake/fragment.glsl'

const PLANE_SIZE = 20;

export function Ground() {
    const lakeAlphaMap = useTexture('./lake_alpha.png')

    const uniforms = useRef({
        uLakeAlphaMap: new THREE.Uniform(lakeAlphaMap),
        uPlaneSize: new THREE.Uniform(PLANE_SIZE),

        uColorWaterDeep: new THREE.Uniform(new THREE.Color('#002b3d')),
        uColorWaterSurface: new THREE.Uniform(new THREE.Color('#66a8ff')),
        uColorGrass: new THREE.Uniform(new THREE.Color('#A1DF50')),
        uColorSand: new THREE.Uniform(new THREE.Color('#ffe894')),
    })

    const depthMaterial = useMemo(() => new CustomShaderMaterialVanilla({
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader,
        uniforms: uniforms.current,
        depthPacking: THREE.RGBADepthPacking,
    }), [])

    return (
        <group>
            <mesh receiveShadow castShadow position-y={0} rotation-x={-Math.PI / 2} customDepthMaterial={depthMaterial}>
                <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 256, 256]}/>
                <CustomShaderMaterial
                    baseMaterial={THREE.MeshStandardMaterial}
                    color="#A1DF50"
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms.current}
                    alphaTest={0.01}
                />
            </mesh>
            <mesh position={[1, -0.2, 2]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[12, 12]}/>
                <meshPhysicalMaterial
                    transmission={1}
                    roughness={0.3}
                />
            </mesh>
        </group>
    )
}

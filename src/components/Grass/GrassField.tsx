import { shaderMaterial, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { extend, useFrame } from '@react-three/fiber'
// import { useControls } from 'leva'

import vertexShader from './shaders/grass/vertex.glsl'
import fragmentShader from './shaders/grass/fragment.glsl'

const GrassBladeMaterial = shaderMaterial(
    {
        uTime: 0,
        uCenterColor: new THREE.Color('#6f8f46'),
        uShadowColor: new THREE.Color('#d3d9de'),
        uAlphaMap: null,
    },
    vertexShader,
    fragmentShader,
    (material) => {
        // Real-time directional light shadows
        material.lights = true
        material.uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.lights,
            material.uniforms,
        ])
    }
)

extend({ GrassBladeMaterial })

const MIN_BLADE_SCALE = 3
const MAX_BLADE_SCALE = 5

const BLADE_WIDTH = 0.1
const BLADE_HEIGHT = 0.15

// Vertical subdivisions so the blade can curve along its length instead of
// tilting as a rigid strip.
const BLADE_HEIGHT_SEGMENTS = 6

type Props = {
    positions: Array<[number, number, number]>
}

export function GrassField({ positions, ...props }: Props) {
    const meshRef = useRef(null)
    const materialRef = useRef(null)
    const bladeAlphaMap = useTexture('./textures/grassBladeSimplified.jpg')

    // const { shadowColor } = useControls('Grass Shadow', {
    //     shadowColor: '#d3d9de',
    // })

    const bladeGeometry = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(
            BLADE_WIDTH,
            BLADE_HEIGHT,
            1,
            BLADE_HEIGHT_SEGMENTS
        )
        // Move the origin to the base of the blade so it plants on the terrain
        // surface instead of sinking its lower half below ground.
        geometry.translate(0, BLADE_HEIGHT / 2, 0)
        return geometry
    }, [])

    const { count, matrices, bladeRandoms } = useMemo(() => {
        const count = positions.length

        const bladeRandoms = new Float32Array(count)
        const matrices = []
        const matrix = new THREE.Matrix4()
        const position = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        const scale = new THREE.Vector3()

        for (let i = 0; i < count; i++) {
            const [x, y, z] = positions[i]
            position.set(x, y, z)

            const uniformScale =
                MIN_BLADE_SCALE +
                // eslint-disable-next-line
                Math.random() * (MAX_BLADE_SCALE - MIN_BLADE_SCALE)

            scale.set(uniformScale, uniformScale, uniformScale)

            matrix.compose(position, quaternion, scale)

            matrices.push(matrix.clone())

            // eslint-disable-next-line
            bladeRandoms[i] = Math.random()
        }

        return { count, matrices, bladeRandoms }
    }, [positions])

    useEffect(() => {
        const mesh = meshRef.current
        if (!mesh) return

        for (let i = 0; i < count; i++) {
            mesh.setMatrixAt(i, matrices[i])
        }
        mesh.instanceMatrix.needsUpdate = true

        mesh.geometry.setAttribute(
            'aBladeRandom',
            new THREE.InstancedBufferAttribute(bladeRandoms, 1)
        )
    }, [count, matrices, bladeRandoms])

    // useEffect(() => {
    //     if (materialRef.current) {
    //         materialRef.current.uShadowColor = new THREE.Color(shadowColor)
    //     }
    // }, [shadowColor])

    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta
        }
    })

    return (
        <instancedMesh
            ref={meshRef}
            args={[bladeGeometry, null, count]}
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
    )
}

useTexture.preload('./textures/grassBladeSimplified.jpg')

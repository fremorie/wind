import { useEffect, useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import grassVertexShader from '../shaders/grass/vertex.glsl'
import grassFragmentShader from '../shaders/grass/fragment.glsl'

type BladeData = { position: [number, number, number]; rotationY: number }

export function GrassBlades({ blades }: { blades: BladeData[] }) {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const [bladeAlphaMap, lakeAlphaMap] = useTexture(['./blade_alpha.jpg', './lake_alpha.png'])

    const uniforms = useRef({
        uTime: new THREE.Uniform(0),
        alphaMap: new THREE.Uniform(bladeAlphaMap),
        uLakeAlphaMap: new THREE.Uniform(lakeAlphaMap),
        uPlaneSize: new THREE.Uniform(20),
    })

    const { geo, mat } = useMemo(() => {
        const geo = new THREE.PlaneGeometry(0.1, 0.5)
        const mat = new CustomShaderMaterial({
            baseMaterial: THREE.MeshBasicMaterial,
            vertexShader: grassVertexShader,
            fragmentShader: grassFragmentShader,
            uniforms: uniforms.current,
            color: '#79D021',
            side: THREE.DoubleSide,
        })
        return { geo, mat }
    }, [])

    useEffect(() => {
        if (!meshRef.current) return
        const dummy = new THREE.Object3D()
        blades.forEach(({ position, rotationY }, i) => {
            dummy.position.set(...position)
            dummy.rotation.y = rotationY
            dummy.updateMatrix()
            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [blades])

    useFrame((state) => {
        uniforms.current.uTime.value = state.clock.elapsedTime
    })

    return (
        <instancedMesh
            ref={meshRef}
            args={[geo, mat, blades.length]}
            //receiveShadow
            //castShadow
        />
    )
}

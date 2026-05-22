import { useMemo, useRef } from 'react'
import { Instance, Instances, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import grassVertexShader from '../shaders/grass/vertex.glsl'
import grassFragmentShader from '../shaders/grass/fragment.glsl'
import * as React from 'react'

export function GrassBlades({ children }: { children: React.ReactNode }) {
    const bladeAlphaMap = useTexture('./blade_alpha.jpg');
    const uniforms = useRef({
        uTime: new THREE.Uniform(0),
        alphaMap: new THREE.Uniform(bladeAlphaMap),
    })

    useFrame((state) => {
        uniforms.current.uTime.value = state.clock.elapsedTime
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

    return (
        <Instances geometry={geo} material={mat} limit={10000}>
            {children}
        </Instances>
    )
}

export function GrassBlade(props: React.ComponentProps<typeof Instance>) {
    return <Instance {...props} />
}

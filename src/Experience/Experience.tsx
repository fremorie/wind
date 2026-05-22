import { Suspense, useEffect } from "react";
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { WindTurbine } from "./WindTurbine";
import { Box } from './Box';
import { Grass } from "./Grass";
import { useControls } from 'leva'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function Experience() {
    const { clearColor } = useControls({ clearColor: '#e1f6ff' })
    const { scene } = useThree()
    useEffect(() => {
        scene.background = new THREE.Color(clearColor)
    }, [clearColor])

    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight
                castShadow
                position={ [ 1, 2, 3 ] }
                intensity={ 4.5 }
                shadow-normalBias={0.04}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-camera-near={-20}
                shadow-camera-far={20}
                shadow-radius={10}
                shadow-mapSize={[2048, 2048]}
            />
            <ambientLight intensity={ 1.5 } />

            <Box position-y={-0.3}/>

            <Suspense fallback={null}>
                <Grass />
            </Suspense>


            <Suspense fallback={null}>
                <WindTurbine rotation={[0, Math.PI, 0]} position={[-7, 0, -5]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[7, 0, -3]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[0, 0, -8]} />
            </Suspense>
        </>
    )
}
import { OrbitControls, Stage } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Suspense } from 'react'

import { WindTurbine } from './WindTurbine'

export function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <Suspense fallback={
                <mesh position-y={0.5} scale={[2, 3, 2]}>
                    <boxGeometry args={[1, 1, 1, 2, 2, 2]}/>
                    <meshBasicMaterial wireframe color="red"/>
                </mesh>
            }>
                <Stage adjustCamera environment="city" shadows="contact">
                    <WindTurbine rotation={[0, Math.PI, 0]} />
                </Stage>
            </Suspense>
        </>
    )
}
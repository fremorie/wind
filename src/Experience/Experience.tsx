import { Suspense } from "react";
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { WindTurbine } from "./WindTurbine";

export function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 4.5 } shadow-normalBias={0.04}/>
            <ambientLight intensity={ 1.5 } />

            <mesh receiveShadow position-y={ 0} rotation-x={ - Math.PI * 0.5 } scale={ 20 }>
                <planeGeometry />
                <meshStandardMaterial color="greenyellow" />
            </mesh>

            <Suspense fallback={
                <mesh position-y={0.5} scale={[2, 3, 2]}>
                    <boxGeometry args={[1, 1, 1, 2, 2, 2]}/>
                    <meshBasicMaterial wireframe color="red"/>
                </mesh>
            }>
                <WindTurbine rotation={[0, Math.PI, 0]} position={[-5, 0, 3]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[1, 0, -1]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[5, 0, 3]} />
            </Suspense>
        </>
    )
}
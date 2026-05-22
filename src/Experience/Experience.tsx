import { Suspense } from "react";
import { OrbitControls, Sky } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { WindTurbine } from "./WindTurbine";
import { Grass } from "./Grass";

export function Experience() {
    return (
        <>
            <Perf position="top-left" />

            <Sky azimuth={1} inclination={0.6} distance={1000} />

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

            <Suspense fallback={null}>
                <Grass />
            </Suspense>


            <Suspense fallback={null}>
                <WindTurbine rotation={[0, Math.PI, 0]} position={[-5, 0, -5]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[5, 0, -4]} />
                <WindTurbine rotation={[0, Math.PI, 0]} position={[6, 0, 3]} />
            </Suspense>
        </>
    )
}
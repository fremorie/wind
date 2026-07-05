import { OrbitControls, Sky } from '@react-three/drei';

import { Terrain } from '../components/Terrain';

export function Experience() {
    return (
        <>
            <Sky />

            <OrbitControls makeDefault />

            <directionalLight
                castShadow
                position={[1, 2, 3]}
                intensity={4.5}
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
            <ambientLight intensity={1.5} />

            <axesHelper />

            <Terrain />
        </>
    );
}

import { useFrame } from '@react-three/fiber';

import { LAKE_CENTER, LAKE_SURFACE_LEVEL } from '../../utils/constants';
import {
    waterSurfaceDepthMaterial,
    waterSurfaceMaterial,
} from '../../materials/waterSurfaceMaterial';
import { waterSurfaceGeometry } from './geometry';
import { useWaterSurfaceControls } from './useWaterSurfaceControls';

export function WaterSurface() {
    useWaterSurfaceControls();

    useFrame((_, delta) => {
        waterSurfaceMaterial.uniforms.uTime.value += delta;
    });

    return (
        <mesh
            position={[LAKE_CENTER[0], LAKE_SURFACE_LEVEL, LAKE_CENTER[1]]}
            frustumCulled={false}
            material={waterSurfaceMaterial}
            customDepthMaterial={waterSurfaceDepthMaterial}
            geometry={waterSurfaceGeometry}
            receiveShadow
        />
    );
}

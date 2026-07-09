import { LAKE_CENTER } from '../../utils/constants';
import {
    waterSurfaceDepthMaterial,
    waterSurfaceMaterial,
} from '../../materials/waterSurfaceMaterial';
import { waterSurfaceGeometry } from './geometry';

export function WaterSurface() {
    return (
        <mesh
            position={[LAKE_CENTER[0], -1, LAKE_CENTER[1]]}
            frustumCulled={false}
            material={waterSurfaceMaterial}
            customDepthMaterial={waterSurfaceDepthMaterial}
            geometry={waterSurfaceGeometry}
            receiveShadow
        />
    );
}

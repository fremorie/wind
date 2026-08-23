import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

import { grassTrailFragmentShader, grassTrailVertexShader } from '../shaders';
import { TRAIL_AREA_SIZE, TRAIL_BRUSH_RADIUS } from '../utils/grassTrail';

export const GrassTrailMaterial = shaderMaterial(
    {
        uPrevious: null as THREE.Texture | null,

        uCenter: new THREE.Vector2(),
        uPreviousCenter: new THREE.Vector2(),
        uAreaSize: TRAIL_AREA_SIZE,

        uPlayerPosition: new THREE.Vector2(),
        uPreviousPlayerPosition: new THREE.Vector2(),
        uBrushRadius: TRAIL_BRUSH_RADIUS,

        uDecay: 1,
    },
    grassTrailVertexShader,
    grassTrailFragmentShader,
);

export type GrassTrailMaterialImpl = InstanceType<typeof GrassTrailMaterial>;

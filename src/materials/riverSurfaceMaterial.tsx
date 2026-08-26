import { shaderMaterial } from '@react-three/drei';
import {
    riverSurfaceFragmentShader,
    riverSurfaceVertexShader,
} from '../shaders';

export const RiverSurfaceMaterial = shaderMaterial(
    {
        uTime: 0,
    },
    riverSurfaceVertexShader,
    riverSurfaceFragmentShader,
);

import { shaderMaterial } from '@react-three/drei';
import {
    riverSurfaceFragmentShader,
    riverSurfaceVertexShader,
} from '../shaders';
import * as THREE from 'three';

export const RiverSurfaceMaterial = shaderMaterial(
    {
        uFresnelStrength: 0.83,
        uFresnelPower: 6.82,
        uFresnelColor: new THREE.Color('#fce4e4'),
    },
    riverSurfaceVertexShader,
    riverSurfaceFragmentShader,
);

export const riverSurfaceMaterial = new RiverSurfaceMaterial({
    transparent: true,
});

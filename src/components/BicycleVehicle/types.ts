import { type RapierContext } from '@react-three/rapier';
import type * as THREE from 'three';

export type VehicleController = ReturnType<
    RapierContext['world']['createVehicleController']
>;

export type BicycleGLTF = {
    nodes: {
        [key: string]: THREE.Mesh;
    };
    materials: {
        [key: string]: THREE.Material;
    };
};

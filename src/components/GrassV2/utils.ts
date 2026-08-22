import * as THREE from 'three';

import {
    GRASS_HEIGHT,
    GRASS_LODS,
    GRASS_PATCH_SIZE,
} from '../../utils/grassV2';
import { GrassV2Material } from '../../materials/grassV2Material';

export function createGrassGeometry(segments: number, grassBladeCount: number) {
    const VERTICES = (segments + 1) * 2;
    const indices = [];

    for (let i = 0; i < segments; ++i) {
        const vi = i * 2;
        indices[i * 12 + 0] = vi + 0;
        indices[i * 12 + 1] = vi + 1;
        indices[i * 12 + 2] = vi + 2;

        indices[i * 12 + 3] = vi + 2;
        indices[i * 12 + 4] = vi + 1;
        indices[i * 12 + 5] = vi + 3;

        const fi = VERTICES + vi;

        indices[i * 12 + 6] = fi + 2;
        indices[i * 12 + 7] = fi + 1;
        indices[i * 12 + 8] = fi + 0;

        indices[i * 12 + 9] = fi + 3;
        indices[i * 12 + 10] = fi + 1;
        indices[i * 12 + 11] = fi + 2;
    }

    const geo = new THREE.InstancedBufferGeometry();
    geo.instanceCount = grassBladeCount;
    geo.setIndex(indices);
    geo.boundingSphere = new THREE.Sphere(
        new THREE.Vector3(0, 0, 0),
        1 + GRASS_PATCH_SIZE * 2,
    );

    return geo;
}

export function createLodLevels() {
    return GRASS_LODS.map((level) => {
        const geometry = createGrassGeometry(level.segments, level.count);
        const material = new GrassV2Material();
        material.grassParams.set(
            level.segments,
            GRASS_PATCH_SIZE,
            level.grassWidth,
            GRASS_HEIGHT,
        );
        material.uGrassCount = level.count;

        return {
            geometry,
            material,
        };
    });
}

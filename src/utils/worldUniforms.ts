import { type Vector3 } from 'three';

import { terrainMaterial } from '../materials/terrainMaterial';
import { waterSurfaceMaterial } from '../materials/waterSurfaceMaterial';
import { treeMaterial } from '../materials/treeMaterial';
import { bushMaterial } from '../materials/bushMaterial';
import { foliageUniforms } from '../materials/foliage/foliageMaterials';
import { farmUniforms } from '../materials/farmMaterial';

export function updateWorldUniforms(playerPosition: Vector3) {
    terrainMaterial.uniforms.uPlayerPosition.value.set(
        playerPosition.x,
        playerPosition.z,
    );

    waterSurfaceMaterial.uniforms.uPlayerPosition.value.set(
        playerPosition.x,
        playerPosition.z,
    );

    treeMaterial.uniforms.uPlayerPosition.value.set(
        playerPosition.x,
        playerPosition.z,
    );

    bushMaterial.uniforms.uPlayerPosition.value.set(
        playerPosition.x,
        playerPosition.z,
    );

    foliageUniforms.uPlayerPosition.value.set(
        playerPosition.x,
        playerPosition.z,
    );

    farmUniforms.uPlayerPosition.value.set(playerPosition.x, playerPosition.z);
}

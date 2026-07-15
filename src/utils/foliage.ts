import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { alea } from 'seedrandom';

const BUSH_HEIGHT = 3;

export function createFoliage() {
    const rng = alea('foliage');
    const count = 100;
    const planes = [];

    for (let i = 0; i < count; i++) {
        const plane = new THREE.PlaneGeometry(0.8, 0.8);

        // Position
        const spherical = new THREE.Spherical(
            1 - Math.pow(rng(), BUSH_HEIGHT),
            Math.PI * 2 * rng(),
            Math.PI * rng(),
        );
        const position = new THREE.Vector3().setFromSpherical(spherical);

        plane.rotateZ(rng() * 9999);
        plane.rotateY(0);
        plane.translate(position.x, position.y, position.z);

        // Normal
        const normal = position.clone().normalize();
        const normalArray = new Float32Array(12);
        for (let j = 0; j < 4; j++) {
            const i3 = j * 3;

            const position = new THREE.Vector3(
                plane.attributes.position.array[i3],
                plane.attributes.position.array[i3 + 1],
                plane.attributes.position.array[i3 + 2],
            );

            const mixedNormal = position.lerp(normal, 0.85).normalize();

            normalArray[i3] = mixedNormal.x;
            normalArray[i3 + 1] = mixedNormal.y;
            normalArray[i3 + 2] = mixedNormal.z;
        }

        plane.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));

        // Save
        planes.push(plane);
    }

    // Merge all planes
    const finalGeometry = mergeGeometries(planes);
    finalGeometry.translate(0, BUSH_HEIGHT / 2 - 0.5, 0);

    return finalGeometry;
}

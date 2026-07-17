import * as THREE from 'three';

/** A placed copy of a mesh: where it stands, which way it faces, how big it is. */
export type Instance = {
    position: [x: number, y: number, z: number];
    /** Yaw about the Y axis, in radians. */
    rotation: number;
    scale: number;
};

const position = new THREE.Vector3();
const euler = new THREE.Euler();
const quaternion = new THREE.Quaternion();
const scale = new THREE.Vector3();

/**
 * Writes an instance's transform into `target` and returns it. `target` is
 * reused by callers across a loop, so copy out of it before the next call.
 */
export function composeInstanceMatrix(
    instance: Instance,
    target: THREE.Matrix4,
) {
    position.set(...instance.position);
    quaternion.setFromEuler(euler.set(0, instance.rotation, 0));
    scale.setScalar(instance.scale);

    return target.compose(position, quaternion, scale);
}

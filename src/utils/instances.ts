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

const scratchMatrix = new THREE.Matrix4();

/** Uploads every instance's transform into an InstancedMesh's matrix buffer. */
export function writeInstanceMatrices(
    mesh: THREE.InstancedMesh,
    instances: Instance[],
) {
    for (let i = 0; i < instances.length; i++) {
        mesh.setMatrixAt(i, composeInstanceMatrix(instances[i], scratchMatrix));
    }
    mesh.instanceMatrix.needsUpdate = true;
}

/** Long enough ago that the shader's growth has finished by the first frame. */
const FULLY_GROWN = -1000;

/** Per-instance spawn times, read by includes/growth.glsl. All start grown. */
export function createSpawnTimes(count: number) {
    return new THREE.InstancedBufferAttribute(
        new Float32Array(count).fill(FULLY_GROWN),
        1,
    );
}

/** Restarts one instance's growth, as of `time` on the shader's clock. */
export function stampSpawnTime(
    spawnTimes: THREE.InstancedBufferAttribute,
    index: number,
    time: number,
) {
    spawnTimes.setX(index, time);
    spawnTimes.needsUpdate = true;
}

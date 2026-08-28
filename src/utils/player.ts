import * as THREE from 'three';
import { type RefObject } from 'react';
import { type Camera } from '@react-three/fiber';

import { getElevation, getWaterDepth } from './elevation';

const WHEEL_RADIUS = 1.377 * 0.8; // model radius, times the <Bicycle> scale
let currentSpin = 0;

const PITCH_DELTA = 1;
const SPEED = 15;
const SPRINT_SPEED = 25;
const JOYSTICK_DEADZONE = 0.15;

const ACCELERATION = 8;
const DECELERATION = 12;

const STEER_SMOOTHING = 10;
let currentSteer = 0;

let currentSpeed = 0;

const WHEELBASE = 4.191 * 0.8; // front axle to rear axle, times the <Bicycle> scale
let currentYaw = 0.9;

const MAX_STEER = 0.35;
const STEER_GAIN = 1.5;

export const CRANK_GEAR_RATIO = 0.4;

const SPHERE_RADIUS = 1;

// Water collision: how far ahead of the centre the front wheel sits.
const BODY_RADIUS = 2;
const SHORE_EPSILON = 0.5;

const playerStep = new THREE.Vector2();
const probe = new THREE.Vector2();
const shoreNormal = new THREE.Vector2();

const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

const yawQuaternion = new THREE.Quaternion();
const pitchQuaternion = new THREE.Quaternion();

// Camera
const cameraTargetPosition = new THREE.Vector3(0, 0, 0);
const CAMERA_STIFFNESS = 10;

export function updatePlayerSpeed(
    playerDirection: RefObject<THREE.Vector3 | null>,
    sprinting: boolean,
    delta: number,
) {
    if (!playerDirection.current) return;

    const maxSpeed = sprinting ? SPRINT_SPEED : SPEED;
    const targetSpeed = playerDirection.current.length() * maxSpeed;
    const rate = targetSpeed > currentSpeed ? ACCELERATION : DECELERATION;

    currentSpeed += THREE.MathUtils.clamp(
        targetSpeed - currentSpeed,
        -rate * delta,
        rate * delta,
    );
}

export function updatePlayerDirection(
    playerDirection: THREE.Vector3,
    keys: {
        forward: boolean;
        backward: boolean;
        leftward: boolean;
        rightward: boolean;
    },
    joystick: THREE.Vector2,
) {
    let xDirection: number;
    let zDirection: number;

    const tilt = joystick.length();

    if (tilt > JOYSTICK_DEADZONE) {
        // Rescale [deadzone, 1] onto [0, 1] so the bike pulls away from a
        // standstill instead of jumping to deadzone speed. Dividing by tilt
        // turns the factor into a per-component scale.
        const scale =
            Math.min((tilt - JOYSTICK_DEADZONE) / (1 - JOYSTICK_DEADZONE), 1) /
            tilt;

        xDirection = joystick.y * scale;
        zDirection = joystick.x * scale;
    } else {
        xDirection = (keys.forward ? 1 : 0) + (keys.backward ? -1 : 0);
        zDirection = (keys.rightward ? 1 : 0) + (keys.leftward ? -1 : 0);
    }

    playerDirection.set(xDirection, 0, zDirection);

    // Keys give a length of 1 or sqrt(2), so this still normalizes them the way
    // it always did. The stick stays analog: shorter vector, slower ride.
    if (playerDirection.lengthSq() > 1) {
        playerDirection.normalize();
    }
}

export function updateCamera(
    camera: Camera,
    playerPosition: THREE.Vector3,
    delta: number,
) {
    const margin = 2;
    const groundAtCamera =
        getElevation(camera.position.x, camera.position.z) + margin;
    const desiredCameraY = playerPosition.y + 8;

    const cameraY = Math.max(desiredCameraY, groundAtCamera);

    cameraTargetPosition.set(
        playerPosition.x - 20,
        cameraY,
        playerPosition.z - 1,
    );

    camera.position.lerp(
        cameraTargetPosition,
        1 - Math.exp(-CAMERA_STIFFNESS * delta),
    );
    camera.lookAt(playerPosition);
}

// Puts `probe` where the front wheel ends up after `step`, in world xz.
function probeAhead(playerPosition: THREE.Vector3, step: THREE.Vector2) {
    const length = step.length();
    const reach = length === 0 ? 0 : BODY_RADIUS / length;

    probe.set(
        playerPosition.x + step.x * (1 + reach),
        playerPosition.z + step.y * (1 + reach),
    );
}

// Fills `shoreNormal` with the unit vector pointing towards dry land.
function getShoreNormal(x: number, z: number): boolean {
    const gradientX =
        getWaterDepth(x + SHORE_EPSILON, z) -
        getWaterDepth(x - SHORE_EPSILON, z);
    const gradientZ =
        getWaterDepth(x, z + SHORE_EPSILON) -
        getWaterDepth(x, z - SHORE_EPSILON);

    if (gradientX === 0 && gradientZ === 0) return false;

    shoreNormal.set(-gradientX, -gradientZ).normalize();

    return true;
}

// Trims `step` so the bike slides along the shoreline instead of entering it.
function resolveWaterCollision(
    playerPosition: THREE.Vector3,
    step: THREE.Vector2,
) {
    if (step.lengthSq() === 0) return;

    probeAhead(playerPosition, step);
    if (getWaterDepth(probe.x, probe.y) === 0) return;

    if (!getShoreNormal(probe.x, probe.y)) {
        step.set(0, 0);
        return;
    }

    const intoWater = step.dot(shoreNormal);
    // Cancel only the motion pushing into the water; leaving stays free.
    if (intoWater < 0) {
        step.addScaledVector(shoreNormal, -intoWater);
    }

    probeAhead(playerPosition, step);
    if (getWaterDepth(probe.x, probe.y) > 0) {
        step.set(0, 0);
    }
}

export function updatePlayerPosition(
    playerPosition: THREE.Vector3,
    playerMeshRef: RefObject<THREE.Mesh | null>,
    delta: number,
) {
    if (!playerMeshRef.current) return;

    const yaw = playerMeshRef.current.rotation.y;

    playerStep
        .set(Math.sin(yaw), Math.cos(yaw))
        .multiplyScalar(currentSpeed * delta);

    resolveWaterCollision(playerPosition, playerStep);

    playerPosition.x += playerStep.x;
    playerPosition.z += playerStep.y;

    playerPosition.y =
        getElevation(playerPosition.x, playerPosition.z) + SPHERE_RADIUS;
    playerMeshRef.current.position.copy(playerPosition);
}

export function getPlayerDirectionAngle(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
) {
    if (!playerMeshRef.current) return 0;

    if (playerDirection.current && playerDirection.current.lengthSq() > 0) {
        return Math.atan2(playerDirection.current.x, playerDirection.current.z);
    }

    return playerMeshRef.current.rotation.y;
}

export function getPlayerPitch(
    playerMeshRef: RefObject<THREE.Mesh | null>,
    playerPosition: THREE.Vector3,
) {
    if (!playerMeshRef.current) return 0;

    const forwardX = Math.sin(playerMeshRef.current.rotation.y);
    const forwardZ = Math.cos(playerMeshRef.current.rotation.y);

    const ahead = getElevation(
        playerPosition.x + forwardX * PITCH_DELTA,
        playerPosition.z + forwardZ * PITCH_DELTA,
    );

    const behind = getElevation(
        playerPosition.x - forwardX * PITCH_DELTA,
        playerPosition.z - forwardZ * PITCH_DELTA,
    );

    return -Math.atan2(ahead - behind, 2 * PITCH_DELTA);
}

export function updatePlayerPitchAndYaw(
    playerMeshRef: RefObject<THREE.Mesh | null>,
    playerPosition: THREE.Vector3,
    steerAngle: number,
    delta: number,
) {
    if (!playerMeshRef.current) return;

    const pitch = getPlayerPitch(playerMeshRef, playerPosition);

    const speed = currentSpeed;
    currentYaw += ((speed * Math.tan(steerAngle)) / WHEELBASE) * delta;
    yawQuaternion.setFromAxisAngle(UP, currentYaw);

    pitchQuaternion.setFromAxisAngle(RIGHT, pitch);

    playerMeshRef.current.quaternion.multiplyQuaternions(
        yawQuaternion,
        pitchQuaternion,
    );
}

export function getSteerAngle(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
) {
    if (!playerMeshRef.current) return 0;

    const targetSteerAngle = getPlayerDirectionAngle(
        playerDirection,
        playerMeshRef,
    );
    const currentSteerAngle = playerMeshRef.current.rotation.y;
    const difference = targetSteerAngle - currentSteerAngle;

    // [-PI, PI]
    const error = Math.atan2(Math.sin(difference), Math.cos(difference));

    return THREE.MathUtils.clamp(error * STEER_GAIN, -MAX_STEER, MAX_STEER);
}

export function updateSteerAngle(targetSteerAngle: number, delta: number) {
    currentSteer +=
        (targetSteerAngle - currentSteer) *
        (1 - Math.exp(-STEER_SMOOTHING * delta));

    return currentSteer;
}

export function updateWheelSpin(delta: number) {
    currentSpin = currentSpin - (currentSpeed * delta) / WHEEL_RADIUS;

    return currentSpin;
}

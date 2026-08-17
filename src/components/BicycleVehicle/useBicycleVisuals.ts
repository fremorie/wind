import { useRef } from 'react';
import * as THREE from 'three';

import {
    CRANK_GEAR_RATIO,
    FRONT_WHEELS,
    REAR_WHEELS,
    SUSPENSION_REST_LENGTH,
    SUSPENSION_SMOOTHING,
    SUSPENSION_TRAVEL,
} from './constants';
import { type VehicleController } from './types';
import { smoothTowards } from './utils';

function suspensionLength(
    controller: VehicleController,
    wheelIndex: number,
): number {
    return THREE.MathUtils.clamp(
        controller.wheelSuspensionLength(wheelIndex) ?? SUSPENSION_REST_LENGTH,
        0,
        SUSPENSION_REST_LENGTH + SUSPENSION_TRAVEL,
    );
}

export function useBicycleVisuals() {
    const bikeRef = useRef<THREE.Group>(null);
    const steeringRef = useRef<THREE.Group>(null);
    const frontWheelRef = useRef<THREE.Group>(null);
    const rearWheelRef = useRef<THREE.Group>(null);
    const crankRef = useRef<THREE.Group>(null);
    const pedalLeftRef = useRef<THREE.Group>(null);
    const pedalRightRef = useRef<THREE.Group>(null);

    const rideHeight = useRef(SUSPENSION_REST_LENGTH);

    function updateBicycleVisuals(
        controller: VehicleController,
        steerAngle: number,
        delta: number,
    ) {
        // A bicycle frame is rigid. Letting each wheel travel on its own would
        // pull the front wheel out of the fork, so the whole bike rides at the
        // average of the two suspensions instead and the wheels stay put in it.
        const target =
            (suspensionLength(controller, FRONT_WHEELS[0]) +
                suspensionLength(controller, REAR_WHEELS[0])) /
            2;

        rideHeight.current = smoothTowards(
            rideHeight.current,
            target,
            SUSPENSION_SMOOTHING,
            delta,
        );

        if (bikeRef.current) {
            bikeRef.current.position.y = -rideHeight.current;
        }

        if (steeringRef.current) {
            steeringRef.current.rotation.y = steerAngle;
        }

        // forward is +X and the axle is +Z, so rolling forwards is -Z rotation
        const frontSpin = -(controller.wheelRotation(FRONT_WHEELS[0]) ?? 0);
        const rearSpin = -(controller.wheelRotation(REAR_WHEELS[0]) ?? 0);

        if (frontWheelRef.current) {
            frontWheelRef.current.rotation.z = frontSpin;
        }

        if (rearWheelRef.current) {
            rearWheelRef.current.rotation.z = rearSpin;
        }

        const crankAngle = rearSpin * CRANK_GEAR_RATIO;

        if (crankRef.current) {
            crankRef.current.rotation.z = crankAngle;
        }

        // pedals stay level however far round the cranks have swung
        for (const pedal of [pedalLeftRef.current, pedalRightRef.current]) {
            if (pedal) {
                pedal.rotation.z = -crankAngle;
            }
        }
    }

    return {
        bikeRef,
        steeringRef,
        frontWheelRef,
        rearWheelRef,
        crankRef,
        pedalLeftRef,
        pedalRightRef,
        updateBicycleVisuals,
    };
}

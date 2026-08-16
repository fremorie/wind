import { useRef, type RefObject } from 'react';
import * as THREE from 'three';

import {
    FRONT_WHEELS,
    REAR_WHEELS,
    SUSPENSION_REST_LENGTH,
    SUSPENSION_SMOOTHING,
    SUSPENSION_TRAVEL,
    WHEELBASE_HALF,
} from './constants';
import { type VehicleController } from './types';
import { smoothTowards } from './utils';

type WheelVisual = {
    groupRef: RefObject<THREE.Group | null>;
    smoothedSuspension: { current: number };
    wheelIndex: number;
    offsetX: number;
    steered: boolean;
};

function updateWheelVisual(
    wheel: WheelVisual,
    controller: VehicleController,
    steerAngle: number,
    delta: number,
) {
    const group = wheel.groupRef.current;

    if (!group) {
        return;
    }

    const suspension = THREE.MathUtils.clamp(
        controller.wheelSuspensionLength(wheel.wheelIndex) ??
            SUSPENSION_REST_LENGTH,
        0,
        SUSPENSION_REST_LENGTH + SUSPENSION_TRAVEL,
    );

    wheel.smoothedSuspension.current = smoothTowards(
        wheel.smoothedSuspension.current,
        suspension,
        SUSPENSION_SMOOTHING,
        delta,
    );

    group.position.set(wheel.offsetX, -wheel.smoothedSuspension.current, 0);
    group.rotation.order = 'YXZ';
    group.rotation.set(
        0,
        wheel.steered ? steerAngle : 0,
        -(controller.wheelRotation(wheel.wheelIndex) ?? 0),
    );
}

export function useWheelVisuals() {
    const frontWheelRef = useRef<THREE.Group>(null);
    const rearWheelRef = useRef<THREE.Group>(null);
    const frontSuspension = useRef(SUSPENSION_REST_LENGTH);
    const rearSuspension = useRef(SUSPENSION_REST_LENGTH);

    function updateWheelVisuals(
        controller: VehicleController,
        steerAngle: number,
        delta: number,
    ) {
        updateWheelVisual(
            {
                groupRef: frontWheelRef,
                smoothedSuspension: frontSuspension,
                wheelIndex: FRONT_WHEELS[0],
                offsetX: WHEELBASE_HALF,
                steered: true,
            },
            controller,
            steerAngle,
            delta,
        );

        updateWheelVisual(
            {
                groupRef: rearWheelRef,
                smoothedSuspension: rearSuspension,
                wheelIndex: REAR_WHEELS[0],
                offsetX: -WHEELBASE_HALF,
                steered: false,
            },
            controller,
            steerAngle,
            delta,
        );
    }

    return { frontWheelRef, rearWheelRef, updateWheelVisuals };
}

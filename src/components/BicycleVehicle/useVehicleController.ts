import { useEffect, useRef, type RefObject } from 'react';
import { useRapier, type RapierRigidBody } from '@react-three/rapier';

import {
    FRICTION_SLIP,
    SIDE_FRICTION_STIFFNESS,
    SUSPENSION_COMPRESSION_RATIO,
    SUSPENSION_DIRECTION,
    SUSPENSION_RELAXATION_RATIO,
    SUSPENSION_REST_LENGTH,
    SUSPENSION_STIFFNESS,
    SUSPENSION_TRAVEL,
    TRACK_HALF,
    WHEELBASE_HALF,
    WHEEL_AXLE,
    WHEEL_COUNT,
    WHEEL_RADIUS,
} from './constants';
import { type VehicleController } from './types';
import { suspensionDampingFor } from './utils';

export function useVehicleController(
    chassisRef: RefObject<RapierRigidBody | null>,
) {
    const { world } = useRapier();
    const controllerRef = useRef<VehicleController | null>(null);

    useEffect(() => {
        const chassis = chassisRef.current;

        if (!chassis) {
            return;
        }

        const controller = world.createVehicleController(chassis);

        for (const x of [WHEELBASE_HALF, -WHEELBASE_HALF]) {
            for (const z of [TRACK_HALF, -TRACK_HALF]) {
                controller.addWheel(
                    { x, y: 0, z },
                    SUSPENSION_DIRECTION,
                    WHEEL_AXLE,
                    SUSPENSION_REST_LENGTH,
                    WHEEL_RADIUS,
                );
            }
        }

        const damping = suspensionDampingFor(SUSPENSION_STIFFNESS);

        for (let index = 0; index < WHEEL_COUNT; index++) {
            controller.setWheelSuspensionStiffness(index, SUSPENSION_STIFFNESS);
            controller.setWheelSuspensionCompression(
                index,
                SUSPENSION_COMPRESSION_RATIO * damping,
            );
            controller.setWheelSuspensionRelaxation(
                index,
                SUSPENSION_RELAXATION_RATIO * damping,
            );
            controller.setWheelMaxSuspensionTravel(index, SUSPENSION_TRAVEL);
            controller.setWheelFrictionSlip(index, FRICTION_SLIP);
            controller.setWheelSideFrictionStiffness(
                index,
                SIDE_FRICTION_STIFFNESS,
            );
        }

        controllerRef.current = controller;

        return () => {
            controllerRef.current = null;
            controller.free();
        };
    }, [world, chassisRef]);

    return controllerRef;
}

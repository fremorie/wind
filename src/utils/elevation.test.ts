import { describe, expect, it } from 'vitest';

import { curveOffset, getElevation } from './elevation';
import {
    CURVATURE,
    LAKE_CENTER,
    LAKE_SURFACE_LEVEL,
    uStrength,
} from './constants';

// getElevation is the CPU twin of getFinalElevation in
// shaders/includes/elevation.glsl. These tests pin the CPU side; the constants
// shared with the GPU are checked in glslParity.test.ts.
//
// The golden values below assume the default terrainUniforms (uRoadCenter,
// uLakeCenterX/Z). Those are mutable module state, so a change to LAKE_CENTER
// or the road centre will — correctly — break these.

// getBaseElevation is noise/2 in [-0.5, 0.5], squared (sign-preserving), then
// scaled by uStrength. So |base| <= uStrength * 0.5^2.
const MAX_BASE_ELEVATION = uStrength * 0.25;

const [lakeCenterX, lakeCenterZ] = LAKE_CENTER;

describe('curveOffset', () => {
    // Not a golden: this is the definition, asserted independently.
    it('is squared distance scaled by curvature', () => {
        const dx = 100 - 10;
        const dz = 50 - 20;

        expect(curveOffset(100, 50, 10, 20)).toBeCloseTo(
            (dx * dx + dz * dz) * CURVATURE,
            10,
        );
    });

    // This is why the player needs no curve correction while everything else
    // does: curveWorld is centred on the player, so their own offset is zero.
    it('is zero at the player position', () => {
        expect(curveOffset(123.4, -56.7, 123.4, -56.7)).toBe(0);
    });

    it('grows with the square of distance', () => {
        const near = curveOffset(10, 0, 0, 0);
        const far = curveOffset(20, 0, 0, 0);

        expect(far).toBeCloseTo(near * 4, 10);
    });
});

describe('getElevation', () => {
    it('carves the lake well below the water surface at its centre', () => {
        const elevation = getElevation(lakeCenterX, lakeCenterZ);

        expect(elevation).toBeLessThan(LAKE_SURFACE_LEVEL - 10);
    });

    it('rises back to terrain height far outside the lake', () => {
        const wellOutside = getElevation(lakeCenterX + 400, lakeCenterZ + 400);

        expect(Math.abs(wellOutside)).toBeLessThanOrEqual(MAX_BASE_ELEVATION);
    });

    it('stays within the base elevation bound away from lake and road', () => {
        for (let x = -200; x <= 200; x += 25) {
            for (let z = -200; z <= 200; z += 25) {
                expect(Math.abs(getElevation(x, z))).toBeLessThanOrEqual(
                    MAX_BASE_ELEVATION,
                );
            }
        }
    });

    // Characterisation values, recorded from this implementation. They detect
    // drift in the port; they do not prove it matches the GLSL.
    it.each([
        [140, 140, -0.7670590698435514], // on the road
        [140, 152, 0.5919929316839729], // just off the road
        [560, 140, -19.143907262304058], // lake centre
        [560, 205, 0.021687921546187483], // lake edge
        [-37.5, 212.25, 0.770677486454744], // negative x, open terrain
        [140, 300, -1.2850733897797157], // open terrain
    ])('getElevation(%s, %s) === %s', (x, z, expected) => {
        expect(getElevation(x, z)).toBe(expected);
    });
});

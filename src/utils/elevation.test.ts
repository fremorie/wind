import { describe, expect, it } from 'vitest';

import { curveOffset, getElevation, getFarmElevation } from './elevation';
import {
    FARM_BOUNDS,
    FARM_DEPTH,
    FARM_WIDTH,
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    uCurvature,
    uLakeSurfaceLevel,
    uSideRoadX,
    uStrength,
} from './constants';

// getElevation is the CPU twin of getFinalElevation in
// shaders/includes/elevation.glsl. These tests pin the CPU side; the GLSL both
// halves share is checked in shaders/worldSettings.test.ts.
//
// The golden values below assume the default terrainUniforms (uRoadCenter,
// uLakeCenterX/Z). Those are mutable module state, so a change to LAKE_CENTER
// or the road centre will — correctly — break these.

// getBaseElevation is noise/2 in [-0.5, 0.5], squared (sign-preserving), then
// scaled by uStrength. So |base| <= uStrength * 0.5^2.
const MAX_BASE_ELEVATION = uStrength * 0.25;

const [lakeCenterX, lakeCenterZ] = LAKE_CENTER;

// Mirrors terrainUniforms.uRoadCenter.z, the main road's centreline.
const ROAD_CENTER_Z = GRID_TOTAL_WIDTH / 2;

describe('curveOffset', () => {
    // Not a golden: this is the definition, asserted independently.
    it('is squared distance scaled by curvature', () => {
        const dx = 100 - 10;
        const dz = 50 - 20;

        expect(curveOffset(100, 50, 10, 20)).toBeCloseTo(
            (dx * dx + dz * dz) * uCurvature,
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

        expect(elevation).toBeLessThan(uLakeSurfaceLevel - 10);
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

    // The side road runs along z at a fixed x, so it is flattened where the
    // main road is not: a band in x rather than a band in z.
    it('flattens the terrain along the side road', () => {
        // Sampled clear of the main road, which crosses every x at ROAD_Z.
        const zs: number[] = [];
        for (let z = 0; z <= GRID_TOTAL_WIDTH; z += 10) {
            if (Math.abs(z - ROAD_CENTER_Z) > 30) zs.push(z);
        }

        const spread = (x: number) => {
            const elevations = zs.map((z) => getElevation(x, z));
            return Math.max(...elevations) - Math.min(...elevations);
        };

        expect(spread(uSideRoadX)).toBeLessThan(spread(uSideRoadX + 40) / 2);
        expect(spread(uSideRoadX)).toBeLessThan(spread(uSideRoadX - 40) / 2);
    });

    // The farm pad is the one region that must be perfectly level: the farm is
    // a single merged mesh, so it cannot follow a slope.
    describe('farm pad', () => {
        const [farmX, farmZ] = FARM_BOUNDS[0];

        it('is level everywhere inside the bounds', () => {
            const heights = [
                [farmX + 1, farmZ + 1],
                [farmX + FARM_DEPTH / 2, farmZ + FARM_WIDTH / 2],
                [farmX + FARM_DEPTH - 1, farmZ + FARM_WIDTH - 1],
                [farmX + 1, farmZ + FARM_WIDTH - 1],
            ].map(([x, z]) => getElevation(x, z));

            for (const height of heights) {
                expect(height).toBeCloseTo(heights[0], 10);
            }
        });

        it('sits at the height getFarmElevation reports', () => {
            expect(
                getElevation(farmX + FARM_DEPTH / 2, farmZ + FARM_WIDTH / 2),
            ).toBeCloseTo(getFarmElevation(), 10);
        });

        // Guards the mask: a pad that never returns to the terrain would mean
        // the falloff is not doing its job.
        it('gives way to open terrain beyond the falloff', () => {
            const near = getElevation(farmX - 60, farmZ + 40);
            const far = getElevation(farmX - 60, farmZ + 160);

            expect(near).not.toBeCloseTo(far, 3);
        });
    });

    // Characterisation values, recorded from this implementation. They detect
    // drift in the port; they do not prove it matches the GLSL.
    it.each([
        [140, 140, -0.10540970630189606], // on the main road
        [140, 152, 0.14876046872525944], // just off the main road
        [400, 60, -0.05840997075868071], // on the side road
        [430, 60, -0.8244391481087165], // just off the side road
        [840, 140, -19.972753068655347], // lake centre
        [840, 205, -0.4568767993281747], // lake edge
        [-37.5, 212.25, 0.770677486454744], // negative x, open terrain
        [140, 300, -1.2850733897797157], // open terrain
    ])('getElevation(%s, %s) === %s', (x, z, expected) => {
        expect(getElevation(x, z)).toBe(expected);
    });
});

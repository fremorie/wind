import { describe, expect, it } from 'vitest';

import { curveOffset, getElevation } from './elevation';
import {
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    uCurvature,
    uLakeSurfaceLevel,
    uRiverAmplitude,
    uRiverAngle,
    uRiverCenterZ,
    uRiverDepth,
    uRiverWaviness,
    uRiverWidth,
    uSideRoadX,
    uStrength,
} from './constants';

// getElevation is the CPU twin of getFinalElevation in
// shaders/includes/elevation.glsl. These tests pin the CPU side; the GLSL both
// halves share is checked in shaders/worldSettings.test.ts.
//
// The golden values below assume the road centre and LAKE_CENTER below, so a
// change to either will — correctly — break these.

// getBaseElevation is noise/2 in [-0.5, 0.5], squared (sign-preserving), then
// scaled by uStrength. So |base| <= uStrength * 0.5^2.
const MAX_BASE_ELEVATION = uStrength * 0.25;

const [lakeCenterX, lakeCenterZ] = LAKE_CENTER;

// Mirrors ROAD_CENTER_Z in elevation.ts, the main road's centreline.
const ROAD_CENTER_Z = GRID_TOTAL_WIDTH / 2;

// Independent transcription of the river band, so scans can steer clear of it.
// uRiverPeriod is far larger than any region scanned here, so the wrap the
// implementation does is not needed.
function distanceToRiver(x: number, z: number): number {
    const c = Math.cos(uRiverAngle);
    const s = Math.sin(uRiverAngle);
    const alongStream = c * x + s * z;
    const acrossStream = -s * x + c * z;
    const centre =
        uRiverCenterZ +
        uRiverAmplitude * Math.sin(alongStream * uRiverWaviness);

    return Math.abs(acrossStream - centre);
}

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

    it('stays within the base elevation bound away from lake, road and river', () => {
        for (let x = -200; x <= 200; x += 25) {
            for (let z = -200; z <= 200; z += 25) {
                if (distanceToRiver(x, z) < uRiverWidth) continue;

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

    // The river runs at an angle, so its points are easiest to name in river
    // space (along-stream, across-stream) and rotate back into the world.
    const riverPoint = (alongStream: number, acrossStream: number) => {
        const c = Math.cos(uRiverAngle);
        const s = Math.sin(uRiverAngle);
        const centre =
            uRiverCenterZ +
            uRiverAmplitude * Math.sin(alongStream * uRiverWaviness);
        const pz = centre + acrossStream;

        return [c * alongStream - s * pz, s * alongStream + c * pz] as const;
    };

    // Sampled clear of both roads: where a road crosses the river the road wins
    // (getElevation scales the river mix by 1 - roadMask), so the bed is only
    // carved to the full depth away from them. alongStream 500 lands on the
    // side road, which is why it is not among the samples.
    it('flattens the riverbed to exactly uRiverDepth on the centreline', () => {
        for (const alongStream of [-200, 0, 137, 300]) {
            const [x, z] = riverPoint(alongStream, 0);

            expect(getElevation(x, z)).toBeCloseTo(uRiverDepth, 10);
        }
    });

    // uRiverFalloff === uRiverWidth, so the mask reaches 0 at the full width.
    it('leaves terrain beyond the river bank untouched', () => {
        for (const alongStream of [-200, 0, 137, 500]) {
            const [x, z] = riverPoint(alongStream, uRiverWidth + 5);

            // Clear of the lake and both roads, so this is open noise terrain.
            expect(Math.abs(getElevation(x, z))).toBeLessThanOrEqual(
                MAX_BASE_ELEVATION,
            );
        }
    });

    // Characterisation values, recorded from this implementation. They detect
    // drift in the port; they do not prove it matches the GLSL.
    it.each([
        [140, 140, -0.10708793939739947], // main road, crossing the river
        [140, 152, -4.377535808652268], // just off the road, river edge
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

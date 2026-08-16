import { describe, expect, it } from 'vitest';
import { alea } from 'seedrandom';

import { isNearRoad, scatterPositionsSpaced } from './foliageField';
import { GRID_TOTAL_DEPTH, GRID_TOTAL_WIDTH } from './constants';

// The tile wraps, so spacing has to be measured the way the world sees it.
function toroidalDistance(
    [ax, az]: [number, number],
    [bx, bz]: [number, number],
): number {
    const dx = Math.abs(ax - bx);
    const dz = Math.abs(az - bz);

    return Math.hypot(
        Math.min(dx, GRID_TOTAL_DEPTH - dx),
        Math.min(dz, GRID_TOTAL_WIDTH - dz),
    );
}

function minSpacing(points: Array<[number, number]>): number {
    let min = Infinity;

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            min = Math.min(min, toroidalDistance(points[i], points[j]));
        }
    }

    return min;
}

describe('scatterPositionsSpaced', () => {
    it('returns exactly the count asked for', () => {
        for (const count of [1, 10, 50, 200]) {
            expect(scatterPositionsSpaced(count, alea('count')).length).toBe(
                count,
            );
        }
    });

    it('keeps every point inside the tile and off the road', () => {
        for (const [x, z] of scatterPositionsSpaced(200, alea('bounds'))) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThan(GRID_TOTAL_DEPTH);
            expect(z).toBeGreaterThanOrEqual(0);
            expect(z).toBeLessThan(GRID_TOTAL_WIDTH);
            expect(isNearRoad(z)).toBe(false);
        }
    });

    it('spaces points out far more evenly than a uniform scatter', () => {
        // The radius is derived and can shrink, so pin the property, not the value.
        const points = scatterPositionsSpaced(100, alea('spacing'));
        const tileSpan = Math.min(GRID_TOTAL_DEPTH, GRID_TOTAL_WIDTH);

        expect(minSpacing(points)).toBeGreaterThan(tileSpan / 50);
    });

    it('is deterministic for a given seed, and differs between seeds', () => {
        const a = scatterPositionsSpaced(40, alea('birch'));
        const b = scatterPositionsSpaced(40, alea('birch'));
        const c = scatterPositionsSpaced(40, alea('maple'));

        expect(a).toEqual(b);
        expect(a).not.toEqual(c);
    });
});

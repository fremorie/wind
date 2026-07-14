import { describe, expect, it } from 'vitest';

import * as constants from './constants';
// Imported through vite-plugin-glsl, exactly as the shaders do, so this test
// reads the same text the GPU is compiled from.
import worldSettings from '../shaders/includes/worldSettings.glsl';

// The terrain exists twice: once on the GPU (shaders/includes/elevation.glsl,
// via worldSettings.glsl) and once on the CPU (utils/elevation.ts, via
// constants.ts). Anything placed with the CPU copy — the player, the cow, the
// sign — sits on a surface the GPU draws. If the two copies disagree, they
// float.
//
// The algorithms can only be compared by executing both, which needs a GPU.
// The *constants* are plain text, so they can be compared here, for free. This
// is what the `/* Mirrored from GLSL! */` comment in constants.ts is asking for.

/** Matches `const float uName = -1.23;`, capturing the name and the value. */
const GLSL_FLOAT_CONST = /const\s+float\s+(\w+)\s*=\s*(-?\d+(?:\.\d*)?)\s*;/g;

function parseGlslFloatConstants(source: string): Map<string, number> {
    const parsed = new Map<string, number>();
    for (const [, name, value] of source.matchAll(GLSL_FLOAT_CONST)) {
        parsed.set(name, Number(value));
    }
    return parsed;
}

const glslConstants = parseGlslFloatConstants(worldSettings);

// Convention: a `uSomething` export in constants.ts is a mirror of a GLSL
// const. Everything else in that file is SCREAMING_CASE and CPU-only.
const mirroredTsConstants = Object.entries(constants).filter(([name]) =>
    /^u[A-Z]/.test(name),
) as Array<[string, number]>;

describe('worldSettings.glsl <-> constants.ts', () => {
    // Without this, a regex that silently stops matching would make every
    // assertion below vacuously true, and the file would keep passing while
    // checking nothing at all.
    it('parses the GLSL constants (guards against a vacuous suite)', () => {
        expect(glslConstants.size).toBeGreaterThanOrEqual(11);
        expect(mirroredTsConstants.length).toBeGreaterThanOrEqual(11);
    });

    it.each([...glslConstants])(
        'GLSL declares %s = %s, and constants.ts agrees',
        (name, glslValue) => {
            expect(constants).toHaveProperty(name);
            expect((constants as Record<string, unknown>)[name]).toBe(
                glslValue,
            );
        },
    );

    // The reverse direction: catches a `uFoo` added to constants.ts that the
    // shader never learned about.
    it.each(mirroredTsConstants)(
        'constants.ts exports %s, and the GLSL declares it too',
        (name) => {
            expect([...glslConstants.keys()]).toContain(name);
        },
    );
});

describe('constants.ts internal duplicates', () => {
    // These pairs are the same physical quantity written twice: once for CPU
    // consumers, once as the GLSL mirror. Nothing but this test keeps them
    // equal.
    it.each([
        ['CURVATURE', constants.CURVATURE, 'uCurvature', constants.uCurvature],
        [
            'LAKE_RADIUS',
            constants.LAKE_RADIUS,
            'uLakeRadius',
            constants.uLakeRadius,
        ],
        [
            'LAKE_DEPTH',
            constants.LAKE_DEPTH,
            'uLakeDepth',
            constants.uLakeDepth,
        ],
        [
            'BEACH_WIDTH',
            constants.BEACH_WIDTH,
            'uBeachWidth',
            constants.uBeachWidth,
        ],
        [
            'LAKE_SURFACE_LEVEL',
            constants.LAKE_SURFACE_LEVEL,
            'uLakeSurfaceLevel',
            constants.uLakeSurfaceLevel,
        ],
    ])('%s === %s', (_nameA, valueA, _nameB, valueB) => {
        expect(valueA).toBe(valueB);
    });
});

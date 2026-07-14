import { describe, expect, it } from 'vitest';

import { simplexNoise2d } from './simplexNoise';

// simplexNoise.ts is a hand port of shaders/includes/simplexNoise2d.glsl.
// These tests cannot see the GLSL — they pin the TS side so it cannot drift on
// its own. See glslParity.test.ts for what *is* checked across the language
// boundary.

describe('simplexNoise2d', () => {
    it('is deterministic', () => {
        expect(simplexNoise2d(12.34, -56.78)).toBe(
            simplexNoise2d(12.34, -56.78),
        );
    });

    it('stays within [-1, 1]', () => {
        for (let z = -6; z <= 6; z += 0.25) {
            for (let x = -6; x <= 6; x += 0.25) {
                const value = simplexNoise2d(x, z);
                expect(Number.isFinite(value)).toBe(true);
                expect(Math.abs(value)).toBeLessThanOrEqual(1);
            }
        }
    });

    // Gradient noise is smooth everywhere, so a bound on the step-to-step
    // change is a cheap structural check: it catches a wrong triangle
    // selection, a broken gradient, or a torn lattice, all of which show up as
    // a jump of order 1.
    //
    // It does NOT catch a wrong mod() sign convention, despite what you might
    // expect from the port's comment. permute(x) is periodic mod 299 — since
    // 44 * 299 = 0 (mod 299), permute(x) === permute(x + 299) — so feeding it
    // -3 or 296 gives the same answer. The mod() only keeps magnitudes small
    // for float32 on the GPU; in float64 its sign is unobservable here.
    it('is continuous across negative and positive coordinates', () => {
        const step = 0.01;
        // Measured max adjacent delta over this range is ~0.066; a torn
        // lattice jumps by order 1.
        const maxExpectedDelta = 0.15;

        for (let z = -6; z <= 6; z += 0.25) {
            let previous = simplexNoise2d(-6, z);
            for (let x = -6; x <= 6; x += step) {
                const value = simplexNoise2d(x, z);
                expect(Math.abs(value - previous)).toBeLessThan(
                    maxExpectedDelta,
                );
                previous = value;
            }
        }
    });

    // Characterisation values, recorded from this implementation. They do not
    // prove the port is *correct* — only that it has not changed. If you
    // deliberately change the noise, regenerate them and change the GLSL too.
    it.each([
        [0.5, -0.5, -0.0713480047723876],
        [12.34, -56.78, 0.14443637724132544],
        [-3.7, 8.1, 0.02235991490289114],
        [100.001, 100.001, 0.5245597733601511],
    ])('simplexNoise2d(%s, %s) === %s', (x, y, expected) => {
        expect(simplexNoise2d(x, y)).toBe(expected);
    });

    // Lattice points are exactly zero in gradient noise. Kept separate from the
    // table above so nobody reads "=== 0" as a meaningful golden value.
    it('returns exactly 0 at the lattice origin', () => {
        expect(simplexNoise2d(0, 0)).toBe(0);
    });
});

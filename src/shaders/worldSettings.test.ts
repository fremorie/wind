import { describe, expect, it } from 'vitest';

import * as shaders from './index';
import { withWorldSettings, worldSettingsGlsl } from './worldSettings';
import { WORLD_SETTINGS } from '../utils/constants';

// The shaders only compile on the GPU at runtime, where a bad constant is a
// black screen rather than a failed build. So the generated text is checked
// here, before it gets there.

const settings = Object.entries(WORLD_SETTINGS);

/** Matches `const float uName = -1.23;`, capturing the name and the literal. */
const GLSL_FLOAT_CONST = /^const float (\w+) = (\S+);$/gm;

const declarations = new Map(
    [...worldSettingsGlsl.matchAll(GLSL_FLOAT_CONST)].map(
        ([, name, literal]) => [name, literal],
    ),
);

describe('worldSettingsGlsl', () => {
    // Without this, a regex that stopped matching would make the rest vacuous.
    it('declares one constant per setting (guards against a vacuous suite)', () => {
        expect(declarations.size).toBe(settings.length);
    });

    it.each(settings)('declares %s, carrying the value %s', (name, value) => {
        expect(Number(declarations.get(name))).toBe(value);
    });

    // `const float x = 10;` does not compile in GLSL.
    it.each(settings)('writes %s as a float literal, not an int', (name) => {
        expect(declarations.get(name)).toMatch(/[.e]/);
    });
});

describe('the shader barrel', () => {
    const exported = Object.entries(shaders);

    it('exports shaders (guards against a vacuous suite)', () => {
        expect(exported.length).toBeGreaterThanOrEqual(12);
    });

    // The point of the barrel: a new shader cannot skip its constants.
    it.each(exported)(
        'prefixes %s with the world settings',
        (_name, source) => {
            expect(source).toContain(worldSettingsGlsl);
        },
    );
});

describe('withWorldSettings', () => {
    it('puts the constants before the shader that reads them', () => {
        const prefixed = withWorldSettings('void main() {}');

        expect(prefixed.indexOf(worldSettingsGlsl)).toBeLessThan(
            prefixed.indexOf('void main() {}'),
        );
    });
});

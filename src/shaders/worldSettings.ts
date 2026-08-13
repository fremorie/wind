import { WORLD_SETTINGS } from '../utils/constants';

/**
 * GLSL has no implicit int-to-float conversion, so `const float x = 10;` is a
 * compile error: `10` has to become `10.0`. String() rather than toFixed() so
 * the literal round-trips to the same double at any magnitude.
 */
function toGlslFloat(value: number): string {
    const literal = String(value);

    return /[.e]/.test(literal) ? literal : `${literal}.0`;
}

/** WORLD_SETTINGS as a block of GLSL declarations. */
export const worldSettingsGlsl = Object.entries(WORLD_SETTINGS)
    .map(([name, value]) => `const float ${name} = ${toGlslFloat(value)};`)
    .join('\n');

/**
 * Prefixes a shader with the world settings. Applied once per shader in
 * ./index.ts -- import from there, not from the .glsl file.
 */
export function withWorldSettings(source: string): string {
    return `// Generated from WORLD_SETTINGS in utils/constants.ts\n${worldSettingsGlsl}\n\n${source}`;
}

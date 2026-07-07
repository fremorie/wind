#include <common>
#include <shadowmap_pars_vertex>

uniform float uTime;
uniform float uPositionFrequency;
uniform vec2 uPlayerPosition;
uniform float uCurvature;
uniform float uStrength;
uniform vec3 uRoadCenter;
uniform float uRoadWidth;
uniform float uRoadAmplitude;
uniform float uRoadWaviness;
uniform float uRoadFalloff;
uniform float uTileSize;

attribute float aBladeRandom;

varying vec2 vUv;

#include "../includes/perlinNoise.glsl"
#include "../includes/elevation.glsl"
#include "../includes/curveWorld.glsl"

const vec2 WIND_DIRECTION = vec2(0.8, -0.5);
const float WIND_SPEED = 0.7;
const float WIND_FREQUENCY = 0.1;
const float WIND_STRENGTH = 0.1;

// How far the tip is shoved to the side as the player drives through.
const float TRAIL_PUSH = 0.65;
// Radius around the player within which grass bends.
const float TRAIL_RADIUS = 3.0;

void main() {
    vec3 instanceWorldOrigin = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 windSamplePosition =
        instanceWorldOrigin.xz * WIND_FREQUENCY - WIND_DIRECTION * uTime * WIND_SPEED;

    // Blade's ground position in world space
    vec2 base = instanceWorldOrigin.xz;
    // Move tiles around the player
    vec2 wrappedTile =
        mod(base - uPlayerPosition + uTileSize * 0.5, uTileSize) - uTileSize * 0.5 + uPlayerPosition;
    vec2 shift = wrappedTile - base;

    // Wind gusts
    float gust = cnoise(vec3(windSamplePosition, 0.0));
    float flutter = cnoise(
        vec3(windSamplePosition * 3.0 + aBladeRandom * 10.0, uTime * 0.6 + aBladeRandom)
    );

    // Each blade bends a little more or less than its neighbours
    float bladeStrength = 0.8 + aBladeRandom * 0.6;
    float windAmount = (gust + flutter * 0.3) * bladeStrength;

    float windMultiplier = smoothstep(0.0, 1.0, uv.y);

    vec3 localPosition = position;
    localPosition.x += windAmount * windMultiplier * WIND_STRENGTH;

    // Always face the camera
    float facingAngle = atan(cameraPosition.x - wrappedTile.x, cameraPosition.z - wrappedTile.y);
    float sinAngle = sin(facingAngle);
    float cosAngle = cos(facingAngle);
    localPosition = vec3(
        localPosition.x * cosAngle + localPosition.z * sinAngle,
        localPosition.y,
        -localPosition.x * sinAngle + localPosition.z * cosAngle
    );

    // No grass on the road
    float roadMask = getRoadMask(wrappedTile);
    localPosition *= (1.0 - roadMask);

    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(localPosition, 1.0);
    worldPosition.xz += shift;

    // Bend the tip away from the player while they're driving through it.
    vec2 fromPlayer = wrappedTile - uPlayerPosition;
    float distToPlayer = length(fromPlayer);
    float bend = 1.0 - smoothstep(0.0, TRAIL_RADIUS, distToPlayer);
    vec2 leanDir = distToPlayer > 0.001 ? fromPlayer / distToPlayer : vec2(0.0);
    worldPosition.xz += leanDir * bend * windMultiplier * TRAIL_PUSH;

    // Terrain elevation
    float elevation = getFinalElevation(wrappedTile);
    worldPosition.y += elevation;

    // Curve world
    worldPosition.xyz = curveWorld(worldPosition.xyz, wrappedTile, uPlayerPosition, uCurvature);

    vec4 viewPosition = viewMatrix * worldPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    // Varyings
    vUv = uv;

    // Feed world position + normal into three's shadow chunk
    vec3 transformedNormal = normalMatrix * normal;
    #include <shadowmap_vertex>
}

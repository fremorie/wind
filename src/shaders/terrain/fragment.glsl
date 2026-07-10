uniform vec3 uColorGrass;
uniform vec3 uColorDirt;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform float uLakeRadius;
uniform float uBeachWidth;
uniform vec3 uColorWaterShallow;
uniform vec3 uColorWaterDeep;
uniform float uLakeDepth;
uniform float uLakeSurfaceLevel;

varying vec3 vPosition;
varying float vUpDot;
varying float vRoadMask;

#include "../includes/simplexNoise2d.glsl"

void main() {
    // Color
    vec3 color = vec3(uColorGrass);
    color = mix(color, uColorDirt, vRoadMask);

    // Beach
    float distanceToLake = length(vPosition.xz - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine = uLakeRadius + uBeachWidth;
    float sandMask = smoothstep(grassLine, grassLine - 5.0, distanceToLake);
    color = mix(color, uColorDirt, sandMask);

    // Water
    float lakeRegion = smoothstep(uLakeRadius, uLakeRadius - 0.5, distanceToLake);
    float submerged = smoothstep(uLakeSurfaceLevel, uLakeSurfaceLevel - 0.5, vPosition.y);
    float waterMask = lakeRegion * submerged;
    float waterMix = smoothstep(uLakeSurfaceLevel, -uLakeDepth * 0.4, vPosition.y);
    vec3 waterColor = mix(uColorWaterShallow, uColorWaterDeep, waterMix);
    color = mix(color, waterColor, waterMask);

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
}
uniform float uPositionFrequency;
uniform float uStrength;
uniform vec2 uPlayerPosition;
uniform float uCurvature;
uniform vec3 uRoadCenter;
uniform float uRoadWidth;
uniform float uRoadAmplitude;
uniform float uRoadWaviness;
uniform float uRoadFalloff;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform float uLakeRadius;
uniform float uBeachWidth;
uniform float uLakeDepth;

#include "../includes/curveWorld.glsl"
#include "../includes/elevation.glsl"

void main() {
    mat4 worldMatrix = modelMatrix * instanceMatrix;
    vec3 instanceWorldOrigin = (worldMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 groundXZ = instanceWorldOrigin.xz;

    // Elevation
    float elevation = getFinalElevation(groundXZ);
    vec2 toPlayer = groundXZ - uPlayerPosition;
    float curve = dot(toPlayer, toPlayer) * uCurvature;
    float surfaceY = elevation - curve;

    float worldScale = length(worldMatrix[0].xyz);

    // Final position
    float worldYOffset = surfaceY - instanceWorldOrigin.y;
    csm_Position.y += worldYOffset / worldScale;
}

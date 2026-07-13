uniform vec2 uPlayerPosition;
uniform vec3 uRoadCenter;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

varying vec3 vPosition;
varying float vUpDot;
varying float vRoadMask;

#include "../includes/worldSettings.glsl"
#include "../includes/curveWorld.glsl"
#include "../includes/elevation.glsl"

void main() {
    // Sample the noise field in world space so neighbouring chunks line up
    // seamlessly (modelMatrix carries this chunk's offset per draw call).
    vec2 worldUV = (modelMatrix * vec4(csm_Position, 1.0)).xz;

    // Road
    float roadMask = getRoadMask(worldUV);

    // Neighbours
    float shift = 0.01;
    vec3 positionA = csm_Position + vec3(shift, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, - shift);

    // Elevation
    float elevation = getFinalElevation(worldUV);
    csm_Position.y += elevation;
    positionA.y = getFinalElevation(worldUV + vec2(shift, 0.0));
    positionB.y = getFinalElevation(worldUV + vec2(0.0, - shift));

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // Varyings
    vPosition = csm_Position;
    vPosition.xz = worldUV;
    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
    vRoadMask = roadMask;

    // Curve world
    csm_Position = curveWorld(csm_Position, worldUV, uPlayerPosition, uCurvature);
}
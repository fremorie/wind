#include "../includes/simplexNoise2d.glsl"

float getElevation(vec2 position) {
    float elevation = 0.0;
    elevation += simplexNoise2d(position * uPositionFrequency) / 2.0;

    float elevationSign = sign(elevation);
    elevation = elevationSign * pow(abs(elevation), 2.0);
    elevation *= uStrength;

    return elevation;
}

float roadCenterZ(float x) {
    return uRoadCenter.z + uRoadAmplitude * sin(x * uRoadWaviness);
}

float getRoadMask(vec2 position) {
    float distanceToRoad = abs(position.y - roadCenterZ(position.x));
    float roadMask = 1.0 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    return roadMask;
}

float getLakeMask(vec2 position) {
    vec2 lakeCenter = vec2(110.0, 110.0);
    float lakeRadius = 60.0;
    float beachWidth = 45.0;
    float dist = length(position - lakeCenter);

    // SDF: 1 inside the lake, 0 outside
    return smoothstep(lakeRadius, lakeRadius - beachWidth, dist);
}

float getRoadElevation(vec2 position) {
    return getElevation(
        vec2(position.x, roadCenterZ(position.x))
    );
}

float getFinalElevation(vec2 position) {
    float elevation = mix(
        getElevation(position),
        getRoadElevation(position),
        getRoadMask(position)
    );

    float lakeFloorY = -15.0;
    elevation = mix(elevation, lakeFloorY, getLakeMask(position));

    return elevation;
}
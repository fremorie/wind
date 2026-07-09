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

    // No roads under water!
    float distToLake = length(position - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine  = uLakeRadius + uBeachWidth;
    roadMask *= smoothstep(grassLine - 10.0, grassLine, distToLake);

    return roadMask;
}

float getLakeDepth(vec2 position) {
    vec2 lakeCenter = vec2(uLakeCenterX, uLakeCenterZ);
    float dist = length(position - lakeCenter);
    float depth = uLakeDepth * (1.0 - smoothstep(0.0, uLakeRadius, dist));

    return depth;
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

    float lakeDepth = getLakeDepth(position);

    elevation -= lakeDepth;

    return elevation;
}
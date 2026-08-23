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

float sideRoadCenterX(float z) {
    return uSideRoadX + sin(z * uRoadWaviness * 0.5);
}

float getSideRoadMask(vec2 position) {
    float distanceToRoad = abs(position.x - sideRoadCenterX(position.y));
    float roadMask = 1.0 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    return roadMask;
}

float getRoadMask(vec2 position) {
    float distanceToRoad = abs(
        mod(position.y - roadCenterZ(position.x) + uRoadPeriod / 2.0, uRoadPeriod)
        - uRoadPeriod / 2.0
    );
    float roadMask = 1.0 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    // No roads under water!
    float distToLake = length(position - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine  = uLakeRadius + uBeachWidth;
    roadMask *= smoothstep(grassLine - 10.0, grassLine, distToLake);

    return clamp(roadMask + getSideRoadMask(position), 0.0, 1.0);
}

float getLakeDepth(vec2 position) {
    vec2 lakeCenter = vec2(uLakeCenterX, uLakeCenterZ);
    float dist = length(position - lakeCenter);
    float depth = uLakeDepth * (1.0 - smoothstep(0.0, uLakeRadius, dist));

    return depth;
}

float getRoadElevation(vec2 position) {
    float roadFlatness = 0.1;
    return getElevation(
        vec2(position.x, roadCenterZ(position.x))
    ) * roadFlatness;
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
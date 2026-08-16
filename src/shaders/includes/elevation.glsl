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

// For grass and terrain color: slightly smaller than the farm itself
float getFarmMask(vec2 position) {
    float x0 = uFarmBottomLeftX + 5.0;
    float x1 = uFarmBottomLeftX + uFarmDepth - 5.0;
    float z0 = uFarmBottomLeftZ + 5.0;
    float z1 = uFarmBottomLeftZ + uFarmWidth - 5.0;

    // Positive inside, negative outside
    float insideX = min(position.x - x0, x1 - position.x);
    float insideZ = min(position.y - z0, z1 - position.y);

    return smoothstep(-uFarmFalloff, 0.0, insideX) *
        smoothstep(-uFarmFalloff, 0.0, insideZ);
}

float getFarmElevationMask(vec2 position) {
    float x0 = uFarmBottomLeftX;
    float x1 = uFarmBottomLeftX + uFarmDepth;
    float z0 = uFarmBottomLeftZ;
    float z1 = uFarmBottomLeftZ + uFarmWidth;

    // Positive inside, negative outside
    float insideX = min(position.x - x0, x1 - position.x);
    float insideZ = min(position.y - z0, z1 - position.y);

    return smoothstep(-uFarmFalloff, 0.0, insideX) *
        smoothstep(-uFarmFalloff, 0.0, insideZ);
}

float getFarmElevation(vec2 position) {
    float x0 = uFarmBottomLeftX;
    float x1 = uFarmBottomLeftX + uFarmDepth;
    float z0 = uFarmBottomLeftZ;
    float z1 = uFarmBottomLeftZ + uFarmWidth;

    float farmFlatness = 0.2;
    vec2 farmCenter = vec2(
        uFarmBottomLeftX + uFarmDepth / 2.0,
        uFarmBottomLeftZ + uFarmWidth / 2.0
    );

    return getElevation(farmCenter) * farmFlatness;
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

    elevation = mix(
        elevation,
        getFarmElevation(position),
        getFarmElevationMask(position)
    );

    float lakeDepth = getLakeDepth(position);

    elevation -= lakeDepth;

    return elevation;
}
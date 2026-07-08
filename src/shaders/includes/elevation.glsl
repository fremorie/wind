#include "../includes/simplexNoise2d.glsl"

float getBeachMask(vec2 position, float shorePositionX, float beachWidth) {
    return smoothstep(shorePositionX - beachWidth, shorePositionX, position.x);
}

float getElevation(vec2 position, float shorePositionX, float beachWidth, float lakeY) {
    float elevation = 0.0;
    elevation += simplexNoise2d(position * uPositionFrequency) / 2.0;

    float elevationSign = sign(elevation);
    elevation = elevationSign * pow(abs(elevation), 2.0);
    elevation *= uStrength;

    // Lake at the end of the road
    float beachMask = getBeachMask(position, shorePositionX, beachWidth);
    float finalElevation = mix(elevation, lakeY, beachMask);

    return finalElevation;
}

float roadCenterZ(float x) {
    return uRoadCenter.z + uRoadAmplitude * sin(x * uRoadWaviness);
}

float getRoadMask(vec2 position) {
    float distanceToRoad = abs(position.y - roadCenterZ(position.x));
    float roadMask = 1.0 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    return roadMask;
}

float getRoadElevation(vec2 position, float shorePositionX, float beachWidth, float lakeY) {
    return getElevation(
        vec2(position.x, roadCenterZ(position.x)),
        shorePositionX,
        beachWidth,
        lakeY
    );
}

float getFinalElevation(vec2 position, float shorePositionX, float beachWidth, float lakeY) {
    return mix(
        getElevation(position, shorePositionX, beachWidth, lakeY),
        getRoadElevation(position, shorePositionX, beachWidth, lakeY),
        getRoadMask(position)
    );
}
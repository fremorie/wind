uniform vec4 grassParams;
uniform float uTime;
uniform vec3 uTipColor;
uniform vec3 uBaseColor;
uniform vec3 uTipColor2;
uniform vec3 uBaseColor2;

uniform vec2 uPlayerPosition;
uniform vec3 uRoadCenter;
uniform float uTileSize;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;

varying vec3 vColor;
varying vec4 vGrassData;
varying vec3 vNormal;
varying vec3 vWorldPosition;

#include "../includes/utils.glsl"
#include "../includes/hash.glsl"
#include "../includes/noise.glsl"

#include "../includes/elevation.glsl"
#include "../includes/curveWorld.glsl"

vec3 terrainHeight(vec3 worldPos) {
    return vec3(worldPos.x, noise(worldPos * 0.02) * 10.0, worldPos.z);
}

const vec3 BASE_COLOR = vec3(0.1, 0.4, 0.04);
const vec3 TIP_COLOR = vec3(0.5, 0.7, 0.3);

void main() {
    int GRASS_SEGMENTS = int(grassParams.x);
    int GRASS_VERTICES = (GRASS_SEGMENTS + 1) * 2;
    float GRASS_PATCH_SIZE = grassParams.y;
    float GRASS_WIDTH = grassParams.z;
    float GRASS_HEIGHT = grassParams.w;

    // Figure out grass offset
    vec2 hashedInstanceID = hash21(float(gl_InstanceID)) * 2.0 - 1.0;
    vec3 grassOffset = vec3(hashedInstanceID.x, 0.0, hashedInstanceID.y) * GRASS_PATCH_SIZE;

    grassOffset.y = getFinalElevation(grassOffset.xz);

    vec3 grassBladeWorldPos = (modelMatrix * vec4(grassOffset, 1.0)).xyz;
    vec3 hashVal = hash(grassBladeWorldPos);

    // Grass rotation
    const float PI = 3.1415926535;
    float angle = remap(hashVal.x, -1.0, 1.0, -PI, PI);


    // Stiffness
    float stiffness =  1.0;
    float tileGrassHeight = 1.0;

    // Debug
//    grassOffset = vec3(float(gl_InstanceID) * 0.5 - 8.0, 0.0, 0.0);
//    angle = float(gl_InstanceID) * 0.2;

    // Figure out vertex id, > GRASS_VERTICES is other side
    int vertFB_ID = gl_VertexID % (GRASS_VERTICES * 2);
    int vertID = vertFB_ID % GRASS_VERTICES;

    // 0 = left, 1 = right
    int xTest = vertID & 0x1;
    int zTest = (vertFB_ID >= GRASS_VERTICES) ? 1 : -1;
    float xSide = float(xTest);
    float zSide = float(zTest);
    float heightPercent = float(vertID - xTest) / (float(GRASS_SEGMENTS) * 2.0);

    float width = GRASS_WIDTH * easeOut(1.0 - heightPercent, 4.0) * tileGrassHeight;
    float height = GRASS_HEIGHT;

    // Calculate the vertex position
    float x = (xSide - 0.5) * width;
    float y = heightPercent * height;
    float z = 0.0;

    // Grass lean factor
    float windStrength = noise(vec3(grassBladeWorldPos.xz * 0.05, 0.0) + uTime);
    float windAngle = 0.0;
    vec3 windAxis = vec3(cos(windAngle), 0.0, sin(windAngle));
    float windLeanAngle = windStrength * 1.5 * heightPercent * stiffness;

    float randomLeanAnimation = noise(vec3(grassBladeWorldPos.xz, uTime * 4.0)) * (windStrength * 0.5 + 0.125);
//    randomLeanAnimation = 0.0;
//    windStrength = 0.0;
//    windLeanAngle = 0.0;
    float leanFactor = remap(hashVal.y, -1.0, 1.0, -0.5, 0.5) + randomLeanAnimation;

    // Debug
    //leanFactor = 1.0;

    // Add the bezier curve for bend
    vec3 p1 = vec3(0.0);
    vec3 p2 = vec3(0.0, 0.33, 0.0);
    vec3 p3 = vec3(0.0, 0.66, 0.0);
    vec3 p4 = vec3(0.0, cos(leanFactor), sin(leanFactor));
    vec3 curve = bezier(p1, p2, p3, p4, heightPercent);

    // Calculate normal
    vec3 curveGrad = bezierGrad(p1, p2, p3, p4, heightPercent);
    mat2 curveRot90 = mat2(0.0, 1.0, -1.0, 0.0) * (-zSide);

    y = curve.y * height;
    z = curve.z * height;

    // Generate grass matrix
    mat3 grassMat = rotateAxis(windAxis, windLeanAngle) * rotateY(angle);

    float offset = float(gl_InstanceID) * 0.5;

    vec3 grassLocalPosition = grassMat * vec3(x, y, z) + grassOffset;
    vec3 grassLocalNormal = grassMat * vec3(0.0, curveRot90 * curveGrad.yz);

    // Blend normal
    float distanceBlend = smoothstep(0.0, 10.0, distance(cameraPosition, grassBladeWorldPos));
    grassLocalNormal = mix(grassLocalNormal, vec3(0.0, 1.0, 0.0), distanceBlend * 0.5);
    grassLocalNormal = normalize(grassLocalNormal);


    // Curve world
    vec4 worldPosition = modelMatrix * vec4(grassLocalPosition, 1.0);
    worldPosition.xyz = curveWorld(worldPosition.xyz, worldPosition.xz, uPlayerPosition, uCurvature);

    // Viewspace thicken
    vec4 mvPosition = viewMatrix * worldPosition;
    vec3 viewDir = normalize(cameraPosition - grassBladeWorldPos);
    vec3 grassFaceNormal = grassMat * vec3(0.0, 0.0, -zSide);
    float viewDotNormal = saturate(dot(grassFaceNormal, viewDir));
    float viewSpaceThickenFactor = easeOut(1.0 - viewDotNormal, 4.0) * smoothstep(0.0, 0.2, viewDotNormal);

    mvPosition.x += viewSpaceThickenFactor * (xSide - 0.5) * width * 0.5 * (-zSide);

    gl_Position = projectionMatrix * mvPosition;
    gl_Position.w = tileGrassHeight < 0.25 ? 0.0 : gl_Position.w;

    //vColor = mix(BASE_COLOR, TIP_COLOR, heightPercent);
    vec3 c1 = mix(uBaseColor, uTipColor, heightPercent);
    vec3 c2 = mix(uBaseColor2, uTipColor2, heightPercent);
    float noiseValue = noise(grassBladeWorldPos * 0.1);

    vColor = mix(c1, c2, smoothstep(-1.0, 1.0, noiseValue));
    vColor = mix(vec3(1.0, 0.0, 0.0), vColor, stiffness);
    vGrassData = vec4(x, heightPercent, 0.0, 0.0);
    vNormal = normalize((modelMatrix * vec4(grassLocalNormal, 0.0)).xyz);
    vWorldPosition = (modelMatrix * vec4(grassLocalPosition, 1.0)).xyz;
}
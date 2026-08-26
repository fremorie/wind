uniform vec3 uColorGrass;
uniform vec3 uColorDirt;
uniform float uLakeCenterX;
uniform float uLakeCenterZ;
uniform vec3 uColorWaterShallow;
uniform vec3 uColorWaterDeep;
uniform vec2 uPlayerPosition;
uniform sampler2D uPerlinNoiseTexture;
uniform vec3 uNoiseColor;
uniform vec3 uColorRiverDeep;
uniform vec3 uColorRiverShallow;

uniform vec3 uGrassTipColor;
uniform vec3 uGrassBaseColor;

varying vec3 vPosition;
varying float vRoadMask;
varying float vRiverMask;

void main() {
    // Noise
    float perlinNoise = texture(uPerlinNoiseTexture, vPosition.xz * 0.05).r;

    // Color
    vec3 color = vec3(uColorGrass);

    // Grass gradient
    float distanceToPlayer = distance(vPosition.xz, uPlayerPosition);
    float distanceMix = smoothstep(-5.0, 100.0, distanceToPlayer);
    color = mix(uGrassBaseColor, uGrassTipColor, distanceMix);

    // Road
    color = mix(color, uColorDirt, vRoadMask);

    // Beach
    float distanceToLake = length(vPosition.xz - vec2(uLakeCenterX, uLakeCenterZ));
    float grassLine = uLakeRadius + uBeachWidth;
    float sandMask = smoothstep(grassLine, grassLine - 9.0, distanceToLake);
    color = mix(color, uColorDirt, sandMask);

    // Noise
    color = mix(color, uNoiseColor, vec3(perlinNoise) * 0.15 * vRoadMask);

    // Water
    float lakeRegion = smoothstep(uLakeRadius, uLakeRadius - 0.5, distanceToLake);
    float submerged = smoothstep(uLakeSurfaceLevel, uLakeSurfaceLevel - 0.5, vPosition.y);
    float waterMask = lakeRegion * submerged;
    float waterMix = smoothstep(uLakeSurfaceLevel, -uLakeDepth * 0.4, vPosition.y);
    vec3 waterColor = mix(uColorWaterShallow, uColorWaterDeep, waterMix);
    color = mix(color, waterColor, waterMask);

    // River
    float submergedRiver = smoothstep(uRiverSurfaceLevel, uRiverSurfaceLevel - 0.5, vPosition.y);
    float riverMask = vRiverMask * submergedRiver;
    float riverMix = smoothstep(uRiverSurfaceLevel, uRiverDepth, vPosition.y);
    vec3 riverColor = mix(uColorRiverShallow, uColorRiverDeep, riverMix);
    color = mix(color, riverColor, riverMask);

    float litMask = vRoadMask + sandMask + waterMask;

    // Final color
    csm_DiffuseColor = vec4(color, 1.0);
    csm_FragColor = vec4(color, 1.0);
    csm_UnlitFac = distanceMix * (1.0 - sandMask);
}
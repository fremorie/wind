// Grows a recycled instance in from nothing, so a wrapped tree does not pop.

attribute float aSpawnTime;

const float GROWTH_DURATION = 0.8;

float instanceGrowth(float time) {
    return smoothstep(0.0, GROWTH_DURATION, time - aSpawnTime);
}

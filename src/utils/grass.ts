const COUNT = 30000
const PLANE_SIZE = 20
const TURBINE_POSITIONS: [number, number][] = [[-7, -5], [7, -3], [0, -8]]
const TURBINE_CLEAR_RADIUS = 0.6

// Terrain height is displaced in the vertex shader (GPU), so the CPU-side
// geometry is a flat plane at y = 0. Grass just sits slightly below that.
const GRASS_Y = -0.01

// Skip grass where the lake alpha map is brighter than this (0 = land, 1 = lake).
const LAKE_ALPHA_THRESHOLD = 0.1

// Reads the red channel of the lake alpha map at world (x, z), using the same
// UV mapping the ground shader uses: the plane is centered at the origin and
// rotated -90° about X, so world x -> u and world z -> flipped v. Textures are
// uploaded with flipY, hence the (1 - v) row lookup.
export function makeLakeAlphaSampler(
    image: CanvasImageSource & {width: number; height: number},
    planeSize: number = PLANE_SIZE,
) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    const {data, width, height} = ctx.getImageData(0, 0, canvas.width, canvas.height)

    return (x: number, z: number) => {
        const u = x / planeSize + 0.5
        const v = -z / planeSize + 0.5
        const col = Math.min(width - 1, Math.max(0, Math.round(u * (width - 1))))
        const row = Math.min(height - 1, Math.max(0, Math.round((1 - v) * (height - 1))))
        return data[(row * width + col) * 4] / 255
    }
}

export function getGrassBladesPositions(
    sampleLakeAlpha: (x: number, z: number) => number,
    count: number = COUNT,
    planeSize: number = PLANE_SIZE,
    turbinePositions: Array<number[]> = TURBINE_POSITIONS,
    turbineClearRadius: number = TURBINE_CLEAR_RADIUS,
    lakeAlphaThreshold: number = LAKE_ALPHA_THRESHOLD,
    grassY: number = GRASS_Y,
) {
    const result: Array<[number, number, number]> = []
    while (result.length < count) {
        const x = (Math.random() - 0.5) * (planeSize - 0.5)
        const z = (Math.random() - 0.5) * (planeSize - 0.5)
        if (turbinePositions.some(([tx, tz]) => Math.hypot(x - tx, z - tz) < turbineClearRadius))
            continue
        if (sampleLakeAlpha(x, z) > lakeAlphaThreshold)
            continue

        result.push([x, grassY, z])
    }
    return result
}
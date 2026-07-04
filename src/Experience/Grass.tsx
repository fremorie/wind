import {useMemo} from 'react'
import {useTexture} from '@react-three/drei'

import { Ground } from "./Ground";
import { GrassField } from "../components/Grass/GrassField";

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
function makeLakeAlphaSampler(image: CanvasImageSource & {width: number; height: number}) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(image, 0, 0)
    const {data, width, height} = ctx.getImageData(0, 0, canvas.width, canvas.height)

    return (x: number, z: number) => {
        const u = x / PLANE_SIZE + 0.5
        const v = -z / PLANE_SIZE + 0.5
        const col = Math.min(width - 1, Math.max(0, Math.round(u * (width - 1))))
        const row = Math.min(height - 1, Math.max(0, Math.round((1 - v) * (height - 1))))
        return data[(row * width + col) * 4] / 255
    }
}

export function Grass() {
    // Same asset (and drei cache entry) the ground shader displaces with.
    const lakeAlphaMap = useTexture('./lake_alpha.png')

    const sampleLakeAlpha = useMemo(
        () => makeLakeAlphaSampler(lakeAlphaMap.image as CanvasImageSource & {width: number; height: number}),
        [lakeAlphaMap]
    )

    const clamps = useMemo(
        () => {
            const result: Array<[number, number, number]> = []
            while (result.length < COUNT) {
                // eslint-disable-next-line
                const x = (Math.random() - 0.5) * (PLANE_SIZE - 0.5)
                // eslint-disable-next-line
                const z = (Math.random() - 0.5) * (PLANE_SIZE - 0.5)
                if (TURBINE_POSITIONS.some(([tx, tz]) => Math.hypot(x - tx, z - tz) < TURBINE_CLEAR_RADIUS))
                    continue
                if (sampleLakeAlpha(x, z) > LAKE_ALPHA_THRESHOLD)
                    continue

                result.push([x, GRASS_Y, z])
            }
            return result
        },
        [sampleLakeAlpha]
    )

    return (
        <group>
            <Ground />
            <GrassField positions={clamps} />
        </group>
    )
}

import { useMemo } from 'react'
import { GrassBlades } from './GrassBlade'
import { Ground } from "./Ground";

const COUNT = 10000
const PLANE_SIZE = 20
const TURBINE_POSITIONS: [number, number][] = [[-7, -5], [7, -3], [0, -8]]
const TURBINE_CLEAR_RADIUS = 0.7

export function Grass() {
    const blades = useMemo(() => {
        const result: { position: [number, number, number]; rotationY: number }[] = []
        while (result.length < COUNT) {
            const x = (Math.random() - 0.5) * (PLANE_SIZE - 0.5)
            const z = (Math.random() - 0.5) * (PLANE_SIZE - 0.5)
            if (TURBINE_POSITIONS.some(([tx, tz]) => Math.hypot(x - tx, z - tz) < TURBINE_CLEAR_RADIUS))
                continue
            result.push({ position: [x, 0.25, z], rotationY: Math.random() * Math.PI })
        }
        return result
    }, [])

    return (
        <group>
            <Ground />
            <GrassBlades blades={blades} />
        </group>
    )
}

import { useMemo } from 'react'
import { GrassBlades } from './GrassBlade'
import { Ground } from "./Ground";

const COUNT = 10000
const RADIUS = 9.8

export function Grass() {
    const blades = useMemo(() =>
        Array.from({ length: COUNT }, () => {
            const angle = Math.random() * Math.PI * 2
            const r = Math.sqrt(Math.random()) * RADIUS
            return {
                position: [Math.cos(angle) * r, 0.25, Math.sin(angle) * r] as [number, number, number],
                rotationY: Math.random() * Math.PI,
            }
        }), [])

    return (
        <group>
            <Ground />
            <GrassBlades blades={blades} />
        </group>
    )
}

import { useMemo } from 'react'
import { GrassBlades, GrassBlade } from './GrassBlade'

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
        <group position-y={-0.05}>
            <mesh receiveShadow position-y={0}>
                <cylinderGeometry args={[10, 10, 0.1, 128, 10]} />
                <meshStandardMaterial color="#A1DF50" />
            </mesh>
            <GrassBlades>
                {blades.map((blade, i) => (
                    <GrassBlade
                        key={i}
                        position={blade.position}
                        rotation-y={blade.rotationY}
                    />
                ))}
            </GrassBlades>
        </group>
    )
}

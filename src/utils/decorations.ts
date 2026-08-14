import { alea } from 'seedrandom';

export function getWindTurbineInstancesParams(
    count: number,
    windFarmRadius: number,
) {
    const rng = alea('turbines');
    const result = [];
    const spread = (Math.PI * 60) / 180;

    for (let i = 0; i < count; i++) {
        const angle = (i / (count - 1)) * spread - spread / 2;

        result.push({
            key: `turbine-${i}`,
            x: windFarmRadius * Math.cos(angle),
            z: windFarmRadius * Math.sin(angle),
            yaw: 1,
            phase: rng() * i,
            speed: 0.4,
            scale: 7,
        });
    }
    return result;
}

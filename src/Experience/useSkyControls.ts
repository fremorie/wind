import { folder, useControls } from 'leva';
import { calcPosFromAngles } from '@react-three/drei';

const [defaultX, defaultY, defaultZ] = calcPosFromAngles(0.6, 0.1).toArray();
const axis = (value: number) => ({ value, min: -1, max: 1, step: 0.01 });

export function useSkyControls() {
    const { sunPositionX, sunPositionY, sunPositionZ, ...rest } = useControls(
        'Sky',
        {
            distance: { value: 1000, min: 1, max: 5000, step: 1 },
            Sun: folder({
                sunPositionX: axis(defaultX),
                sunPositionY: axis(defaultY),
                sunPositionZ: axis(defaultZ),
            }),
            Scattering: folder({
                turbidity: { value: 10, min: 0, max: 20, step: 0.1 },
                rayleigh: { value: 0.5, min: 0, max: 4, step: 0.001 },
                mieCoefficient: {
                    value: 0.005,
                    min: 0,
                    max: 0.1,
                    step: 0.0001,
                },
                mieDirectionalG: { value: 0.8, min: 0, max: 1, step: 0.001 },
            }),
        },
    );

    return {
        ...rest,
        sunPosition: [sunPositionX, sunPositionY, sunPositionZ] as [
            number,
            number,
            number,
        ],
    };
}

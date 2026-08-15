import { folder, useControls } from 'leva';

const axis = (value: number) => ({ value, min: -1, max: 3, step: 0.01 });

export function useSkyControls() {
    const { sunPositionX, sunPositionY, sunPositionZ, ...rest } = useControls(
        'Sky',
        {
            distance: { value: 5000, min: 1, max: 5000, step: 1 },
            Sun: folder({
                sunPositionX: axis(1),
                sunPositionY: axis(2),
                sunPositionZ: axis(3),
            }),
            Scattering: folder({
                turbidity: { value: 3.2, min: 0, max: 20, step: 0.1 },
                rayleigh: { value: 0.2, min: 0, max: 4, step: 0.001 },
                mieCoefficient: {
                    value: 0.02,
                    min: 0,
                    max: 0.1,
                    step: 0.0001,
                },
                mieDirectionalG: { value: 0.92, min: 0, max: 1, step: 0.001 },
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

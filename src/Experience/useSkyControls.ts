import { folder, useControls } from 'leva';

const axis = (value: number) => ({ value, min: -1, max: 3, step: 0.01 });

export function useSkyControls() {
    const { sunPositionX, sunPositionY, sunPositionZ, ...rest } = useControls(
        'Sky',
        {
            distance: { value: 5000, min: 1, max: 5000, step: 1 },
            Sun: folder({
                sunPositionX: axis(1),
                sunPositionY: axis(0.1),
                sunPositionZ: axis(-0.6),
            }),
            Scattering: folder({
                turbidity: { value: 0.5, min: 0, max: 20, step: 0.1 },
                rayleigh: { value: 2.19, min: 0, max: 4, step: 0.001 },
                mieCoefficient: {
                    value: 0.03,
                    min: 0,
                    max: 0.1,
                    step: 0.0001,
                },
                mieDirectionalG: { value: 0.73, min: 0, max: 1, step: 0.001 },
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

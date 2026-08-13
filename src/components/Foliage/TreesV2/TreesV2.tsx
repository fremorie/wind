import { useFrame } from '@react-three/fiber';

import { foliageUniforms } from '../../../materials/foliage/foliageMaterials';
import { InstancedBirches } from './birches/InstancedBirches';
import { InstancedMaples } from './maples/InstancedMaples';
import { InstancedOaks } from './oaks/InstancedOaks';
import { useTreesV2Controls } from './useTreesV2Controls';

type Props = {
    birchesCount: number;
    maplesCount: number;
    oaksCount: number;
};

export function TreesV2({ birchesCount, maplesCount, oaksCount }: Props) {
    useTreesV2Controls();

    // All three species read one uTime, so it is advanced here rather than in
    // each of them -- three components each adding delta would run the wind at
    // triple speed.
    useFrame((_, delta) => {
        foliageUniforms.uTime.value += delta;
    });

    return (
        <>
            <InstancedBirches count={birchesCount} />
            <InstancedMaples count={maplesCount} />
            <InstancedOaks count={oaksCount} />
        </>
    );
}

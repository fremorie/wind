import { Bushes } from './Bushes';
import { Trees } from './Trees';

type Props = {
    bushesCount: number;
    treesCount: number;
};

export function Foliage({ bushesCount, treesCount }: Props) {
    return (
        <>
            <Bushes count={bushesCount} />
            <Trees count={treesCount} />
        </>
    );
}

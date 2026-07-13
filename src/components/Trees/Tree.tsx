import { TreeModel } from './TreeModel';
import { getTreesPositions } from '../../utils/trees';

export function Tree() {
    const positions = getTreesPositions(10);

    return (
        <>
            {positions.map((position, index) => (
                <TreeModel position={position} key={index} />
            ))}
        </>
    );
}

import { TreeModel } from './TreeModel';
import { getTreesPositions } from '../../utils/trees';

export function Tree() {
    const positions = getTreesPositions();

    return (
        <>
            {positions.map((position, index) => (
                <TreeModel position={position} key={index} />
            ))}
        </>
    );
}

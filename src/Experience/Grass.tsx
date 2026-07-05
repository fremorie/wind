import {useMemo} from 'react'
import {useTexture} from '@react-three/drei'

import { Ground } from "./Ground";
import { GrassField } from "../components/Grass/GrassField";
import {getGrassBladesPositions, makeLakeAlphaSampler} from "../utils/grass";

export function Grass() {
    const lakeAlphaMap = useTexture('./lake_alpha.png')

    const sampleLakeAlpha = useMemo(
        () => makeLakeAlphaSampler(
            lakeAlphaMap.image as CanvasImageSource & {width: number; height: number},
        ),
        [lakeAlphaMap]
    )

    const clamps = useMemo(
        () => getGrassBladesPositions(
            sampleLakeAlpha,
        ),
        [sampleLakeAlpha]
    )

    return (
        <group>
            <Ground />
            <GrassField positions={clamps} />
        </group>
    )
}

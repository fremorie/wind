import { Merged, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

import { Turbine, type TurbineInstance, type TurbineParts } from './Turbine';
import { WIND_TURBINE_COUNT, WIND_FARM_RADIUS } from '../../utils/constants';
import { getWindTurbineInstancesParams } from '../../utils/decorations';

type GLTFNodes = {
    nodes: {
        Rotator: THREE.Mesh;
        Turbine: THREE.Mesh;
        Mesh: THREE.Mesh;
        Mesh_1: THREE.Mesh;
        Circle002: THREE.Mesh;
        Circle002_1: THREE.Mesh;
    };
};

type Props = {
    count?: number;
    radius?: number;
};

export function WindFarm({
    count = WIND_TURBINE_COUNT,
    radius = WIND_FARM_RADIUS,
}: Props) {
    const { nodes } = useGLTF('./windTurbine.glb') as unknown as GLTFNodes;

    const meshes = {
        Nacelle: nodes.Rotator,
        Hub: nodes.Turbine,
        BladeA: nodes.Mesh,
        BladeB: nodes.Mesh_1,
        TowerA: nodes.Circle002,
        TowerB: nodes.Circle002_1,
    };

    const turbines: TurbineInstance[] = useMemo(
        () => getWindTurbineInstancesParams(count, radius),
        [count, radius],
    );

    return (
        <Merged
            meshes={meshes}
            limit={128}
            castShadow
            receiveShadow
            frustumCulled={false}
        >
            {(parts) =>
                turbines.map((data) => (
                    <Turbine
                        key={data.key}
                        data={data}
                        parts={parts as unknown as TurbineParts}
                    />
                ))
            }
        </Merged>
    );
}

useGLTF.preload('./windTurbine.glb');

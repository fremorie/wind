import { Merged, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useMemo } from 'react';

import { Turbine, type TurbineInstance, type TurbineParts } from './Turbine';
import { WIND_TURBINE_COUNT, WIND_FARM_RADIUS } from '../../utils/constants';
import { getWindTurbineInstancesParams } from '../../utils/decorations';

const turbineFogUniforms = {
    uFogStrength: new THREE.Uniform(0.35),
};

function weakenFog(material: THREE.Material) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uFogStrength = turbineFogUniforms.uFogStrength;

        shader.fragmentShader = shader.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>                                                                                             
  uniform float uFogStrength;`,
            )
            .replace(
                '#include <fog_fragment>',
                `#ifdef USE_FOG                                                                                                
      float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);                                                                  
      gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor * uFogStrength);                                              
  #endif`,
            );
    };

    material.needsUpdate = true;
}

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

    const meshes = useMemo(() => {
        const patched = new Map<THREE.Material, THREE.Material>();

        const withWeakFog = (source: THREE.Mesh) => {
            const sourceMaterial = source.material as THREE.Material;
            let material = patched.get(sourceMaterial);

            if (!material) {
                material = sourceMaterial.clone();
                weakenFog(material);
                patched.set(sourceMaterial, material);
            }

            return new THREE.Mesh(source.geometry, material);
        };

        return {
            Nacelle: withWeakFog(nodes.Rotator),
            Hub: withWeakFog(nodes.Turbine),
            BladeA: withWeakFog(nodes.Mesh),
            BladeB: withWeakFog(nodes.Mesh_1),
            TowerA: withWeakFog(nodes.Circle002),
            TowerB: withWeakFog(nodes.Circle002_1),
        };
    }, [nodes]);

    useEffect(() => {
        const materials = Object.values(meshes).map((m) => m.material);
        return () => materials.forEach((m) => (m as THREE.Material).dispose());
    }, [meshes]);

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

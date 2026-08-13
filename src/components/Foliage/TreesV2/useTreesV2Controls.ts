import { useEffect } from 'react';
import { useControls } from 'leva';
import type { Color } from 'three';

import {
    birchBarkMaterial,
    birchCanopyMaterial,
    birchStripeMaterial,
} from '../../../materials/foliage/birchMaterial';
import {
    mapleBarkMaterial,
    mapleCanopyMaterial,
} from '../../../materials/foliage/mapleMaterial';
import {
    oakBarkMaterial,
    oakCanopyMaterial,
} from '../../../materials/foliage/oakMaterial';

const hex = (color: Color) => `#${color.getHexString()}`;

export function useTreesV2Controls() {
    const {
        canopy: birchCanopy,
        tint: birchTint,
        bark: birchBark,
        stripes: birchStripes,
    } = useControls('Trees.Birch', {
        canopy: { value: hex(birchCanopyMaterial.color) },
        tint: { value: hex(birchCanopyMaterial.uniforms.uTintColor.value) },
        bark: { value: hex(birchBarkMaterial.color) },
        stripes: { value: hex(birchStripeMaterial.color) },
    });

    const {
        canopy: mapleCanopy,
        tint: mapleTint,
        bark: mapleBark,
    } = useControls('Trees.Maple', {
        canopy: { value: hex(mapleCanopyMaterial.color) },
        tint: { value: hex(mapleCanopyMaterial.uniforms.uTintColor.value) },
        bark: { value: hex(mapleBarkMaterial.color) },
    });

    const {
        canopy: oakCanopy,
        tint: oakTint,
        bark: oakBark,
    } = useControls('Trees.Oak', {
        canopy: { value: hex(oakCanopyMaterial.color) },
        tint: { value: hex(oakCanopyMaterial.uniforms.uTintColor.value) },
        bark: { value: hex(oakBarkMaterial.color) },
    });

    useEffect(() => {
        birchCanopyMaterial.color.set(birchCanopy);
        birchCanopyMaterial.uniforms.uTintColor.value.set(birchTint);
        birchBarkMaterial.color.set(birchBark);
        birchStripeMaterial.color.set(birchStripes);
    }, [birchCanopy, birchTint, birchBark, birchStripes]);

    useEffect(() => {
        mapleCanopyMaterial.color.set(mapleCanopy);
        mapleCanopyMaterial.uniforms.uTintColor.value.set(mapleTint);
        mapleBarkMaterial.color.set(mapleBark);
    }, [mapleCanopy, mapleTint, mapleBark]);

    useEffect(() => {
        oakCanopyMaterial.color.set(oakCanopy);
        oakCanopyMaterial.uniforms.uTintColor.value.set(oakTint);
        oakBarkMaterial.color.set(oakBark);
    }, [oakCanopy, oakTint, oakBark]);
}

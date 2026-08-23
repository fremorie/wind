import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { GrassTrailMaterial } from '../../materials/grassTrailMaterial';
import type { GrassV2MaterialImpl } from '../../materials/grassV2Material';
import {
    TRAIL_RECOVERY_TIME,
    TRAIL_RESOLUTION,
    TRAIL_TEXEL_SIZE,
} from '../../utils/grassTrail';

function createRenderTarget() {
    return new THREE.WebGLRenderTarget(TRAIL_RESOLUTION, TRAIL_RESOLUTION, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        depthBuffer: false,
        stencilBuffer: false,
        generateMipmaps: false,
    });
}

function createTrailPass() {
    const material = new GrassTrailMaterial();
    const scene = new THREE.Scene();

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    return {
        material,
        scene,
        // The quad already covers clip space, so the camera only has to stay
        // out of the way.
        camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
        read: createRenderTarget(),
        write: createRenderTarget(),
        center: new THREE.Vector2(),
        playerPosition: new THREE.Vector2(),
    };
}

type TrailPass = ReturnType<typeof createTrailPass>;

/**
 * A target is read the frame before it is first written, so neither can be left
 * holding whatever the driver handed out. Zero strength is an empty trail; the
 * direction channels do not matter until something is stamped on them.
 */
function clearTrailPass(trail: TrailPass, renderer: THREE.WebGLRenderer) {
    const previousTarget = renderer.getRenderTarget();
    const previousClearColor = new THREE.Color();
    const previousClearAlpha = renderer.getClearAlpha();

    renderer.getClearColor(previousClearColor);
    renderer.setClearColor(0x000000, 0);

    [trail.read, trail.write].forEach((target) => {
        renderer.setRenderTarget(target);
        renderer.clear(true, false, false);
    });

    renderer.setRenderTarget(previousTarget);
    renderer.setClearColor(previousClearColor, previousClearAlpha);
}

function disposeTrailPass(trail: TrailPass) {
    trail.read.dispose();
    trail.write.dispose();
    trail.material.dispose();

    trail.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
        }
    });
}

/**
 * Keeps the trail texture up to date and hands it to the grass materials. See
 * utils/grassTrail.ts for how the texture is laid out.
 */
export function useGrassTrail(materials: GrassV2MaterialImpl[]) {
    const playerPosition = useGame((state) => state.playerPosition);
    const renderer = useThree((state) => state.gl);

    const trailRef = useRef<TrailPass>(undefined);

    // StrictMode remounts the hook, so the pass has to be dropped as well as
    // disposed -- otherwise the next frame renders into freed targets.
    useEffect(
        () => () => {
            if (trailRef.current) {
                disposeTrailPass(trailRef.current);
                trailRef.current = undefined;
            }
        },
        [],
    );

    useFrame((_, delta) => {
        let trail = trailRef.current;
        let firstFrame = false;

        if (!trail) {
            trail = createTrailPass();
            trailRef.current = trail;
            firstFrame = true;

            clearTrailPass(trail, renderer);
        }

        // Snapping the centre to a whole texel keeps the re-sample a straight
        // copy -- an unsnapped centre would blur the trail every frame.
        const centerX =
            Math.round(playerPosition.x / TRAIL_TEXEL_SIZE) * TRAIL_TEXEL_SIZE;
        const centerZ =
            Math.round(playerPosition.z / TRAIL_TEXEL_SIZE) * TRAIL_TEXEL_SIZE;

        if (firstFrame) {
            // Otherwise the first stamp is a segment running from the world
            // origin to the player.
            trail.center.set(centerX, centerZ);
            trail.playerPosition.set(playerPosition.x, playerPosition.z);
        }

        const { material } = trail;

        material.uPrevious = trail.read.texture;
        material.uPreviousCenter.copy(trail.center);
        material.uCenter.set(centerX, centerZ);
        material.uPreviousPlayerPosition.copy(trail.playerPosition);
        material.uPlayerPosition.set(playerPosition.x, playerPosition.z);
        material.uDecay = Math.exp(-delta / TRAIL_RECOVERY_TIME);

        const previousTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(trail.write);
        renderer.render(trail.scene, trail.camera);
        renderer.setRenderTarget(previousTarget);

        [trail.read, trail.write] = [trail.write, trail.read];
        trail.center.set(centerX, centerZ);
        trail.playerPosition.set(playerPosition.x, playerPosition.z);

        materials.forEach((grassMaterial) => {
            grassMaterial.uTrailMap = trail.read.texture;
            grassMaterial.uTrailCenter.copy(trail.center);
        });
    });
}

const PLANE_SIZE = 200;

export function Terrain() {
    return (
        <mesh receiveShadow castShadow position-y={0} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[PLANE_SIZE, PLANE_SIZE, 256, 256]} />
            <meshStandardMaterial color="#6f8f46" />
        </mesh>
    );
}

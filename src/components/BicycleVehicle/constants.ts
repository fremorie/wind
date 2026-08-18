export const MODEL_PATH = './models/bicycle/MyVeryOwnBicycle.glb';

export const PHYSICS_TIME_STEP = 1 / 60;

export const WHEEL_RADIUS = 1;

/**
 * Where each part sits in the .glb, straight from its node translation. The
 * model is already in chassis space - forward +X, up +Y, axle +Z, origin midway
 * between the axles at axle height - so no yaw correction is needed, only a
 * uniform scale to bring its 1.377 wheel radius down to WHEEL_RADIUS.
 */
const MODEL_WHEEL_RADIUS = 1.377;
const MODEL_FRONT_AXLE_X = 2.1046;
const MODEL_REAR_AXLE_X = -2.0868;
const MODEL_FRAME: Position = [-0.7379, 1.9249, 0];
const MODEL_HANDLE_BAR: Position = [1.6436, 2.4293, 0.001];
const MODEL_CRANK: Position = [-0.28, -0.1091, -0.0016];
const MODEL_PEDAL_LEFT: Position = [-0.28, -0.5127, -0.7784];
const MODEL_PEDAL_RIGHT: Position = [-0.28, 0.2919, 0.7746];

type Position = [number, number, number];

export const MODEL_SCALE = WHEEL_RADIUS / MODEL_WHEEL_RADIUS;

export const WHEELBASE_HALF =
    ((MODEL_FRONT_AXLE_X - MODEL_REAR_AXLE_X) / 2) * MODEL_SCALE;

function scaled([x, y, z]: Position): Position {
    return [x * MODEL_SCALE, y * MODEL_SCALE, z * MODEL_SCALE];
}

function relativeTo(part: Position, pivot: Position): Position {
    return scaled([part[0] - pivot[0], part[1] - pivot[1], part[2] - pivot[2]]);
}

export const FRAME_POSITION = scaled(MODEL_FRAME);
export const STEER_PIVOT = scaled(MODEL_HANDLE_BAR);
export const CRANK_PIVOT = scaled(MODEL_CRANK);
export const PEDAL_LEFT_OFFSET = relativeTo(MODEL_PEDAL_LEFT, MODEL_CRANK);
export const PEDAL_RIGHT_OFFSET = relativeTo(MODEL_PEDAL_RIGHT, MODEL_CRANK);

/**
 * The front wheel hangs off the steering group so it swings with the fork, so
 * its offset is measured from the steer pivot rather than from the chassis. Both
 * axles are pinned to WHEELBASE_HALF, which absorbs the 0.009 the modelled axles
 * are off centre.
 */
export const FRONT_WHEEL_OFFSET: Position = [
    WHEELBASE_HALF - STEER_PIVOT[0],
    -STEER_PIVOT[1],
    -STEER_PIVOT[2],
];
export const REAR_WHEEL_POSITION: Position = [-WHEELBASE_HALF, 0, 0];

/** Crank turns per wheel turn - a bicycle pedals far slower than it rolls. */
export const CRANK_GEAR_RATIO = 0.4;

/** A bicycle has one wheel at each axle, added front first by the controller. */
export const FRONT_WHEELS = [0];
export const REAR_WHEELS = [1];
export const WHEEL_COUNT = FRONT_WHEELS.length + REAR_WHEELS.length;

export const SUSPENSION_DIRECTION = { x: 0, y: -1, z: 0 };
export const WHEEL_AXLE = { x: 0, y: 0, z: 1 };

export const SUSPENSION_REST_LENGTH = 0.4;
export const SUSPENSION_TRAVEL = 0.15;
/**
 * Ride height and bump response both follow the total spring rate - wheel count
 * times stiffness - so dropping from four wheels to two doubled this to keep the
 * bike sitting and reacting exactly as it did before.
 */
export const SUSPENSION_STIFFNESS = 180;
export const SUSPENSION_COMPRESSION_RATIO = 0.3;
export const SUSPENSION_RELAXATION_RATIO = 1;
export const SUSPENSION_SMOOTHING = 10;

export const FRICTION_SLIP = 10.5;
export const SIDE_FRICTION_STIFFNESS = 1;

export const CHASSIS_HALF_EXTENTS: [number, number, number] = [1, 0.25, 0.3];
export const CHASSIS_LINEAR_DAMPING = 0.05;
export const CHASSIS_ANGULAR_DAMPING = 0.3;
export const CHASSIS_MASS_PROPERTIES = {
    mass: 60,
    centerOfMass: { x: 0, y: -0.6, z: 0 },
    principalAngularInertia: { x: 40, y: 60, z: 60 },
    angularInertiaLocalFrame: { x: 0, y: 0, z: 0, w: 1 },
};

/** Below this the chassis points too steeply to tell which way "upright" is. */
export const UPRIGHT_EPSILON = 1e-4;

export const ENGINE_FORCE = 400;
export const BRAKE_FORCE = 60;
export const MAX_SPEED = 18;

export const MAX_STEER = 0.35;
export const STEER_GAIN = 1.5;
export const STEER_RESPONSE = 0.15;

export const INPUT_DEADZONE = 0.01;
export const SPAWN_CLEARANCE = 0.1;

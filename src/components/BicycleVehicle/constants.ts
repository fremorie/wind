export const MODEL_PATH = './models/bicyclePlaceholder/BicyclePlaceholder.glb';
export const MODEL_YAW = Math.PI / 2;

export const PHYSICS_TIME_STEP = 1 / 60;

export const WHEEL_RADIUS = 1;
export const WHEELBASE_HALF = 1.15;
export const TRACK_HALF = 0.6;

export const FRONT_WHEELS = [0, 1];
export const REAR_WHEELS = [2, 3];
export const WHEEL_COUNT = FRONT_WHEELS.length + REAR_WHEELS.length;

export const SUSPENSION_DIRECTION = { x: 0, y: -1, z: 0 };
export const WHEEL_AXLE = { x: 0, y: 0, z: 1 };

export const SUSPENSION_REST_LENGTH = 0.4;
export const SUSPENSION_TRAVEL = 0.15;
export const SUSPENSION_STIFFNESS = 90;
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

export const ENGINE_FORCE = 400;
export const BRAKE_FORCE = 60;
export const MAX_SPEED = 18;

export const MAX_STEER = 0.35;
export const STEER_GAIN = 1.5;
export const STEER_RESPONSE = 0.15;

export const INPUT_DEADZONE = 0.01;
export const SPAWN_CLEARANCE = 0.1;

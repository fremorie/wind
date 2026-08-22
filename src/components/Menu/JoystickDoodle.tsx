// The on-screen stick, drawn in the same pen as the arrows on the keys: one
// wobbly ring with the knob pushed off centre, far enough that it touches
// the ring the way the real one does at full tilt.
//
// The real thing is <Joystick>, bottom right of the screen on touch devices.
// This is only a picture of it, so it is deliberately not to scale - it is
// sized to a whole number of ruled lines instead, see Menu.css.
//
// Three rules tall, matching the key cluster above it, and the strokes are
// heavy because the viewBox scales down with the box: a 3-unit stroke would
// come out thinner than the 2px border on those keys.
export function JoystickDoodle() {
    return (
        <svg
            className="menu-joystick"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Joystick"
        >
            {/* Four arcs at slightly different radii rather than a <circle>,
                so the ring comes out drawn rather than plotted. */}
            <path
                d="M8 60C8 32 32 7 60 7C89 7 112 31 112 60C112 89 88 113 60
                   113C31 113 8 88 8 60Z"
            />

            {/* The knob. Filled faintly so it reads as the thing you move
                rather than as a second ring. */}
            <circle
                cx="82"
                cy="40"
                r="22"
                fill="currentColor"
                fillOpacity="0.15"
            />
        </svg>
    );
}

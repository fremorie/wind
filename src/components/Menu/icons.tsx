import type { ReactNode } from 'react';

// Every icon is drawn on the same 20x20 grid with the same 1.75px stroke
// and no fill, so they all read at the weight of the text beside them.
// 1.5px was a shade too fine: next to a 20px label at weight 400 the icons
// sat back from the words they belong to instead of level with them.
// Nothing here is a picture of a thing in the world - the old menu's
// photographed scraps and doodles are gone.
function Icon({
    children,
    size = 23,
    label,
}: {
    children: ReactNode;
    size?: number;
    label?: string;
}) {
    return (
        <svg
            viewBox="0 0 20 20"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
        >
            {children}
        </svg>
    );
}

export function PlayIcon() {
    return (
        <Icon>
            <path d="M7 4.6 15.4 10 7 15.4Z" />
        </Icon>
    );
}

export function KeyboardIcon() {
    return (
        <Icon>
            <rect x="1.75" y="5.25" width="16.5" height="9.5" rx="2.5" />
            <path d="M5 8.6h.01M8 8.6h.01M11 8.6h.01M14 8.6h.01M6.5 11.8h7" />
        </Icon>
    );
}

export function StarIcon() {
    return (
        <Icon>
            <path d="M10 2.5 12 7.25 17.13 7.68 13.23 11.05 14.41 16.07 10 13.4 5.59 16.07 6.77 11.05 2.87 7.68 8 7.25Z" />
        </Icon>
    );
}

export function InfoIcon() {
    return (
        <Icon>
            <circle cx="10" cy="10" r="7.25" />
            <path d="M10 9.25v4.25M10 6.5h.01" />
        </Icon>
    );
}

export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
    return (
        <Icon size={18}>
            <path
                d={
                    direction === 'left'
                        ? 'M12.25 4.5 6.75 10l5.5 5.5'
                        : 'M7.75 4.5 13.25 10l-5.5 5.5'
                }
            />
        </Icon>
    );
}

export function CloseIcon() {
    return (
        <Icon size={18}>
            <path d="M5.5 5.5 14.5 14.5M14.5 5.5 5.5 14.5" />
        </Icon>
    );
}

// Three lines, evenly spaced, same stroke as everything else.
export function HamburgerIcon() {
    return (
        <Icon size={22}>
            <path d="M4.5 6.5h11M4.5 10h11M4.5 13.5h11" />
        </Icon>
    );
}

const ARROW_ROTATION = {
    left: '0deg',
    up: '90deg',
    right: '180deg',
    down: '-90deg',
} as const;

// Drawn once pointing left and turned for the other three, so there is one
// shape to keep tidy rather than four. The square viewBox is what makes
// turning it safe - a wider-than-tall box would swap its dimensions on the
// quarter turns.
export function ArrowIcon({
    direction,
    label,
    size = 18,
}: {
    direction: 'up' | 'right' | 'down' | 'left';
    label: string;
    size?: number;
}) {
    return (
        <span style={{ display: 'flex', rotate: ARROW_ROTATION[direction] }}>
            <Icon size={size} label={label}>
                <path d="M15 10H5M8.5 6.5 5 10l3.5 3.5" />
            </Icon>
        </span>
    );
}

// A ring with the knob pushed off centre, the way the real stick sits at
// full tilt. The real one is <Joystick>, bottom right on touch devices.
//
// Its own 56x56 grid rather than the shared 20x20 one, because the stroke
// is the thing being kept: drawn small and blown up to diagram size, a
// 1.75px stroke would land on screen at five, and the one illustration on
// the page would be twice the weight of every icon around it. At 1:1 the
// number in the file is the number on screen.
export function JoystickIcon() {
    return (
        <svg
            // Cropped to what is drawn rather than to the grid it was
            // drawn on. The ring's leftmost pixel was 4px inside a 56px
            // box, which is 4px of nothing between the panel's gutter and
            // the only round thing on the page - and every other term in
            // the list starts on that line.
            viewBox="4 4 48 48"
            width="56"
            height="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            role="img"
            aria-label="Joystick"
        >
            <circle cx="28" cy="28" r="23" />
            {/* Tangent from the inside: 13.4 out along the diagonal plus a
                radius of 9.5 lands just short of the ring. Any further and
                the knob crosses it, which reads as a broken circle rather
                than as a stick pushed to the stop. */}
            <circle cx="37.5" cy="18.5" r="9.5" />
        </svg>
    );
}

// Closes the footer line on the root screen. Same grid and stroke as the
// rest of the set - it is punctuation, not an illustration.
export function SunIcon() {
    return (
        <Icon size={16}>
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2.5v1.75M10 15.75v1.75M2.5 10h1.75M15.75 10h1.75M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M15.3 4.7l-1.24 1.24M5.94 14.06L4.7 15.3" />
        </Icon>
    );
}

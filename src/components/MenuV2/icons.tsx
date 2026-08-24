import type { ReactNode } from 'react';

// Every icon is drawn on the same 20x20 grid with the same 1.5px stroke and
// no fill, so they all read at the weight of the text beside them. Nothing
// here is a picture of a thing in the world - the old menu's photographed
// scraps and doodles are gone.
function Icon({
    children,
    size = 20,
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
            strokeWidth="1.5"
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
        <Icon size={16}>
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
        <Icon size={16}>
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

// Drawn once pointing left and turned by CSS for the other three, so there
// is one shape to keep tidy rather than four. The square viewBox is what
// makes turning it safe - a wider-than-tall box would swap its dimensions on
// the quarter turns.
export function ArrowIcon({
    direction,
    label,
}: {
    direction: 'up' | 'right' | 'down' | 'left';
    label: string;
}) {
    return (
        <span className="mv2-arrow" data-direction={direction}>
            <Icon size={16} label={label}>
                <path d="M15 10H5M8.5 6.5 5 10l3.5 3.5" />
            </Icon>
        </span>
    );
}

// A ring with the knob pushed off centre, the way the real stick sits at
// full tilt. The real one is <Joystick>, bottom right on touch devices.
export function JoystickIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            width="72"
            height="72"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            role="img"
            aria-label="Joystick"
        >
            <circle cx="10" cy="10" r="8.5" />
            <circle
                cx="13.5"
                cy="6.5"
                r="3.5"
                fill="currentColor"
                fillOpacity="0.18"
            />
        </svg>
    );
}

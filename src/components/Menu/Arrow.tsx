type Direction = 'up' | 'right' | 'down' | 'left';

// Drawn once pointing left and turned by CSS for the other three, so there is
// one shape to adjust rather than four that have to be kept looking alike.
// The square viewBox is what makes turning it safe: a wider-than-tall box
// would swap its dimensions on the quarter turns and the up and down arrows
// would come out a different size from the left and right ones.
//
// This replaces ← ↑ ↓ →, none of which are in Playpen Sans. They came from
// whatever fallback the browser reached for, and sat off the line they were
// meant to be on - a fallback brings its own metrics, and nothing here can
// correct for a font we did not choose. A drawing has no baseline to
// disagree about.
//
// `label` names the arrow for a screen reader where it is the only content,
// as in the key cluster. Left off, the arrow is decoration next to a word
// that already says the same thing, and is hidden instead.
export function Arrow({
    direction = 'left',
    label,
}: {
    direction?: Direction;
    label?: string;
}) {
    return (
        <svg
            className="menu-arrow"
            data-direction={direction}
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
        >
            {/* The shaft bows by half a unit and the head's two arms are not
                quite the same length, so it sits with the handwriting rather
                than against it. */}
            <path d="M14 8.3Q8.5 7.6 3 8M7.8 3.3 3 8l4.6 4.7" />
        </svg>
    );
}

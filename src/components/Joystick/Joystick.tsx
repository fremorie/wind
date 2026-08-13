import { useRef, type PointerEvent } from 'react';

import useGame from '../../store/useGame';
import './Joystick.css';

// How far the knob may travel from the centre, as a fraction of the base
// radius. Derived from the rendered size so the CSS stays the only place the
// dimensions live.
const TRAVEL_RATIO = 0.7;

export function Joystick() {
    const baseRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const activePointer = useRef<number | null>(null);

    // Stable reference, mutated in place - subscribing here never re-renders.
    const joystick = useGame((state) => state.joystick);

    const moveKnob = (clientX: number, clientY: number) => {
        if (!baseRef.current || !knobRef.current) {
            return;
        }

        const rect = baseRef.current.getBoundingClientRect();
        const travel = (rect.width / 2) * TRAVEL_RATIO;

        let dx = clientX - (rect.left + rect.width / 2);
        let dy = clientY - (rect.top + rect.height / 2);

        const distance = Math.hypot(dx, dy);

        if (distance > travel) {
            dx = (dx / distance) * travel;
            dy = (dy / distance) * travel;
        }

        knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;

        // Screen y grows downwards, forward is up, hence the flip.
        joystick.set(dx / travel, -dy / travel);
    };

    const release = () => {
        activePointer.current = null;
        joystick.set(0, 0);

        if (knobRef.current) {
            knobRef.current.style.transform = 'translate(0px, 0px)';
        }
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        // A second finger landing on the base must not hijack the first one.
        if (activePointer.current !== null) {
            return;
        }

        activePointer.current = event.pointerId;

        // Capture so a finger sliding off the base keeps steering, and so we
        // are guaranteed the matching up/cancel event.
        event.currentTarget.setPointerCapture(event.pointerId);
        moveKnob(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerId !== activePointer.current) {
            return;
        }

        moveKnob(event.clientX, event.clientY);
    };

    const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerId !== activePointer.current) {
            return;
        }

        release();
    };

    return (
        <div
            ref={baseRef}
            className="joystick"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            // Backstop: if the capture is torn away (element removed, browser
            // interruption) we would otherwise ride off forever.
            onLostPointerCapture={handlePointerEnd}
        >
            <div ref={knobRef} className="joystick-knob" />
        </div>
    );
}

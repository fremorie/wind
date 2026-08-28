import { type ReactNode } from 'react';

import { ArrowIcon } from '../Menu/icons';
import { useControlHints, type Phase } from './useControlHints';
import './ControlHints.css';

const CONTENT = {
    move: (
        <>
            Use arrow keys to ride
            <span className="control-hint__cluster">
                <kbd className="control-hint__key">
                    <ArrowIcon direction="up" label="Up" size={20} />
                </kbd>
                <kbd className="control-hint__key">
                    <ArrowIcon direction="left" label="Left" size={20} />
                </kbd>
                <kbd className="control-hint__key">
                    <ArrowIcon direction="down" label="Down" size={20} />
                </kbd>
                <kbd className="control-hint__key">
                    <ArrowIcon direction="right" label="Right" size={20} />
                </kbd>
            </span>
        </>
    ),
    sprint: (
        <span className="control-hint__line">
            Press
            <kbd className="control-hint__key is-wide">Shift</kbd>
            to sprint
        </span>
    ),
} satisfies Record<'move' | 'sprint', ReactNode>;

const CONTENT_BY_PHASE: Partial<Record<Phase, keyof typeof CONTENT>> = {
    move: 'move',
    'move-out': 'move',
    sprint: 'sprint',
    'sprint-out': 'sprint',
};

export function ControlHints() {
    const { phase, isLeaving, onAnimationEnd } = useControlHints();

    const content = CONTENT_BY_PHASE[phase];
    if (!content) return null;

    return (
        <div
            className={`control-hint ${isLeaving ? 'is-leaving' : ''}`}
            onAnimationEnd={onAnimationEnd}
            aria-live="polite"
        >
            {CONTENT[content]}
        </div>
    );
}

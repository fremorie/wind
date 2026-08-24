import type { MouseEvent, ReactNode } from 'react';

import { ChevronIcon } from './icons';

// One row of the root list. Resume is a plain invoker button - `command` and
// `commandfor` name the dialog and what to do to it, and the browser does it
// - and the rows below it are script, because what they open is a screen
// inside that dialog rather than a dialog of its own. `chevron` marks those,
// and `primary` marks the one row that is the reason most people opened the
// menu at all.
export function MenuItem({
    icon,
    label,
    command,
    commandfor,
    onClick,
    chevron,
    primary,
}: {
    icon: ReactNode;
    label: string;
    command?: 'close';
    commandfor?: string;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    chevron?: boolean;
    primary?: boolean;
}) {
    return (
        <li>
            <button
                type="button"
                className={primary ? 'mv2-item is-primary' : 'mv2-item'}
                command={command}
                commandfor={commandfor}
                onClick={onClick}
            >
                {icon}
                <span className="mv2-label">{label}</span>
                {chevron && <ChevronIcon direction="right" />}
            </button>
        </li>
    );
}

import type { ReactNode } from 'react';

import { ChevronIcon } from './icons';

// One row of the root list, and a plain invoker button: `command` and
// `commandfor` name a dialog and what to do to it, and the browser does it.
// `chevron` marks the rows that open a page, as opposed to Resume, which
// closes the menu.
export function MenuItem({
    icon,
    label,
    command,
    commandfor,
    chevron,
    autofocus,
}: {
    icon: ReactNode;
    label: string;
    command: 'show-modal' | 'close';
    commandfor: string;
    chevron?: boolean;
    autofocus?: '';
}) {
    return (
        <li>
            <button
                type="button"
                className="mv2-item"
                command={command}
                commandfor={commandfor}
                autofocus={autofocus}
                // The rows that open a page say so, the way the hamburger
                // does. Resume closes the menu and has nothing to announce.
                aria-haspopup={command === 'show-modal' ? 'dialog' : undefined}
            >
                {icon}
                <span className="mv2-label">{label}</span>
                {chevron && <ChevronIcon direction="right" />}
            </button>
        </li>
    );
}

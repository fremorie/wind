import type { ReactNode } from 'react';

import { ChevronIcon } from './icons';

// One row of the root list. `chevron` marks the rows that open a page, as
// opposed to Resume, which closes the menu.
//
// The .mv2-item class is also what Menu's arrow-key handler queries the list
// for, so it is load-bearing in two places rather than one.
export function MenuItem({
    icon,
    label,
    onClick,
    chevron,
}: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    chevron?: boolean;
}) {
    return (
        <li>
            <button type="button" className="mv2-item" onClick={onClick}>
                {icon}
                <span className="mv2-label">{label}</span>
                {chevron && <ChevronIcon direction="right" />}
            </button>
        </li>
    );
}

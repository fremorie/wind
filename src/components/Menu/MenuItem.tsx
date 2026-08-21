// One row of the root list. The drawing is painted in Menu.css, which masks
// the file so it takes the ink colour; `icon` picks which one, by file name
// in public/images/icons without the extension.
//
// The .menu-item class is also what Menu's arrow-key handler queries the
// list for, so it is load-bearing in two places rather than one.
export function MenuItem({
    icon,
    label,
    onClick,
    autoFocus,
}: {
    icon: string;
    label: string;
    onClick: () => void;
    autoFocus?: boolean;
}) {
    return (
        <li>
            <button
                type="button"
                className="menu-item"
                onClick={onClick}
                autoFocus={autoFocus}
            >
                <span className="menu-icon" data-icon={icon} />
                <span className="menu-label">{label}</span>
            </button>
        </li>
    );
}

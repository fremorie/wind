import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import { SECTIONS } from './sections';
import './Menu.css';

export function Menu() {
    const [open, setOpen] = useState(false);

    // null is the root list; anything else is the id of the page being read.
    const [pageId, setPageId] = useState<string | null>(null);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    const page = SECTIONS.find((section) => section.id === pageId);

    // showModal() is what makes this an actual modal rather than a div that
    // looks like one: the rest of the page goes inert, focus is trapped inside
    // and handed back to the toggle on close, Escape closes, and the sheet
    // renders in the top layer above the canvas without any z-index. All of
    // that is behaviour we would otherwise be hand-rolling and getting subtly
    // wrong.
    const openMenu = () => {
        dialogRef.current?.showModal();
        setOpen(true);
    };

    const closeMenu = () => dialogRef.current?.close();

    // Clicks that land on ::backdrop are dispatched with the dialog itself as
    // the target; anything inside the sheet targets a descendant instead.
    const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) {
            closeMenu();
        }
    };

    // Gameplay keys are read by drei's KeyboardControls straight off `window`.
    // React dispatches from the root container, which sits below window in the
    // tree, so stopping propagation here keeps WASD from driving the bicycle
    // while someone is reading the menu.
    //
    // keydown only, deliberately. Swallowing keyup as well would strand a key
    // that was already held when the menu opened in its pressed state, and the
    // bicycle would ride off on its own.
    //
    // Escape survives this: stopPropagation blocks other listeners, but the
    // dialog's close is a default action, and only preventDefault stops those.
    const swallowKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        event.stopPropagation();
    };

    // Tab already walks the list; this is for the arrow keys, which is how
    // anyone who has just been steering with them will expect to move.
    const handleListKeys = (event: KeyboardEvent<HTMLUListElement>) => {
        const delta =
            event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;

        if (delta === 0) {
            return;
        }

        event.preventDefault();

        const items = [
            ...event.currentTarget.querySelectorAll<HTMLElement>('.menu-item'),
        ];

        // -1 when focus is somewhere else entirely, which lands on the first
        // item going down and the last one going up. Both are the right guess.
        const from = items.indexOf(document.activeElement as HTMLElement);

        items[(from + delta + items.length) % items.length]?.focus();
    };

    return (
        <>
            {/* The label lives in aria-label now that the button is a
                picture of a scrap of paper rather than the word Menu. */}
            <button
                ref={toggleRef}
                type="button"
                className={`menu-toggle${open ? ' is-hidden' : ''}`}
                aria-label="Menu"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={openMenu}
            />

            <dialog
                ref={dialogRef}
                className="menu"
                aria-label="Menu"
                onClose={() => {
                    setOpen(false);
                    setPageId(null);

                    // Closing a dialog hands focus back to whatever opened
                    // it. Left on the toggle, the next arrow key - a
                    // gameplay key here, not navigation - is enough to make
                    // the browser call that focus keyboard-driven and light
                    // the button up for the rest of the ride. Nothing else
                    // on the page wants the focus, so drop it.
                    //
                    // In a task, not inline: the browser restores that focus
                    // after this event, so blurring here and now would just
                    // be undone a moment later.
                    setTimeout(() => toggleRef.current?.blur(), 0);
                }}
                onClick={handleDialogClick}
                onKeyDown={swallowKeyDown}
            >
                <div className="menu-sheet">
                    <div className="menu-paper">
                        {page && (
                            <>
                                <button
                                    type="button"
                                    className="menu-back"
                                    onClick={() => setPageId(null)}
                                    autoFocus
                                >
                                    ← Back
                                </button>

                                <button
                                    type="button"
                                    className="menu-close"
                                    aria-label="Close menu"
                                    onClick={closeMenu}
                                >
                                    ×
                                </button>
                            </>
                        )}

                        {/* Keyed so the fade replays on every navigation. The
                            close and back buttons stay outside it: the fade
                            animates `translate`, and an ancestor with a
                            transform on it becomes the containing block for
                            anything absolutely positioned inside. */}
                        <div
                            key={pageId ?? 'root'}
                            className={`menu-section${page ? '' : ' is-root'}`}
                        >
                            {page ? (
                                <>
                                    <h2 className="menu-title">{page.title}</h2>
                                    {page.body}
                                </>
                            ) : (
                                <>
                                    <h2 className="menu-title">Menu</h2>

                                    <ul
                                        className="menu-nav"
                                        onKeyDown={handleListKeys}
                                    >
                                        <li>
                                            <button
                                                type="button"
                                                className="menu-item"
                                                onClick={closeMenu}
                                                autoFocus
                                            >
                                                {/* The drawing is painted
                                                    in Menu.css, which masks
                                                    it so it takes the ink
                                                    colour; the name here
                                                    picks which one. */}
                                                <span
                                                    className="menu-icon"
                                                    data-icon="bicycle"
                                                />
                                                <span className="menu-label">
                                                    Resume
                                                </span>
                                            </button>
                                        </li>

                                        {SECTIONS.map((section) => (
                                            <li key={section.id}>
                                                <button
                                                    type="button"
                                                    className="menu-item"
                                                    onClick={() =>
                                                        setPageId(section.id)
                                                    }
                                                >
                                                    <span
                                                        className="menu-icon"
                                                        data-icon={section.icon}
                                                    />
                                                    <span className="menu-label">
                                                        {section.label}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}

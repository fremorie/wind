import { useId, useState, type KeyboardEvent } from 'react';

import { useModalDialog } from '../../hooks/useModalDialog';
import { Arrow } from './Arrow';
import { MenuItem } from './MenuItem';
import { SECTIONS } from './sections';
import './Menu.css';

export function Menu() {
    // null is the root list; anything else is the id of the page being read.
    const [pageId, setPageId] = useState<string | null>(null);

    // The dialog is left showing whichever page was open when it was
    // dismissed otherwise, and the menu would reopen halfway into Credits.
    const { open, close, triggerProps, dialogProps } = useModalDialog(() =>
        setPageId(null),
    );

    // The sheet's heading names the dialog, so the name follows the page
    // instead of saying "Menu" while Credits is on screen.
    const headingId = useId();

    const page = SECTIONS.find((section) => section.id === pageId);

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
    // anyone who has just been steering with them will expect to move. The
    // class being queried is the one MenuItem puts on its button.
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
                {...triggerProps}
                type="button"
                className={`menu-toggle${open ? ' is-hidden' : ''}`}
                aria-label="Menu"
            />

            <dialog
                {...dialogProps}
                className="menu"
                aria-labelledby={headingId}
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
                                    <Arrow />
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="menu-close"
                                    aria-label="Close menu"
                                    onClick={close}
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
                                    <h2 id={headingId} className="menu-title">
                                        {page.title}
                                    </h2>
                                    {page.body}
                                </>
                            ) : (
                                <>
                                    <h2 id={headingId} className="menu-title">
                                        Menu
                                    </h2>

                                    {/* This autoFocus is not what focuses
                                        Resume when the menu opens. React
                                        does not write the autofocus
                                        attribute - it calls focus() on
                                        mount, and the list mounts while the
                                        dialog is still display: none, so
                                        that call does nothing. The browser
                                        picks the first focusable thing in
                                        the sheet instead, which happens to
                                        be this. Put anything focusable above
                                        the list and the opening focus moves
                                        with it. */}
                                    <ul
                                        className="menu-nav"
                                        onKeyDown={handleListKeys}
                                    >
                                        <MenuItem
                                            icon="bicycle"
                                            label="Resume"
                                            onClick={close}
                                            autoFocus
                                        />

                                        {SECTIONS.map((section) => (
                                            <MenuItem
                                                key={section.id}
                                                icon={section.icon}
                                                label={section.label}
                                                onClick={() =>
                                                    setPageId(section.id)
                                                }
                                            />
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

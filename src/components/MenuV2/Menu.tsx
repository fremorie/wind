import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { useModalDialog } from '../../hooks/useModalDialog';
import { ChevronIcon, CloseIcon, HamburgerIcon, PlayIcon } from './icons';
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

    // The heading names the dialog, so the name follows the page instead of
    // saying "Menu" while Credits is on screen.
    const headingId = useId();

    const page = SECTIONS.find((section) => section.id === pageId);

    // showModal() focuses the first focusable thing in the dialog, which is
    // the close button up in the header - so opening the menu lights up the
    // one control that throws it away again. Resume is the row someone
    // actually wants, so take the focus back once the dialog is on screen.
    //
    // An effect rather than autoFocus on the row: React's autoFocus calls
    // focus() when the element mounts, and the list mounts with the dialog
    // still display: none, where that call does nothing.
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (open) {
            listRef.current?.querySelector<HTMLElement>('.mv2-item')?.focus();
        }
    }, [open]);

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
            ...event.currentTarget.querySelectorAll<HTMLElement>('.mv2-item'),
        ];

        // -1 when focus is somewhere else entirely, which lands on the first
        // item going down and the last one going up. Both are the right guess.
        const from = items.indexOf(document.activeElement as HTMLElement);

        items[(from + delta + items.length) % items.length]?.focus();
    };

    return (
        <>
            <button
                {...triggerProps}
                type="button"
                className={`mv2-toggle${open ? ' is-hidden' : ''}`}
                aria-label="Menu"
            >
                <HamburgerIcon />
            </button>

            <dialog
                {...dialogProps}
                className="mv2"
                aria-labelledby={headingId}
                onKeyDown={swallowKeyDown}
            >
                <header className="mv2-head">
                    {page ? (
                        <button
                            type="button"
                            className="mv2-round"
                            aria-label="Back"
                            onClick={() => setPageId(null)}
                            autoFocus
                        >
                            <ChevronIcon direction="left" />
                        </button>
                    ) : (
                        <span className="mv2-round is-empty" />
                    )}

                    <h2 id={headingId} className="mv2-title">
                        {page ? page.title : 'Menu'}
                    </h2>

                    <button
                        type="button"
                        className="mv2-round"
                        aria-label="Close menu"
                        onClick={close}
                    >
                        <CloseIcon />
                    </button>
                </header>

                {/* Keyed so the fade replays on every navigation. */}
                <div key={pageId ?? 'root'} className="mv2-body">
                    {page ? (
                        page.body
                    ) : (
                        <ul
                            className="mv2-nav"
                            ref={listRef}
                            onKeyDown={handleListKeys}
                        >
                            <MenuItem
                                icon={<PlayIcon />}
                                label="Resume"
                                onClick={close}
                            />

                            {SECTIONS.map((section) => (
                                <MenuItem
                                    key={section.id}
                                    icon={section.icon}
                                    label={section.label}
                                    onClick={() => setPageId(section.id)}
                                    chevron
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </dialog>
        </>
    );
}

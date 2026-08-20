import { useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

import { SECTIONS } from './sections';
import './Menu.css';

export function Menu() {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const active = SECTIONS[activeIndex];

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

    // Clicks that land on ::backdrop are dispatched with the dialog itself as
    // the target; anything inside the sheet targets a descendant instead.
    const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) {
            dialogRef.current?.close();
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

    // role="tab" promises arrow-key navigation, so it has to actually work.
    const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
        const delta =
            event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;

        if (delta === 0) {
            return;
        }

        event.preventDefault();

        const next = (activeIndex + delta + SECTIONS.length) % SECTIONS.length;

        setActiveIndex(next);
        tabRefs.current[next]?.focus();
    };

    return (
        <>
            <button
                type="button"
                className={`menu-toggle${open ? ' is-hidden' : ''}`}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={openMenu}
            >
                Menu
            </button>

            <dialog
                ref={dialogRef}
                className="menu"
                aria-label="Menu"
                onClose={() => setOpen(false)}
                onClick={handleDialogClick}
                onKeyDown={swallowKeyDown}
            >
                <div className="menu-sheet">
                    <div
                        className="menu-tabs"
                        role="tablist"
                        aria-orientation="vertical"
                        aria-label="Menu sections"
                        onKeyDown={handleTabKeys}
                    >
                        {SECTIONS.map((section, index) => (
                            <button
                                key={section.id}
                                ref={(node) => {
                                    tabRefs.current[index] = node;
                                }}
                                type="button"
                                className="menu-tab"
                                role="tab"
                                id={`menu-tab-${section.id}`}
                                aria-selected={index === activeIndex}
                                aria-controls={`menu-page-${section.id}`}
                                tabIndex={index === activeIndex ? 0 : -1}
                                onClick={() => setActiveIndex(index)}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>

                    <div className="menu-paper">
                        <button
                            type="button"
                            className="menu-close"
                            aria-label="Close menu"
                            onClick={() => dialogRef.current?.close()}
                        >
                            ×
                        </button>

                        {/* Keyed so the fade replays on every switch. */}
                        <div
                            key={active.id}
                            className="menu-section"
                            role="tabpanel"
                            id={`menu-page-${active.id}`}
                            aria-labelledby={`menu-tab-${active.id}`}
                        >
                            <h2 className="menu-title">{active.title}</h2>
                            {active.body}
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}

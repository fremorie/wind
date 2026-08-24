import type { KeyboardEvent, MouseEvent } from 'react';

import {
    ChevronIcon,
    CloseIcon,
    HamburgerIcon,
    PlayIcon,
    SunIcon,
} from './icons';
import { MenuItem } from './MenuItem';
import { SECTIONS } from './sections';
import './Menu.css';

// The id the hamburger and the Resume row point at. Each section page has
// one of its own, `mv2-` plus the section id.
const MENU = 'mv2-menu';

const pageId = (id: string) => `mv2-${id}`;

// The menu is HTML doing its own work: a button with `command` and
// `commandfor` opens or closes a <dialog> by id, showModal() puts it in the
// top layer with focus trapped inside, `closedby="any"` handles Escape and
// the click outside, `autofocus` decides where focus lands, and each section
// is its own dialog that opens on top of the root one - so going into a page
// and coming back out is two dialogs stacking, not a component re-rendering.
//
// What is left in script is the three things the platform has no answer
// for: see handleKeyDown and dropFocus.
export function Menu() {
    // Closing a dialog hands focus back to whatever was focused when it
    // opened. For a section page that is the row that opened it, which is
    // right. For the root menu it is this button, which is not: the next
    // arrow key is a gameplay key rather than navigation, and pressing it is
    // enough for the browser to call that focus keyboard-driven and light
    // the button up for the rest of the ride.
    //
    // showModal() records the element to restore to at the moment it runs,
    // and a click listener runs before the activation behaviour that invokes
    // the command - so blurring here, on the way in, means the menu opens
    // with nothing to hand focus back to and closes without lighting
    // anything up.
    //
    // On the way in rather than on the way out because there is no way out
    // to hook: Chrome does not fire `close` when a dialog is closed by an
    // invoker command, so an onClose on the dialog never runs.
    const dropFocus = (event: MouseEvent<HTMLButtonElement>) => {
        event.currentTarget.blur();
    };

    // Leaving a page altogether means closing two dialogs - the page, and
    // the menu underneath it - and a button carries one command. That is
    // the one thing invoker commands cannot express, so it is script.
    //
    // The page goes first: it is the topmost dialog, and closing the one
    // below it while it is still up would leave a page with no menu behind
    // it to go back to.
    const closeAll = (event: MouseEvent<HTMLButtonElement>) => {
        event.currentTarget.closest('dialog')?.close();

        const menu = document.getElementById(MENU);
        if (menu instanceof HTMLDialogElement) {
            menu.close();
        }
    };

    // Two jobs, both on the dialog itself so every page gets them.
    //
    // First: gameplay keys are read by drei's KeyboardControls straight off
    // `window`. React dispatches from the root container, which sits below
    // window in the tree, so stopping propagation here keeps WASD from driving
    // the bicycle while someone is reading the menu.
    //
    // keydown only, deliberately. Swallowing keyup as well would strand a key
    // that was already held when the menu opened in its pressed state, and the
    // bicycle would ride off on its own.
    //
    // Escape survives this: stopPropagation blocks other listeners, but the
    // dialog's close is a default action, and only preventDefault stops those.
    //
    // Second: the arrow keys walk the list. Tab does that already and the
    // dialog traps it, but anyone who has just been steering with the arrows
    // will reach for them here too, and nothing in HTML moves focus between
    // buttons. A page has no items, so the query comes back empty and the
    // keys fall through to the browser.
    const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        event.stopPropagation();

        const delta =
            event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;

        if (delta === 0) {
            return;
        }

        const items = [
            ...event.currentTarget.querySelectorAll<HTMLElement>('.mv2-item'),
        ];

        if (items.length === 0) {
            return;
        }

        // Held arrows scroll the page by default, and the panel scrolls on a
        // short screen.
        event.preventDefault();

        // -1 when focus is somewhere else entirely, which lands on the first
        // item going down and the last one going up. Both are the right guess.
        const from = items.indexOf(document.activeElement as HTMLElement);

        items[(from + delta + items.length) % items.length]?.focus();
    };

    return (
        <>
            <button
                type="button"
                className="mv2-toggle"
                onClick={dropFocus}
                command="show-modal"
                commandfor={MENU}
                aria-haspopup="dialog"
                aria-label="Menu"
            >
                <HamburgerIcon />
            </button>

            {/* The root screen is the game's name, the list, and a line to
                close it on. Not a title reading "Menu" - that would say
                nothing the list does not - but the one thing a pause screen
                is otherwise the last to mention, and a pair of ends for the
                list to sit between. There is still no close button up here:
                Resume, Escape and a click outside are the ways out. */}
            <dialog
                id={MENU}
                className="mv2 is-root"
                closedby="any"
                aria-labelledby={`${MENU}-wordmark`}
                onKeyDown={handleKeyDown}
            >
                <header className="mv2-brand">
                    {/* h2, not h1: the dialog is a piece of the page rather
                        than the page itself, and this is the name it is
                        announced by - hence the id in aria-labelledby. */}
                    <h2 id={`${MENU}-wordmark`} className="mv2-wordmark">
                        Sunday ride
                    </h2>
                </header>

                <div className="mv2-body">
                    <ul className="mv2-nav">
                        <MenuItem
                            icon={<PlayIcon />}
                            label="Resume"
                            command="close"
                            commandfor={MENU}
                            primary
                            autofocus=""
                        />

                        {SECTIONS.map((section) => (
                            <MenuItem
                                key={section.id}
                                icon={section.icon}
                                label={section.label}
                                command="show-modal"
                                commandfor={pageId(section.id)}
                                chevron
                            />
                        ))}
                    </ul>
                </div>

                {/* Decoration, and honest about it: the sun is aria-hidden
                    by default like every icon without a label, and the line
                    is the sign-off the game would give you if it talked. */}
                <footer className="mv2-foot">
                    <span>Enjoy the ride.</span>
                    <SunIcon />
                </footer>
            </dialog>

            {/* Each page opens on top of the root menu and covers it exactly,
                so closing it is the way back. Escape does the same, one
                dialog at a time. */}
            {SECTIONS.map((section) => (
                <dialog
                    key={section.id}
                    id={pageId(section.id)}
                    className="mv2"
                    closedby="any"
                    aria-labelledby={`${pageId(section.id)}-title`}
                    // MUI's dialog documents both: labelledby names the
                    // dialog, describedby is what it has to say. A page is
                    // all prose, so the body is the description - and a
                    // screen reader reads it out on open rather than
                    // leaving someone to go looking for it. The root menu
                    // gets no describedby: its body is a list of buttons,
                    // which the focused row announces by itself.
                    aria-describedby={`${pageId(section.id)}-body`}
                    onKeyDown={handleKeyDown}
                >
                    <header className="mv2-head">
                        <button
                            type="button"
                            className="mv2-round"
                            command="close"
                            commandfor={pageId(section.id)}
                            aria-label="Back"
                            autofocus=""
                        >
                            <ChevronIcon direction="left" />
                        </button>

                        <h2
                            id={`${pageId(section.id)}-title`}
                            className="mv2-title"
                        >
                            {section.title}
                        </h2>

                        <button
                            type="button"
                            className="mv2-round is-quiet"
                            onClick={closeAll}
                            aria-label="Close menu"
                        >
                            <CloseIcon />
                        </button>
                    </header>

                    <div className="mv2-body" id={`${pageId(section.id)}-body`}>
                        {section.body}
                    </div>
                </dialog>
            ))}
        </>
    );
}

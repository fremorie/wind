import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
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
import type { Section } from './sections';
import './Menu.css';

// The id every way out points at. There is one dialog now, so there is one
// id.
const MENU = 'mv2-menu';

// The menu is one <dialog>, and mostly HTML doing its own work: showModal()
// puts it in the top layer with focus trapped inside, `closedby="any"` gives
// Escape and the click outside - both of which close the panel outright,
// from however deep in - and a button with `command` and `commandfor` closes
// it by id.
//
// A section is a screen inside that dialog rather than a second dialog on
// top of it. The two used to stack, which is what a nested dialog is for,
// but both were the same 510x660 box in the same place: the browser counted
// two surfaces, and every place it did - a click outside dismissing one of
// them, a button carrying one command, the panel underneath showing through
// - was a place this file had to talk it back out of it.
//
// What is left in script is the screens: which one is showing, and where
// focus goes when that changes.
export function Menu() {
    const [page, setPage] = useState<Section | null>(null);

    const panelRef = useRef<HTMLDialogElement>(null);

    // The row a page was opened from, so Back can hand focus back to it.
    const openedFrom = useRef<HTMLButtonElement | null>(null);

    // The screen that is not showing is inert, and focus cannot be left on a
    // row inside it: the browser would take it away and drop it on the
    // dialog, which is a focus ring around the whole panel on WebKit and
    // nothing to arrow away from anywhere. Moving it deliberately is the job
    // the second dialog used to do by opening and closing.
    //
    // In an effect rather than in the click handlers because both targets
    // are inert until React has rendered the swap, and an inert button
    // cannot take focus.
    useEffect(() => {
        const panel = panelRef.current;

        // The menu is shut: the swap is for the next time it opens, and
        // openMenu places focus then.
        if (!panel?.open) {
            return;
        }

        if (page) {
            panel
                .querySelector<HTMLElement>('.mv2-screen.is-on .mv2-round')
                ?.focus();
        } else {
            openedFrom.current?.focus();
        }
    }, [page]);

    // Closing a dialog hands focus back to whatever was focused when it
    // opened. For this button that is wrong: the next arrow key is a
    // gameplay key rather than navigation, and pressing it is enough for the
    // browser to call that focus keyboard-driven and light the button up for
    // the rest of the ride. showModal() records the element to restore to at
    // the moment it runs, so blurring first means the menu opens with
    // nothing to hand focus back to and closes without lighting anything up.
    //
    // The menu also always opens on the list. Resetting here on the way in
    // rather than on the way out, because a page closing is a panel fading
    // out for 195ms - reset there and the list cross-fades in underneath it
    // on its way off the screen.
    //
    // flushSync because that reset has to be in the DOM before the panel
    // opens: Resume is inside an inert screen until the list is the one
    // showing, and an inert button cannot take focus.
    //
    // Focus goes on the first row from here rather than from an `autofocus`
    // attribute on it. The attribute is the right mechanism - a dialog reads
    // it on every showModal(), not just the first - but React only knows the
    // camelCased `autoFocus`, which it implements as a focus() call on mount
    // and never writes the attribute at all. The lowercase spelling is the
    // only way to get the real one, and it is an invalid DOM property as far
    // as React is concerned, so it warns on every render. Opening is script
    // now, and script can place focus itself.
    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.currentTarget.blur();

        flushSync(() => setPage(null));

        const panel = panelRef.current;
        panel?.showModal();
        panel
            ?.querySelector<HTMLElement>('.mv2-screen.is-on .mv2-item')
            ?.focus();
    };

    const openPage =
        (section: Section) => (event: MouseEvent<HTMLButtonElement>) => {
            openedFrom.current = event.currentTarget;
            setPage(section);
        };

    // Two jobs, both on the dialog itself so every screen gets them.
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
    // buttons. The query is scoped to the screen that is showing - a page has
    // no rows of its own, so it comes back empty and the keys fall through to
    // the browser.
    const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
        event.stopPropagation();

        const delta =
            event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;

        if (delta === 0) {
            return;
        }

        const items = [
            ...event.currentTarget.querySelectorAll<HTMLElement>(
                '.mv2-screen.is-on .mv2-item',
            ),
        ];

        if (items.length === 0) {
            return;
        }

        // Held arrows scroll the page by default, and the panel scrolls on a
        // short screen.
        event.preventDefault();

        // -1 when focus is somewhere else entirely, and its own case: -1 is
        // not "one before the first row", so adding delta to it and wrapping
        // lands a step short at either end. Going down starts at the first
        // row, going up at the last.
        const from = items.indexOf(document.activeElement as HTMLElement);

        const to =
            from === -1
                ? delta === 1
                    ? 0
                    : items.length - 1
                : (from + delta + items.length) % items.length;

        items[to]?.focus();
    };

    return (
        <>
            <button
                type="button"
                className="mv2-toggle"
                onClick={openMenu}
                aria-haspopup="dialog"
                aria-label="Menu"
            >
                <HamburgerIcon />
            </button>

            <dialog
                id={MENU}
                className="mv2"
                closedby="any"
                ref={panelRef}
                aria-labelledby={`${MENU}-wordmark`}
                onKeyDown={handleKeyDown}
            >
                {/* The root screen is the game's name, the list, and a line
                    to close it on. Not a title reading "Menu" - that would
                    say nothing the list does not - but the one thing a pause
                    screen is otherwise the last to mention, and a pair of
                    ends for the list to sit between. There is still no close
                    button here: Resume, Escape and a click outside are the
                    ways out. */}
                <div
                    className={
                        page ? 'mv2-screen is-root' : 'mv2-screen is-root is-on'
                    }
                    inert={page !== null}
                >
                    <header className="mv2-brand">
                        {/* h2, not h1: the dialog is a piece of the page
                            rather than the page itself, and this is the name
                            it is announced by - hence the id in
                            aria-labelledby. */}
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
                            />

                            {SECTIONS.map((section) => (
                                <MenuItem
                                    key={section.id}
                                    icon={section.icon}
                                    label={section.label}
                                    onClick={openPage(section)}
                                    chevron
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Decoration, and honest about it: the sun is
                        aria-hidden by default like every icon without a
                        label, and the line is the sign-off the game would
                        give you if it talked. */}
                    <footer className="mv2-foot">
                        <span>Enjoy the ride.</span>
                        <SunIcon />
                    </footer>
                </div>

                {/* Every page is in the panel from the first paint and
                    cross-fades with the list in the same grid cell, so going
                    into one and coming back out is a change of opacity
                    rather than anything moving. */}
                {SECTIONS.map((section) => (
                    <div
                        key={section.id}
                        className={
                            page?.id === section.id
                                ? 'mv2-screen is-on'
                                : 'mv2-screen'
                        }
                        inert={page?.id !== section.id}
                    >
                        <header className="mv2-head">
                            <button
                                type="button"
                                className="mv2-round"
                                onClick={() => setPage(null)}
                                aria-label="Back"
                            >
                                <ChevronIcon direction="left" />
                            </button>

                            <h2 className="mv2-title">{section.title}</h2>

                            {/* One command is all it takes now: the panel
                                this closes is the only one there is. */}
                            <button
                                type="button"
                                className="mv2-round is-quiet"
                                command="close"
                                commandfor={MENU}
                                aria-label="Close menu"
                            >
                                <CloseIcon />
                            </button>
                        </header>

                        <div className="mv2-body">{section.body}</div>
                    </div>
                ))}
            </dialog>
        </>
    );
}

import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

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

const MENU = 'mv2-menu';

export function Menu() {
    const [page, setPage] = useState<Section | null>(null);
    const panelRef = useRef<HTMLDialogElement>(null);

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.currentTarget.blur();
        setPage(null);

        const panel = panelRef.current;
        panel?.showModal();
    };

    const openPage = (section: Section) => () => {
        setPage(section);
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
            >
                <div
                    className={`mv2-screen is-root ${!page ? 'is-on' : ''}`}
                    inert={page !== null}
                >
                    <header className="mv2-brand">
                        <img
                            src="./images/menuTitleV4.webp"
                            height="132px"
                            className=".mv2-wordmark"
                        />
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

                    <footer className="mv2-foot">
                        <span>Enjoy the ride.</span>
                        <SunIcon />
                    </footer>
                </div>

                {SECTIONS.map((section) => (
                    <div
                        key={section.id}
                        className={`mv2-screen ${
                            page?.id === section.id ? 'is-on' : ''
                        }`}
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

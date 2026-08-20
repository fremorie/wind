import type { ReactNode } from 'react';

// One page per section, so every one of these has a hard budget: fifteen
// ruled lines below the title. Adding a line to a full page pushes the last
// one off the bottom of the sheet - there is no scrollbar to catch it.

export interface Section {
    id: string;
    label: string;
    title: string;
    body: ReactNode;
}

// Mirrors the KeyboardControls map in App.tsx. Space/'jump' is deliberately
// absent: it is in the map but nothing reads it yet, and a menu that lists
// keys which do nothing is worse than one that lists fewer.
const BINDINGS: { keys: string[]; action: string }[] = [
    { keys: ['W', '↑'], action: 'pedal forward' },
    { keys: ['S', '↓'], action: 'slow down' },
    { keys: ['A', '←'], action: 'lean left' },
    { keys: ['D', '→'], action: 'lean right' },
    { keys: ['Shift'], action: 'sprint' },
];

const REPO_URL = 'https://github.com/fremorie/wind';

export const SECTIONS: Section[] = [
    {
        id: 'about',
        label: 'About',
        title: 'About',
        body: (
            <>
                <p>
                    A small game about a bicycle, an open road and the sound of
                    moving air.
                </p>
                <p>
                    There is no score and nowhere in particular to be. Point the
                    wheel at the horizon and pedal.
                </p>
                <p className="menu-note">
                    Built as a way to learn three.js, one hill at a time.
                </p>
            </>
        ),
    },
    {
        id: 'controls',
        label: 'Controls',
        title: 'Controls',
        body: (
            <>
                {BINDINGS.map(({ keys, action }) => (
                    <div className="menu-binding" key={action}>
                        <span>
                            {keys.map((key) => (
                                <kbd className="menu-key" key={key}>
                                    {key}
                                </kbd>
                            ))}
                        </span>
                        <span>{action}</span>
                    </div>
                ))}
                <p className="menu-note">
                    On a phone, drag the circle in the corner instead.
                </p>
            </>
        ),
    },
    {
        id: 'credits',
        label: 'Credits',
        title: 'Credits',
        body: (
            <>
                <p>Made by Daria Borisiak.</p>
                <ul className="menu-list">
                    <li>three.js</li>
                    <li>React Three Fiber &amp; drei</li>
                    <li>Rapier, for the physics</li>
                    <li>Vite, for the fast reloads</li>
                </ul>
                <p className="menu-note">
                    Fonts: Caveat and Patrick Hand, via Google Fonts.
                </p>
            </>
        ),
    },
    {
        id: 'bug',
        label: 'Report a bug',
        title: 'Found a bug?',
        body: (
            <>
                <p>
                    A wheel through the road? A cow in a tree? The horizon
                    somewhere it should not be?
                </p>
                <p>
                    Write it down here:
                    <br />
                    <a
                        className="menu-link"
                        href={`${REPO_URL}/issues/new`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        github.com/fremorie/wind
                    </a>
                </p>
                <p className="menu-note">
                    What you did, what happened, what you expected instead.
                </p>
            </>
        ),
    },
];

import type { ReactNode } from 'react';

import { Arrow } from './Arrow';
import { ExternalLink, PolyLink } from './links';

// One page per section, so every one of these has a hard budget: twelve
// ruled lines below the title. The sheet is a photograph with a drawing
// along the bottom of it, and the last rules run through the trees; adding a
// line to a full page puts the words on top of them, and there is no
// scrollbar to catch it.

export interface Section {
    id: string;
    label: string;
    title: string;
    // File name in public/images/icons, without the extension.
    icon: string;
    body: ReactNode;
}

const REPO_URL = 'https://github.com/fremorie/wind';

// Listed in the order they appear on the root menu, after Resume - which
// closes the menu rather than opening a page, so it does not live here.
export const SECTIONS: Section[] = [
    {
        id: 'controls',
        label: 'Controls',
        title: 'Controls',
        icon: 'help',
        // Drawn in the shape the keys actually sit in rather than listed one
        // under the other: up first, then the bottom row left to right.
        //
        // WASD is bound too - see the KeyboardControls map in App.tsx - but
        // showing one cluster says everything the other one would. Space is
        // in the map as well and deliberately absent here: nothing reads it
        // yet, and a menu that lists keys which do nothing is worse than one
        // that lists fewer.
        body: (
            <>
                <div className="menu-keyboard">
                    <div className="menu-cluster">
                        <kbd className="menu-key">
                            <Arrow direction="up" label="Up" />
                        </kbd>
                        <kbd className="menu-key">
                            <Arrow direction="left" label="Left" />
                        </kbd>
                        <kbd className="menu-key">
                            <Arrow direction="down" label="Down" />
                        </kbd>
                        <kbd className="menu-key">
                            <Arrow direction="right" label="Right" />
                        </kbd>
                    </div>
                </div>

                {/* A line each, broken on purpose rather than left to wrap:
                    the two sentences are two separate things to know. */}
                <p className="menu-caption">
                    Use the arrow keys to ride.
                    <br />
                    Hold <kbd className="menu-key">Shift</kbd> to sprint.
                </p>
            </>
        ),
    },
    {
        id: 'credits',
        label: 'Credits',
        title: 'Credits',
        icon: 'star',
        // Eleven of the twelve rules: two paragraphs at two each (a line
        // plus the blank rule after it) and seven list items at one apiece.
        // Every line is measured to fit the 355px column at 19px, so none of
        // them wraps - one that did would spend the last rule and put the
        // next one through the drawing at the foot of the page.
        //
        // The two Quaternius models both called Tree share a line, since two
        // items reading "Tree" would look like a mistake.
        body: (
            <>
                <p>Made by Daria Borisiak.</p>
                <p>
                    Models by{' '}
                    <ExternalLink href="https://poly.pizza/u/Quaternius">
                        Quaternius
                    </ExternalLink>
                    , via{' '}
                    <ExternalLink href="https://poly.pizza">
                        poly.pizza
                    </ExternalLink>
                    :
                </p>
                <ul className="menu-list">
                    <li>
                        <PolyLink id="j4KsIuJYnq">Small Bridge</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="q1N3xn2SpC">Big barn</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="DM0F8siLam">Chicken Coop</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="5GhLrv5Ce3">Silo</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="26zM1outCr">Cow</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="RieYOsjDj8">Birch tree dead</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="b0boebSV1r">Tree</PolyLink>, and{' '}
                        <PolyLink id="1BkD9JnKrE">another Tree</PolyLink>
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: 'about',
        label: 'About',
        title: 'About',
        icon: 'info',
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
                    <br />
                    The source is on{' '}
                    <ExternalLink href={REPO_URL}>Github</ExternalLink>.
                </p>
            </>
        ),
    },
];

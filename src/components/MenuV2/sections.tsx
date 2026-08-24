import type { ReactNode } from 'react';

import {
    ArrowIcon,
    InfoIcon,
    JoystickIcon,
    KeyboardIcon,
    StarIcon,
} from './icons';
import { ExternalLink, PolyLink } from './links';

export interface Section {
    id: string;
    label: string;
    title: string;
    icon: ReactNode;
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
        icon: <KeyboardIcon />,
        // The keys are drawn in the shape they actually sit in rather than
        // listed one under the other: up first, then the bottom row left to
        // right. WASD is bound too - see the KeyboardControls map in
        // App.tsx - but showing one cluster says everything the other one
        // would.
        body: (
            <>
                <h3 className="mv2-subtitle">Desktop</h3>

                <div className="mv2-cluster">
                    <kbd className="mv2-key">
                        <ArrowIcon direction="up" label="Up" />
                    </kbd>
                    <kbd className="mv2-key">
                        <ArrowIcon direction="left" label="Left" />
                    </kbd>
                    <kbd className="mv2-key">
                        <ArrowIcon direction="down" label="Down" />
                    </kbd>
                    <kbd className="mv2-key">
                        <ArrowIcon direction="right" label="Right" />
                    </kbd>
                </div>

                <p className="mv2-text">
                    Use the arrow keys to ride. Hold{' '}
                    <kbd className="mv2-key is-wide">Shift</kbd> to sprint.
                </p>

                <h3 className="mv2-subtitle">Mobile</h3>

                <div className="mv2-diagram">
                    <JoystickIcon />
                </div>

                {/* The stick is the only control on a phone - it steers and
                    it is the throttle at once - so the line is about how far
                    you push it rather than about which button does what. */}
                <p className="mv2-text">Drag the knob. Further out, faster.</p>
            </>
        ),
    },
    {
        id: 'credits',
        label: 'Credits',
        title: 'Credits',
        icon: <StarIcon />,
        body: (
            <>
                <p className="mv2-text">Made by Daria Borisiak.</p>
                <p className="mv2-text">
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
                <ul className="mv2-list">
                    <li>
                        <PolyLink id="j4KsIuJYnq">Small Bridge</PolyLink>
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
        icon: <InfoIcon />,
        body: (
            <>
                <p className="mv2-text">
                    A small game about a bicycle, an open road and the sound of
                    moving air.
                </p>
                <p className="mv2-text">
                    There is no score and nowhere in particular to be. Point the
                    wheel at the horizon and pedal.
                </p>
                <p className="mv2-text is-dim">
                    Built as a way to learn three.js, one hill at a time. The
                    source is on{' '}
                    <ExternalLink href={REPO_URL}>Github</ExternalLink>.
                </p>
            </>
        ),
    },
];

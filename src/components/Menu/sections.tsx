import type { CSSProperties, ReactNode } from 'react';

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
        // A description list, one row per control: the key on the left, what
        // it does on the right. The keys are drawn in the shape they
        // actually sit in rather than listed one under the other - up
        // first, then the bottom row left to right. WASD is bound too - see
        // the KeyboardControls map in App.tsx - but showing one cluster says
        // everything the other one would.
        //
        // The captions are short because the picture beside them is doing
        // the naming. "Use the arrow keys to ride" next to a drawing of the
        // arrow keys spends most of its words on what the reader is already
        // looking at.
        body: (
            <>
                <h3 className="mv2-subtitle">Desktop</h3>

                {/* Two pairs, so this list is worth twice the height of
                    the one below it and every row on the page comes out the
                    same size. See .mv2-body:has(.mv2-spec) in Menu.css. */}
                <dl
                    className="mv2-spec"
                    style={{ '--rows': 2 } as CSSProperties}
                >
                    <dt>
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
                    </dt>
                    <dd>Ride and steer.</dd>

                    <dt>
                        <kbd className="mv2-key is-wide">Shift</kbd>
                    </dt>
                    <dd>Hold to sprint.</dd>
                </dl>

                <h3 className="mv2-subtitle">Mobile</h3>

                {/* The stick is the only control on a phone - it steers and
                    it is the throttle at once - so the line is about how far
                    you push it rather than about which button does what. */}
                <dl className="mv2-spec">
                    <dt>
                        <JoystickIcon />
                    </dt>
                    <dd>Drag the knob. Further out, faster.</dd>
                </dl>
            </>
        ),
    },
    {
        id: 'credits',
        label: 'Credits',
        title: 'Credits',
        icon: <StarIcon />,
        // Two lists under one heading, each with a line naming where its
        // models came from. The lines are `is-lead` rather than another
        // subtitle: "3D models" is the section, and these are the two
        // halves of it, so they sit a step below - a shade of weight and
        // half the margin, which puts each of them on the list it
        // introduces rather than between two of them.
        body: (
            <>
                <p className="mv2-text">Made by Daria Borisiak.</p>

                <h3 className="mv2-subtitle">3D models</h3>

                <p className="mv2-text is-lead">
                    This project uses the following models by{' '}
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
                        <PolyLink id="b0boebSV1r">Tree</PolyLink>
                    </li>
                    <li>
                        <PolyLink id="1BkD9JnKrE">Tree</PolyLink>
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

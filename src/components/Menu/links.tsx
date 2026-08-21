import type { ReactNode } from 'react';

// Every link in the menu leaves the page for good, so target and rel belong
// to the component rather than to each call site: one place to get the
// noreferrer right, and no way to forget it on the next one.
export function ExternalLink({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <a className="menu-link" href={href} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

const POLY_PIZZA = 'https://poly.pizza';

// Every borrowed model is a poly.pizza /m/ page, so the credits list only
// ever varies by the id and the name. The attribution each one is taken from
// lives in the README.md next to the .glb under public/models.
export function PolyLink({
    id,
    children,
}: {
    id: string;
    children: ReactNode;
}) {
    return (
        <ExternalLink href={`${POLY_PIZZA}/m/${id}`}>{children}</ExternalLink>
    );
}

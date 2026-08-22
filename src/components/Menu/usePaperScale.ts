import { useCallback, useLayoutEffect, useRef } from 'react';

// Fits the sheet to the viewport by measuring it, rather than in CSS.
//
// CSS cannot divide one length by another - calc() refuses to cancel units -
// and the documented way round that is tan(atan2(a, b)), which is what this
// used to be. WebKit evaluates that expression and hands back a *negative*
// number, and scale(-n) is a 180deg rotation, so the whole menu came up
// upside down on iOS. There is no CSS-side guard worth having here: the
// division is the part that is broken, so it has to happen somewhere else.
//
// The design size stays in the stylesheet, where the photograph's geometry
// already lives. This only reads it back off the laid-out element.

// Breathing room at the edges, in CSS px. Was the 48px inside the old
// min(); nothing in the stylesheet needs it now.
const MARGIN = 48;

export function usePaperScale(open: boolean) {
    // The element carrying the transform, and the one whose layout size *is*
    // the design size.
    const sheetRef = useRef<HTMLDivElement>(null);
    const paperRef = useRef<HTMLDivElement>(null);

    const fit = useCallback(() => {
        const sheet = sheetRef.current;
        const paper = paperRef.current;
        if (!sheet || !paper) return;

        // offsetWidth/Height are layout values: they ignore the transform
        // this is about to set, so the measurement cannot feed back on
        // itself the way getBoundingClientRect() would. They round to whole
        // pixels, which on a ~514px sheet is a rounding error of 0.01%.
        const { offsetWidth: paperW, offsetHeight: paperH } = paper;

        // Zero while the dialog is closed and display: none. Nothing to
        // measure and nothing on screen to be wrong, so leave it be.
        if (!paperW || !paperH) return;

        // innerWidth/innerHeight are what 100dvw/100dvh were reaching for:
        // on iOS they track the address bar collapsing, and unlike
        // visualViewport they hold still under pinch-zoom, so zooming in
        // does not shrink the sheet away from you.
        const scale = Math.min(
            1, // never scales up past the design size - it would only blur
            (window.innerWidth - MARGIN) / paperW,
            (window.innerHeight - MARGIN) / paperH,
        );

        sheet.style.setProperty('--paper-scale', String(scale));
    }, []);

    useLayoutEffect(() => {
        if (!open) return;

        // Before paint, so the sheet is never seen at its unscaled size.
        fit();

        // Both, deliberately. window resize carries orientation changes,
        // and visualViewport fires the more reliably of the two on iOS when
        // the address bar slides away without the layout viewport changing.
        window.addEventListener('resize', fit);
        window.visualViewport?.addEventListener('resize', fit);

        return () => {
            window.removeEventListener('resize', fit);
            window.visualViewport?.removeEventListener('resize', fit);
        };
    }, [open, fit]);

    return { sheetRef, paperRef };
}

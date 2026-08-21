import { useRef, useState, type MouseEvent } from 'react';

// The plumbing a <dialog> needs and nothing about what any one dialog means.
//
// showModal() is what makes a dialog an actual modal rather than a div that
// looks like one: the rest of the page goes inert, focus is trapped inside
// and handed back to the trigger on close, Escape closes, and the dialog
// renders in the top layer above the canvas without any z-index. All of that
// is behaviour we would otherwise be hand-rolling and getting subtly wrong.
//
// `onClosed` runs after the dialog has closed, for whatever state the caller
// wants reset before it is next opened.
export function useModalDialog(onClosed?: () => void) {
    const [open, setOpen] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Where the last press started, to tell a click on the backdrop from the
    // end of a drag that began inside the dialog. See onClick below.
    const pressOriginRef = useRef<EventTarget | null>(null);

    const close = () => dialogRef.current?.close();

    return {
        open,
        close,

        triggerProps: {
            ref: triggerRef,
            'aria-haspopup': 'dialog' as const,
            'aria-expanded': open,
            onClick: () => {
                dialogRef.current?.showModal();
                setOpen(true);
            },
        },

        dialogProps: {
            ref: dialogRef,

            onClose: () => {
                setOpen(false);
                onClosed?.();

                // Closing a dialog hands focus back to whatever opened it.
                // Left there, the next arrow key - a gameplay key here, not
                // navigation - is enough to make the browser call that focus
                // keyboard-driven and light the trigger up for the rest of
                // the ride. Nothing else on the page wants the focus, so
                // drop it.
                //
                // In a task, not inline: the browser restores that focus
                // after this event, so blurring here and now would just be
                // undone a moment later.
                setTimeout(() => triggerRef.current?.blur(), 0);
            },

            onMouseDown: (event: MouseEvent<HTMLDialogElement>) => {
                pressOriginRef.current = event.target;
            },

            // Clicks that land on ::backdrop are dispatched with the dialog
            // itself as the target; anything inside it targets a descendant
            // instead.
            //
            // The target alone is not enough, though: a click is dispatched
            // to the nearest common ancestor of where the press started and
            // where it was released, so selecting a line of text and letting
            // go past the edge of the dialog also targets the dialog - and
            // dismissing it mid-drag is the one thing that gesture must not
            // do. Both ends have to be outside.
            onClick: (event: MouseEvent<HTMLDialogElement>) => {
                const dialog = dialogRef.current;

                if (
                    event.target === dialog &&
                    pressOriginRef.current === dialog
                ) {
                    close();
                }
            },
        },
    };
}

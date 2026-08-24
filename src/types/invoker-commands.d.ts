// The invoker commands the menu is built on - a button that opens or closes
// a <dialog> by id, with no script in between - are HTML, but @types/react
// has not caught up with them. Same for the plain `autofocus` attribute:
// React's own `autoFocus` prop calls focus() on mount instead of writing the
// attribute, and it is the attribute the dialog's focusing steps look for.
declare module 'react' {
    // The type parameter is part of the interface being augmented, so it has
    // to be declared here even though none of these attributes use it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ButtonHTMLAttributes<T> {
        command?: 'show-modal' | 'close';
        commandfor?: string;
        autofocus?: '';
    }
}

export {};

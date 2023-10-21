/// <reference types="react" />
export declare type HostElement = HTMLElement | SVGElement;
export declare type HostPointerEvent<T extends HostElement = HostElement> = Omit<React.PointerEvent<T>, "detail"> & {
    target: Partial<Pick<T, "setPointerCapture" | "releasePointerCapture">>;
};
export declare type HostPointerEventLike = {
    pointerId: number;
};
export declare type HostPointerEventListener<T extends HostElement = HostElement> = (event: HostPointerEvent<T>) => void;
export declare type HostKeyboardEvent<T extends HostElement = HostElement> = Omit<React.KeyboardEvent<T>, "detail">;
export declare type HostKeyboardEventListener<T extends HostElement = HostElement> = (event: HostKeyboardEvent<T>) => void;
export declare type HostFocusEvent<T extends HostElement = HostElement> = Omit<React.FocusEvent<T>, "detail">;
export declare type HostFocusEventListener<T extends HostElement = HostElement> = (event: HostFocusEvent<T>) => void;
export declare type HostEvents<T extends HostElement = HostElement> = {
    onPointerDown: HostPointerEventListener<T>;
    onPointerMove: HostPointerEventListener<T>;
    onPointerUp: HostPointerEventListener<T>;
    onPointerCancel: HostPointerEventListener<T>;
    onKeyDown: HostKeyboardEventListener<T>;
    onKeyUp: HostKeyboardEventListener<T>;
    onFocus: HostFocusEventListener<T>;
    onBlur: HostFocusEventListener<T>;
};

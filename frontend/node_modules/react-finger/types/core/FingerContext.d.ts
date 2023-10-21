import { HostPointerEvent } from "./FingerHostEvents";
export declare type FingerPointer = HostPointerEvent;
export declare type FingerContext = {
    addPointer: (pointer: HostPointerEvent) => void;
    updatePointer: (pointer: HostPointerEvent) => void;
    removePointer: (pointer: HostPointerEvent) => void;
    getPointers: () => HostPointerEvent[];
    getChangedPointers: () => HostPointerEvent[];
    flags: Map<symbol, unknown>;
    cleanTimers: () => void;
    cleanPointers: () => void;
    cleanFlags: (flags?: symbol[]) => void;
    clean: () => void;
};
export declare type FingerPointerContext = FingerContext;
export declare type FingerKeyboardContext = Pick<FingerContext, "flags">;
export declare type FingerFocusContext = Pick<FingerContext, "flags">;
export declare function FingerContext(): FingerContext;

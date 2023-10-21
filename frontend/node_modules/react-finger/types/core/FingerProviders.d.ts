import { FingerKeyboardContext, FingerPointerContext } from "./FingerContext";
import { HostFocusEvent, HostKeyboardEvent, HostPointerEvent } from "./FingerHostEvents";
import { FingerKeyboardEvents } from "./FingerKeyboardEvents";
import { FingerPointerEvents } from "./FingerPointerEvents";
export declare type FingerProviderPointerParams = {
    events: Partial<FingerPointerEvents>;
    context: FingerPointerContext;
    pointer: HostPointerEvent;
};
export declare type FingerProviderPointerHandler = (params: FingerProviderPointerParams) => void;
export declare type FingerProviderKeyboardParams = {
    events: Partial<FingerKeyboardEvents>;
    context: FingerKeyboardContext;
    event: HostKeyboardEvent;
};
export declare type FingerProviderKeyboardHandler = (params: FingerProviderKeyboardParams) => void;
export declare type FingerProviderFocusParams = {
    events: Partial<FingerKeyboardEvents>;
    context: FingerKeyboardContext;
    event: HostFocusEvent;
};
export declare type FingerProviderFocusHandler = (params: FingerProviderFocusParams) => void;
export declare type FingerProvider<N extends string = string, E extends string = string> = Partial<{
    handlePointerWillDown: FingerProviderPointerHandler;
    handlePointerDown: FingerProviderPointerHandler;
    handlePointerWillMove: FingerProviderPointerHandler;
    handlePointerMove: FingerProviderPointerHandler;
    handlePointerWillUp: FingerProviderPointerHandler;
    handlePointerUp: FingerProviderPointerHandler;
    handlePointerWillCancel: FingerProviderPointerHandler;
    handlePointerCancel: FingerProviderPointerHandler;
    handleKeyDown: FingerProviderKeyboardHandler;
    handleKeyUp: FingerProviderKeyboardHandler;
    handleFocus: FingerProviderFocusHandler;
    handleBlur: FingerProviderFocusHandler;
}> & {
    name: N;
    events: E[];
};
export declare function registerFingerProvider(provider: FingerProvider<string, string>): void;
export declare function getAllFingerProviders(): Set<FingerProvider<string, string>>;
export declare function getAllEventNames(): Set<string>;

import { FingerKeyboardEvents } from "./FingerKeyboardEvents";
import { FingerPointerEvents } from "./FingerPointerEvents";
import { HostElement, HostEvents } from "./FingerHostEvents";
export declare type FingerMixEvents<T extends HostElement = HostElement> = HostEvents<T> & FingerPointerEvents<T> & FingerKeyboardEvents<T>;

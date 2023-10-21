import { HostElement, HostEvents } from "./FingerHostEvents";
import { FingerMixEvents } from "./FingerMixEvents";
export declare function composeFingerEvents<T extends HostElement = HostElement>(events: Partial<FingerMixEvents<T>>): HostEvents<T>;

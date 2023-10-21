import { FingerMixEvents } from "../core/FingerMixEvents";
import { HostElement } from "../core/FingerHostEvents";
export declare function useFingerEvents<T extends HostElement = HostElement>(events: Partial<FingerMixEvents<T>>): import("../core/FingerHostEvents").HostEvents<T>;

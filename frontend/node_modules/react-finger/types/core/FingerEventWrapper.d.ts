import { HostKeyboardEvent, HostPointerEvent } from "./FingerHostEvents";
export declare function createEventWrapper<T extends object>(hostEvent: HostPointerEvent | HostKeyboardEvent, fields?: Record<string, unknown>): T;

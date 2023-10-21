/// <reference types="node" />
declare type Timer = number | NodeJS.Timeout;
export declare function createEventTimer(fn: () => void, timeout: number): NodeJS.Timeout;
export declare function clearEventTimer(timer: Timer): boolean;
export declare function clearAllEventTimers(): void;
export {};

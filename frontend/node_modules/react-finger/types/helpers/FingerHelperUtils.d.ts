import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "react";
import { AnyFunction } from "../core/FingerUtils";
export declare type FingerForwardRefExoticComponent<T, P> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
export declare function splitProps(props: Record<string, any>): {
    eventProps: Record<string, AnyFunction>;
    otherProps: Record<string, any>;
};

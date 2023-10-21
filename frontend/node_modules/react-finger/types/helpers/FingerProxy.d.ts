import { HTMLAttributes, ReactNode, SVGAttributes } from "react";
import { AnyFunction } from "../core/FingerUtils";
import { FingerMixEvents } from "../core/FingerMixEvents";
import { HostEvents, HostElement } from "../core/FingerHostEvents";
import { FingerForwardRefExoticComponent } from "./FingerHelperUtils";
declare type FingerProxyEventTarget = {
    addEventListener: (name: string, listener: AnyFunction, options?: unknown) => void;
    removeEventListener: (name: string, listener: AnyFunction, options?: unknown) => void;
};
export declare type FingerProxyProps = Partial<FingerMixEvents> & {
    target?: FingerProxyEventTarget;
    passive?: boolean;
};
export declare const FingerProxy: import("react").NamedExoticComponent<FingerProxyProps>;
export declare type FingerProxyBoundaryProps<T extends HostElement = HostElement> = {
    children: (events: HostEvents<T>) => ReactNode;
} & Partial<HostEvents<T>>;
export declare const FingerProxyBoundary: import("react").MemoExoticComponent<(<T extends HostElement = HostElement>(props: FingerProxyBoundaryProps<T>) => import("react").FunctionComponentElement<import("react").ProviderProps<FingerProxyEventTarget>>)>;
export declare type FingerProxyHTMLContainerProps<T extends HostElement = HostElement> = HTMLAttributes<T> & {
    children?: ReactNode;
    eventBoundary?: boolean;
};
export declare type FingerProxySVGContainerProps<T extends HostElement = HostElement> = SVGAttributes<T> & {
    children?: ReactNode;
    eventBoundary?: boolean;
};
export declare function FingerProxyContainer<T extends keyof HTMLElementTagNameMap>(type: T): FingerForwardRefExoticComponent<HTMLElementTagNameMap[T], FingerProxyHTMLContainerProps<HTMLElementTagNameMap[T]>>;
export declare function FingerProxyContainer<T extends keyof SVGElementTagNameMap>(type: T): FingerForwardRefExoticComponent<SVGElementTagNameMap[T], FingerProxySVGContainerProps<SVGElementTagNameMap[T]>>;
export {};

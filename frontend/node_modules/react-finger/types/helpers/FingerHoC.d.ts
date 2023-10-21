import { HTMLAttributes, SVGAttributes, ReactNode } from "react";
import { FingerMixEvents } from "../core/FingerMixEvents";
import { HostElement } from "../core/FingerHostEvents";
import { FingerForwardRefExoticComponent } from "./FingerHelperUtils";
export declare type FingerHTMLProps<T extends HostElement = HostElement> = HTMLAttributes<T> & Partial<FingerMixEvents<T>> & {
    children?: ReactNode;
};
export declare type FingerSVGProps<T extends HostElement = HostElement> = SVGAttributes<T> & Partial<FingerMixEvents<T>> & {
    children?: ReactNode;
};
export declare function Finger<T extends keyof HTMLElementTagNameMap>(type: T): FingerForwardRefExoticComponent<HTMLElementTagNameMap[T], FingerHTMLProps<HTMLElementTagNameMap[T]>>;
export declare function Finger<T extends keyof SVGElementTagNameMap>(type: T): FingerForwardRefExoticComponent<SVGElementTagNameMap[T], FingerSVGProps<SVGElementTagNameMap[T]>>;

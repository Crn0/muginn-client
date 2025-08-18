import type { PropsWithChildren, ComponentPropsWithRef } from "react";

export type TButtonRef = HTMLButtonElement;

export interface BaseButtonProps extends PropsWithChildren, ComponentPropsWithRef<"button"> {}

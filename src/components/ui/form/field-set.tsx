import type { PropsWithChildren } from "react";

import { cn } from "@/utils";

export interface FieldSetProps extends PropsWithChildren {
  className?: string;
}

export function FieldSet({ children, className = "" }: FieldSetProps) {
  return <fieldset className={cn(className)}>{children}</fieldset>;
}

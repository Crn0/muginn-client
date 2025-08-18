import { cn } from "@/utils";
import type { PropsWithChildren } from "react";

export interface LegendProps extends PropsWithChildren {
  className?: string;
}

export function Legend({ children, className = "" }: LegendProps) {
  return <legend className={cn("text-center font-bold", className)}>{children}</legend>;
}

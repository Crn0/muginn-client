import type { cva, VariantProps } from "class-variance-authority";

export type VariantPropKeys<T extends ReturnType<typeof cva>> = VariantProps<T>;

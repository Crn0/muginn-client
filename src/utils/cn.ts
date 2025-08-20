import { twMerge } from "tailwind-merge";

export const cn = (...ops: string[]) => twMerge(ops);

import { twMerge } from "tailwind-merge";

export default function cn(...ops) {
  return twMerge(ops);
}

import { env } from "../configs";

export const debug = env.NODE_ENV !== "prod" ? (...args: any[]) => console.log(...args) : () => {};

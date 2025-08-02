import { env } from "../configs";

export default env.getValue("nodeEnv") !== "prod" ? (...args) => console.log(...args) : () => {};

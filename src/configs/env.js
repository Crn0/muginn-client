import z from "zod";

const toCamelCase = (str) =>
  str
    .toLowerCase()
    .split("_")
    .map((v, i) => (i === 0 ? v : v[0].toUpperCase() + v.slice(1)))
    .join("");

const envMap = {};

const initEnv = () => {
  const EnvSchema = z.object({
    SERVER_URL: z.string().optional().default("http://localhost:3000"),
    SERVER_MOCK_API_PORT: z.string().optional().default("3000"),
    API_VERSION: z.coerce.number().default(1),
    TOKEN_SECRET: z.string().default("secret"),
    NODE_ENV: z.enum(["prod", "dev", "test"]).default("dev"),
  });

  const env = Object.entries(import.meta.env);

  const envVars = env.reduce((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith("VITE_")) {
      acc[key.replace("VITE_", "")] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}
`
    );
  }

  Object.entries(parsedEnv.data).forEach(([key, value]) => {
    const newKey = toCamelCase(key);
    envMap[newKey] = value;
  });
};

const getValue = (key) => {
  if (!Object.prototype.hasOwnProperty.call(envMap, key))
    throw new Error(`Missing environment variable: ${key}`);

  return envMap[key];
};

const getEnv = () => ({ ...envMap });

initEnv();

export { getValue, getEnv };

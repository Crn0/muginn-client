import z from "zod";

const initEnv = () => {
  const env = Object.entries(import.meta.env);

  const EnvSchema = z.object({
    SERVER_URL: z.string().optional().default("http://localhost:3000"),
    SERVER_MOCK_API_PORT: z.string().optional().default("3000"),
    API_VERSION: z.coerce.number().default(1),
    TOKEN_SECRET: z.string().default("secret"),
    NODE_ENV: z.enum(["prod", "dev", "test"]).default("dev"),
  });

  const envVars = env.reduce<{
    [key: string]: string;
  }>((acc, curr) => {
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

  return parsedEnv.data;
};

export const env = initEnv();

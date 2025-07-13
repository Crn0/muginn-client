import z from "zod";

// https://regexr.com/8dmei
const usernameRegex = /^[a-zA-Z0-9{_,.}]+$/;
// https://regexr.com/8dm04
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const schema = z
  .object({
    displayName: z
      .string()
      .trim()
      .max(36, { message: "Display name must contain at most 36 character(s)" }),
    username: z
      .string()
      .min(4, { message: "Username must contain at least 4 character(s)" })
      .max(36, { message: "Username must contain at most 36 character(s)" })
      .refine((val) => usernameRegex.test(val), {
        message:
          "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , .",
      }),
    password: z.string().refine((val) => passwordRegex.test(val), {
      message:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default schema;

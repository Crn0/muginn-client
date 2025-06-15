import z from "zod";

// https://regexr.com/8dmei
const usernameRegex = /^[a-zA-Z0-9{_,.}]+$/;
// https://regexr.com/8dm04
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const password = z.string().refine((val) => passwordRegex.test(val), {
  message:
    "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number and no spaces",
});

export const usernameSchema = z.object({
  username: z
    .string()
    .min(4)
    .max(36)
    .refine((val) => usernameRegex.test(val), {
      message:
        "Username can only contain letters (A-Z, a-z), numbers (0-9), and the characters: _ , .",
    }),
});

export const passwordSchema = z
  .object({
    oldPassword: password,
    currentPassword: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.currentPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

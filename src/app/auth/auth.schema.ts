import z from "zod";

export const createUserSchema = z.object({
  email: z.string().min(1).max(50).trim().email(),
  username: z.string().min(1).max(50).trim(),
  password: z.string().min(1).max(50).trim(),
  is_seller: z.boolean(),
});

export const signinUserSchema = z.object({
  email: z.string().min(1).max(50).trim().email(),
  password: z.string().min(1).max(50).trim(),
});

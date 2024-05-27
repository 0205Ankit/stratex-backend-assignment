import z from "zod";

export const book_entry_schema = z.object({
  title: z.string().min(1).max(50).trim(),
  author: z.string().min(1).max(50).trim(),
  publishedDate: z.string().min(1).max(11).trim(),
  price: z.number(),
});

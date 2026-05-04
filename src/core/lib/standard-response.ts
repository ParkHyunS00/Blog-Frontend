import { z } from "zod";

const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  description: z.string().nullable(),
  detailErrors: z.unknown().nullable(),
});

export function standardResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    status: z.number(),
    data: dataSchema.nullable(),
    error: apiErrorSchema.nullable(),
  });
}

import { z } from "zod";
import statsSchema from "./Stats";

const heroesSchema = z.object({
  link: z.union([z.undefined(), z.string(), z.null()]),
  imageSource: z.union([z.undefined(), z.string(), z.null()]),
  name: z.union([z.string(), z.null()]),
  stats: z.union([z.undefined(), statsSchema]),
});

export type Heroes = z.infer<typeof heroesSchema>;
export default heroesSchema;

import { z } from "zod";

const statsSchema = z.object({
  health: z.string(),
  attack: z.string(),
  defense: z.string(),
  speed: z.string(),
});

export type Stats = z.infer<typeof statsSchema>;
export default statsSchema;

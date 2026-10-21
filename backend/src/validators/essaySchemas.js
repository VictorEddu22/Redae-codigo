import { z } from 'zod';

export const createEssaySchema = z.object({
  titulo: z.string().trim().max(180).optional().default('Redacao sem titulo'),
  tema: z.string().trim().min(5).max(500),
  texto: z.string().trim().min(100, 'A redacao esta curta demais para uma correcao util.').max(20000),
});

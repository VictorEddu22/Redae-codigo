import { z } from 'zod';

export const profileUpdateSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  telefone: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(500).optional(),
  escolaridade: z.string().trim().max(120).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Informe pelo menos um campo para atualizar.',
});

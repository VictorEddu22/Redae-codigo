import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  telefone: z.string().trim().max(30).optional().default(''),
  senha: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  senha: z.string().min(1).max(100),
});

export const googleSchema = z.object({
  credential: z.string().min(20),
});

export const passwordSchema = z.object({
  senhaAtual: z.string().max(100).optional().default(''),
  novaSenha: z.string().min(8).max(100),
});

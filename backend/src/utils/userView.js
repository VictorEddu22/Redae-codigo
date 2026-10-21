export function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone || '',
    bio: user.bio || '',
    escolaridade: user.escolaridade || '',
    fotoUrl: user.fotoUrl || '',
    authProvider: user.googleSub ? 'google' : 'password',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

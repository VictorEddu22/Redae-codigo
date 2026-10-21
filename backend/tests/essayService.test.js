import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryEssayRepository } from '../src/repositories/memory/InMemoryEssayRepository.js';
import { EssayService } from '../src/services/essayService.js';

const correction = {
  async correct() {
    return {
      nota: 800,
      competencias: ['C1', 'C2', 'C3', 'C4', 'C5'].map((code) => ({ code, label: code, score: 160 })),
      feedback: 'Feedback de teste',
      pontosFortes: ['Ponto forte'],
      pontosMelhorar: ['Ponto a melhorar'],
      proximoTreino: 'Treino seguinte',
    };
  },
};

function createService() {
  return new EssayService(new InMemoryEssayRepository(), correction);
}

test('cria correcao vinculada ao usuario e lista somente resumo', async () => {
  const service = createService();
  const created = await service.createAndCorrect('u1', { titulo: 'Teste', tema: 'Tema de teste', texto: 'Texto de teste com conteudo suficiente.' });
  assert.equal(created.userId, 'u1');
  assert.equal(created.nota, 800);

  const list = await service.list('u1');
  assert.equal(list.length, 1);
  assert.equal(list[0].id, created.id);
  assert.equal('texto' in list[0], false);
  assert.equal('feedback' in list[0], false);
});

test('nao permite que outro usuario leia a redacao', async () => {
  const service = createService();
  const created = await service.createAndCorrect('u1', { titulo: 'Teste', tema: 'Tema de teste', texto: 'Texto de teste com conteudo suficiente.' });
  await assert.rejects(() => service.getById('u2', created.id), (error) => error.code === 'ESSAY_NOT_FOUND');
});

test('calcula evolucao em ordem cronologica', async () => {
  const repo = new InMemoryEssayRepository();
  const service = new EssayService(repo, correction);
  await repo.create({ userId: 'u1', titulo: 'A', tema: 'T', nota: 600, competencias: [], createdAt: '2026-01-01T00:00:00.000Z' });
  await repo.create({ userId: 'u1', titulo: 'B', tema: 'T', nota: 800, competencias: [], createdAt: '2026-02-01T00:00:00.000Z' });
  const result = await service.performance('u1');
  assert.equal(result.evolucao, 200);
  assert.equal(result.media, 700);
  assert.equal(result.melhor, 800);
});

import { createEssaySchema } from '../validators/essaySchemas.js';

export function createEssayController(essayService) {
  return {
    create: async (req, res) => {
      const payload = createEssaySchema.parse(req.body);
      const result = await essayService.createAndCorrect(req.user.id, payload);
      res.status(201).json(result);
    },

    list: async (req, res) => {
      res.json(await essayService.list(req.user.id));
    },

    getById: async (req, res) => {
      res.json(await essayService.getById(req.user.id, req.params.id));
    },

    remove: async (req, res) => {
      await essayService.delete(req.user.id, req.params.id);
      res.status(204).end();
    },

    performance: async (req, res) => {
      res.json(await essayService.performance(req.user.id));
    },
  };
}

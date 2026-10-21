export function createContentController(contentService) {
  return {
    themes: async (_req, res) => res.json(contentService.listThemes()),
    theme: async (req, res) => res.json(contentService.getTheme(req.params.id)),
    models: async (_req, res) => res.json(contentService.listModels()),
    learning: async (_req, res) => res.json(contentService.learning()),
  };
}

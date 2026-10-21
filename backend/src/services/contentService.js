import { themes, essayModels, learningGuide } from '../content/learningContent.js';
import { HttpError } from '../utils/httpError.js';

export class ContentService {
  listThemes() {
    return themes;
  }

  getTheme(id) {
    const theme = themes.find((item) => item.id === id);
    if (!theme) throw new HttpError(404, 'Tema nao encontrado.', 'THEME_NOT_FOUND');
    return theme;
  }

  listModels() {
    return essayModels;
  }

  learning() {
    return learningGuide;
  }
}

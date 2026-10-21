import { AuthService } from './authService.js';
import { ProfileService } from './profileService.js';
import { GeminiEssayCorrectionService } from './geminiEssayCorrectionService.js';
import { EssayService } from './essayService.js';
import { ContentService } from './contentService.js';

export function createServices(repositories) {
  const correction = new GeminiEssayCorrectionService();

  return {
    auth: new AuthService(repositories.users),
    profile: new ProfileService(repositories.users),
    essays: new EssayService(repositories.essays, correction),
    content: new ContentService(),
  };
}

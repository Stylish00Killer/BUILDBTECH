import deepai from 'deepai';
import { AI_CONFIG } from './ai-config';

class DeepAIService {
  constructor() {
    if (!AI_CONFIG.deepai.apiKey) 
;
  }

  async generateImage(description: string): Promise<string> {
    try {
      const result = await deepai.callStandardApi("text2img", {
        text: description,
      });
      return result.output_url;
    } catch (error) {
      console.error('DeepAI API Error:', error);
      throw new Error('Failed to generate image with DeepAI');
    }
  }

  async generateUserAvatar(name: string): Promise<string> {
    return this.generateImage(`Professional avatar for ${name}, educational setting, professional style`);
  }
}

export const deepAIService = new DeepAIService();
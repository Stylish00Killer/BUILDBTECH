import axios from 'axios';
import { AI_CONFIG } from './ai-config';

class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor() {
    this.apiKey = AI_CONFIG.huggingface.apiKey!;
  }

  private async query(model: string, inputs: any) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${model}`,
        { inputs },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('HuggingFace API Error:', error);
      throw new Error('Failed to query HuggingFace API');
    }
  }

  async generateEducationalContent(topic: string): Promise<string> {
    const model = AI_CONFIG.huggingface.models.textGeneration;
    const prompt = `Generate an educational explanation about ${topic}:`;
    const result = await this.query(model, prompt);
    return result[0].generated_text;
  }

  async analyzeLearningStyle(text: string): Promise<string> {
    const model = AI_CONFIG.huggingface.models.textClassification;
    const result = await this.query(model, text);
    return result[0].label;
  }

  async generateQuizQuestions(content: string): Promise<string> {
    const model = AI_CONFIG.huggingface.models.textGeneration;
    const prompt = `Generate multiple choice questions based on this content: ${content}`;
    const result = await this.query(model, prompt);
    return result[0].generated_text;
  }

  async provideLearningRecommendations(subject: string, learningStyle: string): Promise<string> {
    const model = AI_CONFIG.huggingface.models.textGeneration;
    const prompt = `Provide personalized learning recommendations for ${subject} considering ${learningStyle} learning style.`;
    const result = await this.query(model, prompt);
    return result[0].generated_text;
  }
}

export const huggingFaceService = new HuggingFaceService();

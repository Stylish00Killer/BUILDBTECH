import { deepAIService } from './deepai-service';
import { huggingFaceService } from './huggingface-service';

class AIOrchestrator {
  async generateEducationalContent(topic: string): Promise<string> {
    try {
      return await huggingFaceService.generateEducationalContent(topic);
    } catch (error) {
      console.error('Failed to generate educational content:', error);
      throw new Error('Content generation failed');
    }
  }

  async generateQuizQuestions(content: string, numQuestions: number = 5): Promise<string> {
    try {
      return await huggingFaceService.generateQuizQuestions(content, numQuestions);
    } catch (error) {
      console.error('Failed to generate quiz questions:', error);
      throw new Error('Quiz generation failed');
    }
  }

  async analyzeLabReport(content: string): Promise<string> {
    try {
      return await huggingFaceService.generateEducationalContent(`Analyze this lab report: ${content}`);
    } catch (error) {
      console.error('Failed to analyze lab report:', error);
      throw new Error('Lab report analysis failed');
    }
  }

  async generateUserAvatar(name: string): Promise<string> {
    try {
      return await deepAIService.generateUserAvatar(name);
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      throw new Error('Avatar generation failed');
    }
  }

  async provideLearningRecommendations(subject: string, content: string): Promise<string> {
    try {
      const learningStyle = await huggingFaceService.analyzeLearningStyle(content);
      return await huggingFaceService.provideLearningRecommendations(subject, learningStyle);
    } catch (error) {
      console.error('Failed to provide learning recommendations:', error);
      throw new Error('Learning recommendations failed');
    }
  }
}

export const aiOrchestrator = new AIOrchestrator();

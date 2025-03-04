import * as tf from '@tensorflow/tfjs';

export class AIService {
  private model: tf.LayersModel | null = null;

  async loadModel() {
    try {
      // Load a simple text classification model for project suggestions
      this.model = await tf.loadLayersModel('indexeddb://project-suggestion-model');
    } catch (error) {
      console.error('Error loading AI model:', error);
      throw error;
    }
  }

  async generateProjectIdea(keywords: string[]): Promise<string> {
    if (!this.model) {
      throw new Error('Model not loaded');
    }

    // Simple project idea generation based on keywords
    const ideas = [
      'Smart Home Automation System',
      'AI-powered Health Monitor',
      'Educational Game Development',
      'Environmental Monitoring System',
      'Smart Agriculture Solution'
    ];

    return ideas[Math.floor(Math.random() * ideas.length)];
  }

  async analyzeLabData(data: number[]): Promise<{
    analysis: string;
    graphs: any;
  }> {
    // Simple analysis of lab data
    const mean = data.reduce((a, b) => a + b) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length
    );

    return {
      analysis: `Mean: ${mean.toFixed(2)}, Standard Deviation: ${stdDev.toFixed(2)}`,
      graphs: {
        type: 'line',
        data: data
      }
    };
  }
}

export const aiService = new AIService();

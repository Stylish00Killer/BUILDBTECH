import axios from 'axios';

interface OllamaResponse {
  response: string;
  context?: number[];
}

export class OllamaService {
  private baseUrl = 'http://localhost:11434/api';
  private modelName = 'deepseek-r1:8b';

  private async isOllamaAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/tags`);
      return true;
    } catch {
      return false;
    }
  }

  async generateLabReport(experimentData: string, observations: string): Promise<string> {
    const isAvailable = await this.isOllamaAvailable();
    if (!isAvailable) {
      throw new Error('Ollama service is not available. Please ensure Ollama is running with deepseek-r1:8b model.');
    }

    try {
      const prompt = `As a scientific lab report generator, analyze the following experimental data and observations to create a detailed lab report.
      
      Experimental Data:
      ${experimentData}
      
      Observations:
      ${observations}
      
      Please generate a complete lab report with the following sections:
      1. Introduction
      2. Methods
      3. Results
      4. Discussion
      5. Conclusion`;

      const response = await axios.post<OllamaResponse>(`${this.baseUrl}/generate`, {
        model: this.modelName,
        prompt,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      console.error('Error generating lab report:', error);
      throw new Error('Failed to generate lab report. Please check if Ollama is running correctly.');
    }
  }

  async analyzeData(data: number[]): Promise<{
    analysis: string;
    recommendations: string;
  }> {
    const isAvailable = await this.isOllamaAvailable();
    if (!isAvailable) {
      throw new Error('Ollama service is not available. Please ensure Ollama is running with deepseek-r1:8b model.');
    }

    try {
      const prompt = `Analyze the following numerical data and provide statistical insights and recommendations:
      
      Data points: ${data.join(', ')}
      
      Please provide:
      1. Statistical analysis (mean, median, standard deviation)
      2. Key trends or patterns
      3. Recommendations based on the data`;

      const response = await axios.post<OllamaResponse>(`${this.baseUrl}/generate`, {
        model: this.modelName,
        prompt,
        stream: false
      });

      return {
        analysis: response.data.response,
        recommendations: response.data.response.split('Recommendations:')[1]?.trim() || ''
      };
    } catch (error) {
      console.error('Error analyzing data:', error);
      throw new Error('Failed to analyze data. Please check if Ollama is running correctly.');
    }
  }
}

export const ollamaService = new OllamaService();

import axios from 'axios';

interface OllamaResponse {
  response: string;
  context?: number[];
}

interface OllamaStatus {
  isAvailable: boolean;
  modelLoaded: boolean;
  error?: string;
}

export class OllamaService {
  private baseUrl = 'http://localhost:11434/api';
  private modelName = 'deepseek-r1:8b';
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  private async retry<T>(fn: () => Promise<T>, retries = this.maxRetries): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retry(fn, retries - 1);
      }
      throw error;
    }
  }

  async checkStatus(): Promise<OllamaStatus> {
    try {
      // First check if Ollama service is running
      await axios.get(`${this.baseUrl}/version`);

      // Then check if our model is available
      const response = await axios.post(`${this.baseUrl}/generate`, {
        model: this.modelName,
        prompt: "Test connection",
        stream: false
      });

      return {
        isAvailable: true,
        modelLoaded: true
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          return {
            isAvailable: false,
            modelLoaded: false,
            error: 'Ollama service is not running. Please start Ollama with: ollama run deepseek-r1:8b'
          };
        }
        return {
          isAvailable: true,
          modelLoaded: false,
          error: 'Model deepseek-r1:8b is not available. Please run: ollama run deepseek-r1:8b'
        };
      }
      return {
        isAvailable: false,
        modelLoaded: false,
        error: 'Unknown error occurred while checking Ollama status'
      };
    }
  }

  async generateLabReport(experimentData: string, observations: string): Promise<string> {
    const status = await this.checkStatus();
    if (!status.isAvailable || !status.modelLoaded) {
      throw new Error(status.error || 'Ollama service is not available');
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

      const response = await this.retry(async () => {
        const result = await axios.post<OllamaResponse>(`${this.baseUrl}/generate`, {
          model: this.modelName,
          prompt,
          stream: false
        });
        return result.data.response;
      });

      return response;
    } catch (error) {
      console.error('Error generating lab report:', error);
      throw new Error('Failed to generate lab report. Please check if Ollama is running correctly.');
    }
  }

  async analyzeData(data: number[]): Promise<{
    analysis: string;
    recommendations: string;
  }> {
    const status = await this.checkStatus();
    if (!status.isAvailable || !status.modelLoaded) {
      throw new Error(status.error || 'Ollama service is not available');
    }

    try {
      const prompt = `Analyze the following numerical data and provide statistical insights and recommendations:

      Data points: ${data.join(', ')}

      Please provide:
      1. Statistical analysis (mean, median, standard deviation)
      2. Key trends or patterns
      3. Recommendations based on the data`;

      const response = await this.retry(async () => {
        const result = await axios.post<OllamaResponse>(`${this.baseUrl}/generate`, {
          model: this.modelName,
          prompt,
          stream: false
        });
        return result.data.response;
      });

      const [analysis, recommendations] = response.split('Recommendations:');

      return {
        analysis: analysis.trim(),
        recommendations: recommendations?.trim() || 'No recommendations available.'
      };
    } catch (error) {
      console.error('Error analyzing data:', error);
      throw new Error('Failed to analyze data. Please check if Ollama is running correctly.');
    }
  }
}

export const ollamaService = new OllamaService();
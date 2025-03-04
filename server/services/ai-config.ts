// AI Service Configuration
export const AI_CONFIG = {
  deepai: {
    apiKey: process.env.DEEPAI_API_KEY,
  },
  googleCloud: {
    apiKey: process.env.GOOGLE_CLOUD_API_KEY,
  },
  edenAI: {
    apiKey: process.env.EDEN_AI_API_KEY,
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    // Use free models for text generation and analysis
    models: {
      textGeneration: "gpt2",
      textClassification: "distilbert-base-uncased",
    }
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: "gpt-3.5-turbo",
  }
};
export type ModelModality = "LLM" | "Reasoning" | "Multimodal" | "Vision" | "Audio";

export interface ModelBenchmark {
  name: string;
  score: number;
}

export interface AiModel {
  id: string;
  name: string;
  organization: string; // "Anthropic", "DeepSeek", "Meta", "Google", "Mistral", etc.
  architecture: string; // "Dense Transformer", "MoE (Mixture of Experts)", "Diffusion Transformer"
  modality: ModelModality;
  contextWindow: string; // e.g. "128K", "200K", "1M"
  parameters: string; // e.g. "70B", "671B (37B active)"
  openWeights: boolean;
  license: string; // "Apache-2.0", "MIT", "Llama 3.3 Community", "Proprietary API"
  benchmarks: ModelBenchmark[]; // e.g. MMLU, HumanEval, MATH, Arena Elo
  summary: string;
  modelUrl: string; // Working direct Hugging Face or official lab release link
  paperUrl?: string; // Direct ArXiv or research paper link
  releasedAt: string;
  downloads?: number;
  likes?: number;
  trendingScore?: number;
  rank?: number;       // LMSYS Arena ranking position
  eloScore?: number;   // LMSYS Chatbot Arena Elo score
}

export interface ModelsApiResponse {
  success: boolean;
  source: "live" | "fallback" | "hybrid";
  total: number;
  timestamp: string;
  models: AiModel[];
}

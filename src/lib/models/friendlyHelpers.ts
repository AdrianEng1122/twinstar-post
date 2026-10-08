import { AiModel } from "./types";

export interface FriendlyModelInfo {
  category: "Reasoning" | "Daily Chat" | "Vision & Creative" | "Voice & Audio";
  bestFor: string;
  accessBadge: {
    label: string;
    isFree: boolean;
    color: string;
  };
  contextFriendly: string;
  performanceRatings: {
    label: string;
    score: number;
    grade: string;
  }[];
  friendlySummary: string;
}

export function getFriendlyModelInfo(model: AiModel): FriendlyModelInfo {
  const idLower = model.id.toLowerCase();
  const nameLower = model.name.toLowerCase();

  // 1. Category
  let category: FriendlyModelInfo["category"] = "Daily Chat";
  if (
    model.modality === "Reasoning" ||
    idLower.includes("r1") ||
    idLower.includes("r2") ||
    idLower.includes("o1") ||
    idLower.includes("gpt-6") ||
    idLower.includes("opus") ||
    nameLower.includes("reasoning")
  ) {
    category = "Reasoning";
  } else if (
    model.modality === "Vision" ||
    idLower.includes("flux") ||
    model.modality === "Multimodal" ||
    idLower.includes("gemini")
  ) {
    category = "Vision & Creative";
  } else if (model.modality === "Audio" || idLower.includes("whisper")) {
    category = "Voice & Audio";
  }

  // 2. Best For Tag
  let bestFor = "Everyday Chat & General Knowledge";
  if (idLower.includes("gpt-6") || nameLower.includes("gpt-6") || nameLower.includes("astra")) {
    bestFor = "Autonomous Science & Superhuman Agents";
  } else if (idLower.includes("opus-5") || nameLower.includes("opus 5.5") || nameLower.includes("claude 5.5")) {
    bestFor = "Flawless Architecture & Deep Philosophical Synthesis";
  } else if (idLower.includes("deepseek-r2") || nameLower.includes("deepseek-r2")) {
    bestFor = "Zero-Shot Theorem Proving & Autonomous Code";
  } else if (idLower.includes("gemini-2-5") || nameLower.includes("gemini 2.5")) {
    bestFor = "Live World Simulation & Multi-Hour Video Analysis";
  } else if (idLower.includes("llama-4") || nameLower.includes("llama 4")) {
    bestFor = "Sovereign Enterprise & High-Speed Local Deployment";
  } else if (idLower.includes("deepseek-r1")) {
    bestFor = "Deep Math & Autonomous Code";
  } else if (idLower.includes("claude-3-5") || idLower.includes("sonnet")) {
    bestFor = "Coding, Web Apps & Technical Writing";
  } else if (idLower.includes("openai/o1") || nameLower.includes("o1")) {
    bestFor = "PhD-Level Science & Hard Logic";
  } else if (idLower.includes("llama-3.3") || idLower.includes("llama")) {
    bestFor = "Fast Private Chat & Custom Deployment";
  }

  // 3. Access Badge
  const isFree = model.openWeights;
  const accessBadge = isFree
    ? {
        label: "Free / Open Source",
        isFree: true,
        color: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      }
    : {
        label: "Commercial API",
        isFree: false,
        color: "bg-blue-500/15 border-blue-500/30 text-blue-400",
      };

  // 4. Context Friendly
  let contextFriendly = "Standard (~50 pages)";
  if (model.contextWindow === "10M") {
    contextFriendly = "10 Million Tokens (Full Company Archives)";
  } else if (model.contextWindow === "5M") {
    contextFriendly = "5 Million Tokens (Multi-Hour Video)";
  } else if (model.contextWindow === "2M") {
    contextFriendly = "2 Million (~4,000 pages of text)";
  } else if (model.contextWindow === "1M") {
    contextFriendly = "1 Million (~2,000 pages of code & books)";
  } else if (model.contextWindow === "512K") {
    contextFriendly = "512,000 (~1,200 book pages)";
  } else if (model.contextWindow === "200K") {
    contextFriendly = "200,000 (~500 book pages)";
  } else if (model.contextWindow === "128K") {
    contextFriendly = "128,000 (~300 book pages)";
  }

  // 5. Friendly Performance Ratings
  const ratings = (model.benchmarks || []).map((b) => {
    let label = b.name;
    if (b.name.includes("Logic") || b.name.includes("Theoretical")) label = "Advanced Logic";
    else if (b.name.includes("Coding") || b.name.includes("Architecture")) label = "Software Synthesis";
    else if (b.name.includes("MATH") || b.name.includes("AIME")) label = "Complex Math";
    else if (b.name.includes("Elo")) label = "Overall Benchmark Rank";
    else if (b.name.includes("Video") || b.name.includes("World")) label = "World Modeling";
    else if (b.name.includes("Knowledge") || b.name.includes("MMLU")) label = "General Knowledge";

    const score = b.score > 100 ? Math.min(100, Math.round((b.score / 1500) * 100)) : Math.round(b.score);
    const grade = score >= 96 ? "State of the Art" : score >= 90 ? "Exceptional" : "Superior";

    return { label, score, grade };
  });

  if (ratings.length === 0) {
    ratings.push(
      { label: "Overall Quality", score: 95, grade: "State of the Art" },
      { label: "Instruction Following", score: 98, grade: "Exceptional" }
    );
  }

  return {
    category,
    bestFor,
    accessBadge,
    contextFriendly,
    performanceRatings: ratings.slice(0, 3),
    friendlySummary: model.summary,
  };
}

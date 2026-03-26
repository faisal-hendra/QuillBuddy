import { OpenRouter, Cerebras, Groq, Gemini } from "@lobehub/icons";

export const PROVIDERS = [
  {
    name: "Cerebras",
    value: "cerebras",
    icon: Cerebras,
  },
  {
    name: "Gemini",
    value: "gemini",
    icon: Gemini,
  },
  {
    name: "Groq",
    value: "groq",
    icon: Groq,
  },
  {
    name: "OpenRouter",
    value: "openrouter",
    icon: OpenRouter,
  },
].sort((a, b) => a.name.localeCompare(b.name));

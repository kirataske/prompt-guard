import { GoogleGenAI } from "@google/genai";

import { appConfig } from "./config.ts";

export async function generateContent(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: appConfig.geminiApiKey });

  return await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
}

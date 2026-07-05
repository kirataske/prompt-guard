import { GoogleGenAI } from "@google/genai";

import { appConfig } from "../config/config.ts";

export async function generateContent(prompt: string) {
  const ai: GoogleGenAI = new GoogleGenAI({ apiKey: appConfig.geminiApiKey });

  return await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
}

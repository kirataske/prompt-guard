import { GoogleGenAI } from "@google/genai";

import { appConfig } from "../config/config.ts";

/**
 * another one with descriptive name.
 *
 * sends prompt to Gemini and receives generated text.
 *
 * @param prompt what user wants.
 * @returns what gemini generated.
 */
export async function generateContent(prompt: string) {
  const ai: GoogleGenAI = new GoogleGenAI({ apiKey: appConfig.geminiApiKey });

  return await ai.models.generateContent({
    model: appConfig.geminiModel,
    contents: prompt,
    config: {
      systemInstruction:
        "відповідай корокто, по суті та мовою, якою користувач надав команди.",
    },
  });
}

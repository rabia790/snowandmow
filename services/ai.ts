import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
// Note: In a real production app, this key should be proxy-ed through a backend.
// For this frontend-only demo, we expect the user to provide it or it will fail gracefully.
const API_KEY = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateSupportResponse = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "I am a simulated AI assistant. To enable real intelligence, please configure the API_KEY in the environment.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: "You are a helpful customer support agent for 'Snow & Mow', an on-demand landscaping app. Keep answers short, friendly, and professional.",
      },
    });
    
    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I am currently offline. Please try again later.";
  }
};
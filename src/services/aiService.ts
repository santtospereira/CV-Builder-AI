// src/services/aiService.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // só para protótipo, o ideal é back-end!
});

export async function enhanceText(prompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente que melhora textos de currículos." },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Erro ao chamar API:", error);
    return "Não foi possível melhorar o texto no momento.";
  }
}
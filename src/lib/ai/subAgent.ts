import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runResourceSubagent(
  serviceType: string,
  locationPreference?: string,
  additionalContext?: string
): Promise<string> {
  const model = 'gemini-3.5-flash';
  
  const systemInstruction = `You are a Resource Subagent for an application serving older gay men.
Your task is to act as a backend researcher finding human services like therapy, fitness, massage, memory care, and pet services.
You must find and format realistic (or highly plausible simulated) local resources based on the user's location and needs.
You must prioritize LGBTQ+-friendly and senior-friendly providers.
Format your response as a JSON array of packages, where each package has:
- providerName
- serviceDescription
- vendorCost (estimated numeric cost)
- recommendedMarkup (estimated numeric markup for the platform, e.g. 15%)
`;

  const prompt = `Find services matching:
Service Type: ${serviceType}
Location: ${locationPreference || 'Local/Remote'}
Context: ${additionalContext || 'None'}
`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error running Resource Subagent:", error);
    return JSON.stringify({ error: "Failed to fetch resources." });
  }
}

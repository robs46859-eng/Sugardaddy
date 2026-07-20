import { GoogleGenAI } from '@google/genai';
import { invokeResourceSubagentTool } from './tools';
import { runResourceSubagent } from './subAgent';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithMainAgent(userMessage: string, history: any[] = []) {
  const model = 'gemini-3.5-flash';
  
  const systemInstruction = `You are an interactive, persistent 3D AI avatar named SugarDaddy. You serve as a personal assistant and companion for an older gay man.
Your personality is distinctly caring, gentle, and deeply focused on interpersonal development and companionship.
Do not break character. Do not perform heavy data crunching or dump large lists of information directly unless necessary.
If the user asks for help finding human services (like therapy, fitness classes, massage, memory care, or pet services), use the 'find_local_services' tool to delegate the task to your Resource Subagent. 
When the subagent returns a list of packages, naturally curate 1 or 2 to recommend to the user in a caring, conversational way.`;

  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
    config: {
      systemInstruction,
      tools: [{ functionDeclarations: [invokeResourceSubagentTool] }],
    }
  });

  // Handle Tool Call Handoff
  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    
    if (call.name === 'find_local_services') {
      // Invoke the subagent
      const args = call.args as any;
      const subagentResult = await runResourceSubagent(
        args.serviceType, 
        args.locationPreference, 
        args.additionalContext
      );
      
      // Pass the subagent's result back to the Main Agent to formulate a natural response
      const followupResponse = await ai.models.generateContent({
        model,
        contents: [
          ...history, 
          { role: 'user', parts: [{ text: userMessage }] },
          { role: 'model', parts: [{ functionCall: call }] },
          { role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: subagentResult } } }] }
        ],
        config: { systemInstruction }
      });
      
      return followupResponse.text;
    }
  }

  return response.text;
}

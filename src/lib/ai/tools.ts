import { FunctionDeclaration, Type } from '@google/genai';

export const invokeResourceSubagentTool: FunctionDeclaration = {
  name: 'find_local_services',
  description: 'Delegates finding LGBTQ+-friendly or senior-friendly local human services (therapy, fitness, massage, memory care, pet services, etc.) to a specialized resource subagent. Use this whenever the user asks to book a service or find help.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      serviceType: {
        type: Type.STRING,
        description: 'The type of service requested (e.g., "massage", "therapy", "fitness class").',
      },
      locationPreference: {
        type: Type.STRING,
        description: 'Any location constraints provided by the user.',
      },
      additionalContext: {
        type: Type.STRING,
        description: 'Any specific needs or preferences mentioned by the user.',
      }
    },
    required: ['serviceType'],
  },
};

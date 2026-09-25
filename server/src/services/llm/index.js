import { config } from '../../config/index.js';
import { MockLLMProvider } from './MockLLMProvider.js';
import { GroqProvider } from './GroqProvider.js';
import { LLMResponseSchema } from '../../schemas/api.js';

/**
 * LLM Service Factory
 * 
 * Returns the appropriate LLM provider based on configuration.
 * Supports multiple providers without changing application logic.
 */

let providerInstance = null;

export function getLLMProvider() {
  if (providerInstance) {
    return providerInstance;
  }

  const providerName = config.llm.provider.toLowerCase();

  switch (providerName) {
    case 'groq':
      if (!config.llm.apiKey) {
        throw new Error('GROQ_API_KEY is required when using groq provider. Please set it in your .env file.');
      }
      providerInstance = new GroqProvider(
        config.llm.apiKey,
        config.llm.model || 'openai/gpt-oss-120b'
      );
      break;

    case 'mock':
      providerInstance = new MockLLMProvider();
      break;
    
    // Future providers can be added here:
    // case 'openai':
    //   providerInstance = new OpenAIProvider(config.llm.apiKey, config.llm.model);
    //   break;
    // case 'anthropic':
    //   providerInstance = new AnthropicProvider(config.llm.apiKey, config.llm.model);
    //   break;
    
    default:
      throw new Error(`Unknown LLM provider: ${providerName}. Supported providers: groq, mock`);
  }

  console.log(`LLM Provider initialized: ${providerInstance.getName()}`);
  return providerInstance;
}

/**
 * Process a message through the LLM
 * Validates input and output
 */
export async function processLLMMessage(request) {
  const provider = getLLMProvider();
  
  try {
    const response = await provider.processMessage(request);
    
    // Validate response matches expected schema
    const validated = LLMResponseSchema.parse(response);
    
    return validated;
  } catch (error) {
    console.error('LLM processing error:', error);
    
    // Return safe fallback response
    return {
      assistantMessage: 'I apologize, but I encountered an error processing your message. Could you please try rephrasing that?',
      stateUpdates: {},
      clarificationRequired: false,
      clarificationReason: 'LLM processing error',
      fieldsNeedingClarification: [],
      confidence: 'low'
    };
  }
}

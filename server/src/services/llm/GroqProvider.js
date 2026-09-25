import Groq from 'groq-sdk';
import { LLMProvider } from './LLMProvider.js';

/**
 * Groq LLM Provider
 * 
 * Integrates with Groq's hosted API for fast inference.
 * Requires GROQ_API_KEY environment variable.
 * 
 * Uses structured output with JSON schema validation for reliable extraction.
 */
export class GroqProvider extends LLMProvider {
  constructor(apiKey, model = 'openai/gpt-oss-120b') {
    super();
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is required for GroqProvider');
    }

    this.client = new Groq({ apiKey });
    this.model = model;
  }

  getName() {
    return `GroqProvider (${this.model})`;
  }

  /**
   * Process a user message through Groq with structured output
   */
  async processMessage(request) {
    const { currentState, conversation, latestUserMessage } = request;

    try {
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(currentState);

      // Build conversation context
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      ];

      // Call Groq API with structured output
      const response = await this.callGroq(messages);

      // Parse and validate response
      return this.parseResponse(response);
    } catch (error) {
      console.error('Groq processing error:', error);

      // Check for specific error types
      if (error.status === 401) {
        throw new Error('Invalid Groq API key');
      } else if (error.status === 429) {
        console.error('Groq rate limit exceeded');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error('Groq API connection failed');
      }

      // Graceful fallback
      return {
        assistantMessage: "I'm having trouble processing that right now. Could you please try again in a moment?",
        stateUpdates: {},
        clarificationRequired: false,
        clarificationReason: 'LLM processing error',
        fieldsNeedingClarification: [],
        confidence: 'low'
      };
    }
  }

  /**
   * Build system prompt with current state context
   */
  buildSystemPrompt(currentState) {
    return `You are an assistant helping collect information for a personal wishes document.

**Current Information:**
${JSON.stringify(currentState, null, 2)}

**Your Task:**
1. Extract structured information from the user's message
2. Identify what information is still needed
3. Detect contradictions with existing information
4. Never invent or assume information

**Response Format:**
You must respond with valid JSON in this exact format:
{
  "assistantMessage": "Your conversational response to the user",
  "stateUpdates": {
    "field_name": "value"
  },
  "clarificationRequired": false,
  "clarificationReason": null,
  "fieldsNeedingClarification": [],
  "confidence": "high"
}

**Available Fields:**
- full_name: string
- home_address: string
- covers_worldwide_assets: boolean
- has_children: boolean
- children: array of {name: string}
- executor: {name: string, relationship: string}
- has_specific_gifts: boolean (true if user has gifts, false if user has NO specific gifts or says "no gifts" / "none")
- specific_gifts: array of {item: string, recipient: string}
- additional_wishes: string (user wish text, or "None" if user states "no wishes" / "none" / "no additional wishes")

**Rules:**
1. Only update fields that the user explicitly mentions
2. If information contradicts existing state, set clarificationRequired: true
3. Never invent names, addresses, or relationships
4. If ambiguous (e.g., "he should be executor"), ask for clarification
5. Acknowledge what was provided, then ask for next missing field
6. Keep responses conversational and friendly
7. Extract multiple pieces of information from a single message when possible
8. Handle "no gifts" explicitly: If user states "no gifts", "no specific gifts", "don't have any gifts", or "none" for gifts, set "has_specific_gifts": false and "specific_gifts": []
9. Handle "no additional wishes" explicitly: If user states "no wishes", "no additional wishes", or "none" for wishes, set "additional_wishes": "None"
10. Handle combined negative declaration: If user states "no gifts and wishes" or "no gifts or wishes", set BOTH "has_specific_gifts": false, "specific_gifts": [] AND "additional_wishes": "None"

**Examples:**

User: "My name is John Smith"
Response:
{
  "assistantMessage": "Thank you, John Smith. What is your home address?",
  "stateUpdates": {"full_name": "John Smith"},
  "clarificationRequired": false,
  "clarificationReason": null,
  "fieldsNeedingClarification": [],
  "confidence": "high"
}

User: "I live in London, I have two children Emma and Oliver"
Response:
{
  "assistantMessage": "I've noted your address in London and your children Emma and Oliver. Should this document cover your worldwide assets?",
  "stateUpdates": {
    "home_address": "London",
    "has_children": true,
    "children": [{"name": "Emma"}, {"name": "Oliver"}]
  },
  "clarificationRequired": false,
  "clarificationReason": null,
  "fieldsNeedingClarification": [],
  "confidence": "high"
}

User: "no gifts and wishes"
Response:
{
  "assistantMessage": "Got it—no specific gifts and no additional wishes recorded. All details for your personal wishes document are now complete.",
  "stateUpdates": {
    "has_specific_gifts": false,
    "specific_gifts": [],
    "additional_wishes": "None"
  },
  "clarificationRequired": false,
  "clarificationReason": null,
  "fieldsNeedingClarification": [],
  "confidence": "high"
}

User: "My daughter should get my house" (when has_children is false)
Response:
{
  "assistantMessage": "Earlier you mentioned you don't have children, but now you've mentioned your daughter. Could you clarify which information is correct?",
  "stateUpdates": {},
  "clarificationRequired": true,
  "clarificationReason": "Contradiction about having children",
  "fieldsNeedingClarification": ["has_children"],
  "confidence": "low"
}

Remember: Respond ONLY with valid JSON. Do not add any text before or after the JSON.`;
  }

  /**
   * Call Groq API with JSON mode for structured output
   */
  async callGroq(messages) {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: 0.3, // Lower temperature for more consistent extraction
      max_tokens: 2000,
      top_p: 0.9,
      response_format: { type: 'json_object' } // Enforce JSON response
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    return content;
  }

  /**
   * Parse LLM response and validate structure
   */
  parseResponse(content) {
    try {
      const parsed = JSON.parse(content);

      // Validate required fields
      if (!parsed.assistantMessage || typeof parsed.assistantMessage !== 'string') {
        throw new Error('Missing or invalid assistantMessage');
      }

      // Return with defaults for optional fields
      return {
        assistantMessage: parsed.assistantMessage,
        stateUpdates: parsed.stateUpdates || {},
        clarificationRequired: parsed.clarificationRequired || false,
        clarificationReason: parsed.clarificationReason || null,
        fieldsNeedingClarification: parsed.fieldsNeedingClarification || [],
        confidence: parsed.confidence || 'medium'
      };
    } catch (error) {
      console.error('Failed to parse Groq response:', error);
      console.error('Raw content:', content);

      // Return fallback response
      return {
        assistantMessage: "I understood your message. Could you provide more details?",
        stateUpdates: {},
        clarificationRequired: false,
        clarificationReason: 'Parse error',
        fieldsNeedingClarification: [],
        confidence: 'low'
      };
    }
  }
}

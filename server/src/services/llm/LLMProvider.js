/**
 * Abstract LLM Provider Interface
 * 
 * All LLM providers must implement this interface.
 * This ensures the application remains provider-independent.
 * 
 * Future providers (OpenAI, Anthropic, etc.) will extend this class.
 */
export class LLMProvider {
  /**
   * Process a user message and return structured response
   * 
   * @param {object} request - The LLM request
   * @param {object} request.currentState - Current structured state
   * @param {Array} request.conversation - Conversation history
   * @param {string} request.latestUserMessage - Latest user message
   * 
   * @returns {Promise<object>} LLM response
   * @returns {string} response.assistantMessage - Message to show user
   * @returns {object} response.stateUpdates - Updates to apply to state
   * @returns {boolean} response.clarificationRequired - Whether clarification needed
   * @returns {string|null} response.clarificationReason - Why clarification needed
   * @returns {string[]} response.fieldsNeedingClarification - Fields needing clarification
   * @returns {string} response.confidence - Confidence level (high/medium/low)
   */
  async processMessage(request) {
    throw new Error('processMessage() must be implemented by provider');
  }

  /**
   * Provider name for logging and debugging
   */
  getName() {
    return 'BaseProvider';
  }
}

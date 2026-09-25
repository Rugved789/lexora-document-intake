import { LLMProvider } from './LLMProvider.js';

/**
 * Mock LLM Provider for testing and development
 * 
 * This provider implements deterministic conversation logic without requiring
 * an external LLM API. It follows the exact same contract as real providers.
 * 
 * Supports:
 * - Multi-field extraction
 * - Missing field detection
 * - Ambiguity handling
 * - Contradiction detection
 * - Corrections
 * - Natural conversation flow
 */
export class MockLLMProvider extends LLMProvider {
  constructor() {
    super();
  }

  getName() {
    return 'MockLLMProvider';
  }

  async processMessage(request) {
    const { currentState, conversation, latestUserMessage } = request;
    const message = latestUserMessage.toLowerCase();

    // Extract information from the user message
    const extracted = this.extractInformation(message, currentState, latestUserMessage);

    // Check for contradictions
    const contradiction = this.detectContradiction(extracted, currentState);
    if (contradiction) {
      return contradiction;
    }

    // Apply state updates
    const stateUpdates = extracted.updates;

    // Determine what's missing
    const missingFields = this.getMissingFields({ ...currentState, ...stateUpdates });

    // Generate appropriate response
    const assistantMessage = this.generateResponse(stateUpdates, missingFields, currentState);

    return {
      assistantMessage,
      stateUpdates,
      clarificationRequired: false,
      clarificationReason: null,
      fieldsNeedingClarification: [],
      confidence: 'high'
    };
  }

  /**
   * Extract structured information from user message
   */
  extractInformation(message, currentState, originalMessage = '') {
    const updates = {};

    // Extract full name
    const namePatterns = [
      /my name is ([a-z\s]+?)(?:\.|,|$| and | i | my )/i,
      /i'?m ([a-z\s]+?)(?:\.|,|$| and | i | my )/i,
      /this is ([a-z\s]+?)(?:\.|,|$| and | i | my )/i,
      /call me ([a-z\s]+?)(?:\.|,|$| and | i | my )/i
    ];

    for (const pattern of namePatterns) {
      const match = message.match(pattern);
      if (match) {
        updates.full_name = this.capitalize(match[1].trim());
        break;
      }
    }

    // Extract home address
    const addrPrefix = /(?:live in|from|address is|residing in|located in|home is|home at)\s+/i;
    const matchIdx = message.search(addrPrefix);
    if (matchIdx !== -1) {
      const matchText = message.slice(matchIdx).replace(addrPrefix, '');
      const cutMatch = matchText.split(/(?:\.|$|,\s*i\b|\s+i\s+have\b|\s+and\s+my\b|\s+and\b)/i)[0].trim();
      if (cutMatch) {
        updates.home_address = this.capitalize(cutMatch);
      }
    }

    // Extract worldwide assets
    if (message.includes('worldwide') || message.includes('world wide')) {
      if (message.includes('yes') || message.includes('cover')) {
        updates.covers_worldwide_assets = true;
      } else if (message.includes('no') || message.includes('don\'t') || message.includes('not')) {
        updates.covers_worldwide_assets = false;
      }
    } else if (currentState.covers_worldwide_assets === null &&
      (message.includes('yes') || message.includes('no'))) {
      // Contextual yes/no if we just asked about worldwide assets
      const lastQuestion = this.getLastQuestion(message);
      if (lastQuestion && lastQuestion.includes('worldwide')) {
        updates.covers_worldwide_assets = message.includes('yes');
      }
    }

    // Extract children information
    if (message.includes('children') || message.includes('child') ||
      message.includes('son') || message.includes('daughter') ||
      message.includes('kids')) {

      if (message.includes('no children') || message.includes('don\'t have') ||
        message.includes('do not have') || message.includes('don\'t have any')) {
        updates.has_children = false;
        updates.children = [];
      } else if (message.includes('have children') || message.includes('have a') ||
        message.includes('my children') || message.includes('my son') ||
        message.includes('my daughter') || message.includes('two children') ||
        message.includes('have two') || /children are/i.test(message)) {
        updates.has_children = true;

        // Extract children names from children clause in originalMessage
        const orig = originalMessage || message;
        const childrenIdx = orig.toLowerCase().indexOf('children');
        const searchScope = childrenIdx !== -1 ? orig.slice(childrenIdx) : orig;
        const cleanScope = searchScope.split(/(?:,?\s+and\s+my|,?\s+my\s+brother|,?\s+my\s+sister|,?\s+executor)/i)[0];

        const names = this.extractNames(cleanScope, ['son', 'daughter', 'child', 'children', 'kids', 'have', 'two', 'are', 'my', 'and']);
        if (names.length > 0) {
          updates.children = names.map(name => ({ name }));
        }
      }
    }

    // Handle yes/no for has_children question
    if (currentState.has_children === null && !updates.has_children) {
      if (message.trim() === 'yes' || message.includes('yes i do') ||
        message.includes('yes,') || message.startsWith('yes ')) {
        updates.has_children = true;
      } else if (message.trim() === 'no' || message.includes('no i don') ||
        message.includes('no,') || message.startsWith('no ')) {
        updates.has_children = false;
        updates.children = [];
      }
    }

    // Extract executor information
    const executorPatterns = [
      /(?:my )?(brother|sister|son|daughter|friend|partner|spouse) ([a-z\s]+?) (?:should|will|can) (?:be|act as|serve as)? ?(?:my )?executor/i,
      /(?:executor|handle everything|manage|oversee).+?(?:is|should be|will be) (?:my )?(brother|sister|son|daughter|friend|partner|spouse) ([a-z\s]+)/i,
      /(?:my|the) (brother|sister|son|daughter|friend|partner|spouse) ([a-z\s]+?) as (?:my )?executor/i
    ];

    for (const pattern of executorPatterns) {
      const match = message.match(pattern);
      if (match) {
        const relationship = match[1];
        const executorName = this.capitalize(match[2].trim());
        updates.executor = {
          name: executorName,
          relationship: relationship.toLowerCase()
        };
        break;
      }
    }

    // Handle negative declarations for gifts & wishes
    const lowerMsg = message.toLowerCase();
    const isNoGiftsAndWishes = lowerMsg.includes('no gifts and wishes') ||
      lowerMsg.includes('no gifts or wishes') ||
      lowerMsg.includes('no gift and no wish') ||
      lowerMsg.includes('no gifts, no wishes');

    if (isNoGiftsAndWishes) {
      updates.has_specific_gifts = false;
      updates.specific_gifts = [];
      updates.additional_wishes = "None";
    } else {
      if (
        lowerMsg.includes('no gifts') ||
        lowerMsg.includes('no specific gifts') ||
        lowerMsg.includes('no gift') ||
        lowerMsg.includes('don\'t have any gifts') ||
        lowerMsg.includes('do not have any gifts') ||
        (lowerMsg === 'none' && !currentState.specific_gifts?.length)
      ) {
        updates.has_specific_gifts = false;
        updates.specific_gifts = [];
      }

      if (
        lowerMsg.includes('no wishes') ||
        lowerMsg.includes('no additional wishes') ||
        lowerMsg.includes('no wish') ||
        (lowerMsg === 'none' && currentState.additional_wishes === null)
      ) {
        updates.additional_wishes = "None";
      }
    }

    // Extract specific gifts
    const giftPatterns = [
      /(?:my |the )?([a-z0-9\s]+?)\s+(?:should go to|goes to|given to|leave to)\s+([a-z\s]+)/i,
      /(?:give|leave)\s+(?:my\s+)?([a-z0-9\s]+?)\s+to\s+([a-z\s]+)/i,
      /([a-z\s]+?)\s+(?:receives?|gets?|inherits?)\s+(?:my\s+)?([a-z0-9\s]+)/i,
      /(?:my |the )?([a-z0-9\s]+?)\s+(?:for|to)\s+([a-z\s]+)/i
    ];

    for (const pattern of giftPatterns) {
      // Don't match "no gifts and wishes"
      if (isNoGiftsAndWishes || lowerMsg.includes('no gifts')) break;
      const match = message.match(pattern);
      if (match) {
        const gift = {
          item: match[1].trim(),
          recipient: this.capitalize(match[2].trim())
        };

        if (!updates.specific_gifts) {
          updates.specific_gifts = currentState.specific_gifts || [];
        }
        updates.specific_gifts = [...updates.specific_gifts, gift];
        updates.has_specific_gifts = true;
        break;
      }
    }

    // Extract additional wishes
    if (!isNoGiftsAndWishes && !lowerMsg.includes('no wishes') && !lowerMsg.includes('no additional wishes')) {
      if (message.includes('wish') || message.includes('want') || message.includes('prefer')) {
        if (message.length > 20) {
          updates.additional_wishes = latestUserMessage.trim();
        }
      }
    }

    return { updates };
  }

  /**
   * Detect contradictions in new information
   */
  detectContradiction(extracted, currentState) {
    const updates = extracted.updates;

    // Check for has_children contradiction
    if (currentState.has_children === false && updates.has_children === true) {
      return {
        assistantMessage: "Earlier you mentioned that you don't have children, but now you've indicated that you do. Could you clarify which information is correct?",
        stateUpdates: {},
        clarificationRequired: true,
        clarificationReason: 'Contradiction about having children',
        fieldsNeedingClarification: ['has_children'],
        confidence: 'low'
      };
    }

    // Check if mentioning children when previously said no children
    if (currentState.has_children === false &&
      (updates.children?.length > 0 || updates.specific_gifts?.some(g =>
        g.recipient.toLowerCase().includes('son') ||
        g.recipient.toLowerCase().includes('daughter')
      ))) {
      return {
        assistantMessage: "Earlier you mentioned that you don't have children, but you've now mentioned a child. Could you clarify which information is correct?",
        stateUpdates: {},
        clarificationRequired: true,
        clarificationReason: 'Contradiction about having children',
        fieldsNeedingClarification: ['has_children', 'children'],
        confidence: 'low'
      };
    }

    return null;
  }

  /**
   * Determine which required fields are still missing
   */
  getMissingFields(state) {
    const missing = [];

    if (!state.full_name) missing.push('full_name');
    if (!state.home_address) missing.push('home_address');
    if (state.covers_worldwide_assets === null) missing.push('covers_worldwide_assets');
    if (state.has_children === null) missing.push('has_children');
    if (state.has_children === true && state.children.length === 0) missing.push('children');
    if (!state.executor?.name) missing.push('executor');
    if (!state.executor?.relationship) missing.push('executor_relationship');

    return missing;
  }

  /**
   * Generate appropriate assistant response
   */
  generateResponse(stateUpdates, missingFields, currentState) {
    const updatedFields = Object.keys(stateUpdates);

    // Acknowledge what was provided
    let response = '';

    if (updatedFields.length > 0) {
      const acknowledgments = [];

      if (stateUpdates.full_name) {
        acknowledgments.push(`Thank you, ${stateUpdates.full_name}`);
      }
      if (stateUpdates.home_address) {
        acknowledgments.push(`I've noted your address in ${stateUpdates.home_address}`);
      }
      if (stateUpdates.has_children !== undefined) {
        acknowledgments.push(stateUpdates.has_children ?
          "I've noted that you have children" :
          "I've noted that you don't have children");
      }
      if (stateUpdates.children?.length > 0) {
        const names = stateUpdates.children.map(c => c.name).join(' and ');
        acknowledgments.push(`I've recorded your children: ${names}`);
      }
      if (stateUpdates.executor?.name) {
        acknowledgments.push(`I've noted ${stateUpdates.executor.name} as your executor`);
      }
      if (stateUpdates.specific_gifts?.length > 0) {
        acknowledgments.push("I've recorded your specific gift");
      }

      if (acknowledgments.length > 0) {
        response = acknowledgments[0] + '. ';
      }
    }

    // Ask for next missing field
    if (missingFields.length > 0) {
      const nextField = missingFields[0];

      switch (nextField) {
        case 'full_name':
          response += 'What is your full name?';
          break;
        case 'home_address':
          response += 'What is your home address?';
          break;
        case 'covers_worldwide_assets':
          response += 'Should this document cover your worldwide assets?';
          break;
        case 'has_children':
          response += 'Do you have any children?';
          break;
        case 'children':
          response += 'What are the names of your children?';
          break;
        case 'executor':
          response += 'Who would you like to appoint as your executor?';
          break;
        case 'executor_relationship':
          response += `What is ${currentState.executor.name}'s relationship to you?`;
          break;
        default:
          response += 'Is there anything else you would like to add?';
      }
    } else {
      response += 'Thank you. I have all the information I need. You can review the document preview or add any additional wishes.';
    }

    return response.trim();
  }

  /**
   * Extract names from text, excluding certain keywords
   */
  extractNames(text, excludeWords = []) {
    const words = text.split(/\s+/);
    const names = [];
    const exclude = excludeWords.map(w => w.toLowerCase());

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[,\.!?]/g, '');

      // Check if it's a capitalized word and not in exclude list
      if (word.length > 0 &&
        word[0] === word[0].toUpperCase() &&
        !exclude.includes(word.toLowerCase()) &&
        !['I', 'My', 'The', 'And', 'Or', 'A', 'An'].includes(word)) {
        names.push(word);
      }
    }

    return names;
  }

  /**
   * Extract relationship from text
   */
  extractRelationship(text, name) {
    const relationships = ['brother', 'sister', 'son', 'daughter', 'mother', 'father',
      'friend', 'partner', 'spouse', 'wife', 'husband', 'cousin',
      'uncle', 'aunt', 'nephew', 'niece'];

    const lowerText = text.toLowerCase();

    for (const rel of relationships) {
      if (lowerText.includes(`my ${rel}`) || lowerText.includes(`${rel} ${name.toLowerCase()}`)) {
        return rel;
      }
    }

    return null;
  }

  /**
   * Capitalize first letter of each word
   */
  capitalize(str) {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Get the last question asked (stub for contextual responses)
   */
  getLastQuestion(message) {
    // In a real implementation, this would look at conversation history
    return null;
  }
}

import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { MockLLMProvider } from '../src/services/llm/MockLLMProvider.js';
import { initialStructuredState } from '../src/schemas/structuredState.js';

describe('MockLLMProvider', () => {
  let provider;

  before(() => {
    provider = new MockLLMProvider();
  });

  describe('Basic Information Extraction', () => {
    it('should extract full name', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'My name is Rahul Sharma'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.full_name, 'Rahul Sharma');
      assert.ok(response.assistantMessage.length > 0);
      assert.strictEqual(response.confidence, 'high');
    });

    it('should extract home address', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'I live in Nagpur, Maharashtra'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.home_address, 'Nagpur, Maharashtra');
    });
  });

  describe('Multiple Field Extraction', () => {
    it('should extract multiple fields from one message', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'My name is Rahul Sharma, I live in Nagpur, I have two children Priya and Arjun, and my brother Amit should be my executor'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.full_name, 'Rahul Sharma');
      assert.strictEqual(response.stateUpdates.home_address, 'Nagpur');
      assert.strictEqual(response.stateUpdates.has_children, true);
      assert.strictEqual(response.stateUpdates.children.length, 2);
      assert.strictEqual(response.stateUpdates.children[0].name, 'Priya');
      assert.strictEqual(response.stateUpdates.children[1].name, 'Arjun');
      assert.strictEqual(response.stateUpdates.executor.name, 'Amit');
      assert.strictEqual(response.stateUpdates.executor.relationship, 'brother');
    });
  });

  describe('Children Information', () => {
    it('should handle "no children" response', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'I don\'t have any children'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.has_children, false);
      assert.deepStrictEqual(response.stateUpdates.children, []);
    });

    it('should extract children names', async () => {
      const request = {
        currentState: { ...initialStructuredState, has_children: true },
        conversation: [],
        latestUserMessage: 'My children are Priya and Arjun'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.children.length, 2);
      assert.strictEqual(response.stateUpdates.children[0].name, 'Priya');
      assert.strictEqual(response.stateUpdates.children[1].name, 'Arjun');
    });
  });

  describe('Contradiction Detection', () => {
    it('should detect contradiction when user changes has_children', async () => {
      const currentState = {
        ...initialStructuredState,
        has_children: false
      };

      const request = {
        currentState,
        conversation: [],
        latestUserMessage: 'My daughter Priya should receive my car'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.clarificationRequired, true);
      assert.ok(response.clarificationReason.includes('contradiction') ||
        response.assistantMessage.toLowerCase().includes('clarify'));
      assert.strictEqual(response.confidence, 'low');
    });
  });

  describe('Executor Information', () => {
    it('should extract executor name and relationship', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'My brother Amit should be my executor'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.executor.name, 'Amit');
      assert.strictEqual(response.stateUpdates.executor.relationship, 'brother');
    });
  });

  describe('Gifts and Wishes Information', () => {
    it('should handle "no gifts and wishes" command', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'no gifts and wishes'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.has_specific_gifts, false);
      assert.deepStrictEqual(response.stateUpdates.specific_gifts, []);
      assert.strictEqual(response.stateUpdates.additional_wishes, 'None');
    });

    it('should extract specific gift correctly', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'my car goes to Priya'
      };

      const response = await provider.processMessage(request);

      assert.strictEqual(response.stateUpdates.has_specific_gifts, true);
      assert.strictEqual(response.stateUpdates.specific_gifts.length, 1);
      assert.strictEqual(response.stateUpdates.specific_gifts[0].recipient, 'Priya');
      assert.strictEqual(response.stateUpdates.specific_gifts[0].item, 'car');
    });
  });

  describe('Response Structure', () => {
    it('should return valid response structure', async () => {
      const request = {
        currentState: initialStructuredState,
        conversation: [],
        latestUserMessage: 'Hello'
      };

      const response = await provider.processMessage(request);

      assert.ok(typeof response.assistantMessage === 'string');
      assert.ok(typeof response.stateUpdates === 'object');
      assert.ok(typeof response.clarificationRequired === 'boolean');
      assert.ok(['high', 'medium', 'low'].includes(response.confidence));
      assert.ok(Array.isArray(response.fieldsNeedingClarification));
    });
  });
});

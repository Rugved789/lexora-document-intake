import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  validateStructuredState, 
  mergeStateUpdates,
  initialStructuredState 
} from '../src/schemas/structuredState.js';

describe('Structured State', () => {
  describe('Validation', () => {
    it('should validate initial state', () => {
      const result = validateStructuredState(initialStructuredState);
      assert.ok(result);
      assert.strictEqual(result.full_name, null);
      assert.strictEqual(result.has_children, null);
    });

    it('should validate state with all fields populated', () => {
      const state = {
        full_name: 'Rahul Sharma',
        home_address: 'Nagpur',
        covers_worldwide_assets: true,
        has_children: true,
        children: [{ name: 'Priya' }, { name: 'Arjun' }],
        executor: {
          name: 'Amit',
          relationship: 'brother'
        },
        specific_gifts: [
          { item: 'car', recipient: 'Priya' }
        ],
        additional_wishes: 'Please donate to charity'
      };

      const result = validateStructuredState(state);
      assert.ok(result);
      assert.strictEqual(result.full_name, 'Rahul Sharma');
      assert.strictEqual(result.children.length, 2);
    });

    it('should throw error for invalid state', () => {
      const invalidState = {
        ...initialStructuredState,
        full_name: 123 // Should be string or null
      };

      assert.throws(() => {
        validateStructuredState(invalidState);
      });
    });
  });

  describe('State Merging', () => {
    it('should merge simple updates', () => {
      const currentState = { ...initialStructuredState };
      const updates = {
        full_name: 'Rahul Sharma',
        home_address: 'Nagpur'
      };

      const result = mergeStateUpdates(currentState, updates);

      assert.strictEqual(result.full_name, 'Rahul Sharma');
      assert.strictEqual(result.home_address, 'Nagpur');
      assert.strictEqual(result.has_children, null); // Unchanged
    });

    it('should merge executor updates', () => {
      const currentState = {
        ...initialStructuredState,
        executor: { name: 'John', relationship: null }
      };
      const updates = {
        executor: { relationship: 'brother' }
      };

      const result = mergeStateUpdates(currentState, updates);

      assert.strictEqual(result.executor.name, 'John');
      assert.strictEqual(result.executor.relationship, 'brother');
    });

    it('should replace arrays completely', () => {
      const currentState = {
        ...initialStructuredState,
        children: [{ name: 'Old Name' }]
      };
      const updates = {
        children: [{ name: 'Priya' }, { name: 'Arjun' }]
      };

      const result = mergeStateUpdates(currentState, updates);

      assert.strictEqual(result.children.length, 2);
      assert.strictEqual(result.children[0].name, 'Priya');
    });

    it('should ignore undefined updates', () => {
      const currentState = {
        ...initialStructuredState,
        full_name: 'Rahul'
      };
      const updates = {
        full_name: undefined,
        home_address: 'Nagpur'
      };

      const result = mergeStateUpdates(currentState, updates);

      assert.strictEqual(result.full_name, 'Rahul'); // Unchanged
      assert.strictEqual(result.home_address, 'Nagpur');
    });
  });

  describe('Corrections', () => {
    it('should allow correcting previously set values', () => {
      const currentState = {
        ...initialStructuredState,
        executor: { name: 'James', relationship: 'friend' }
      };
      const updates = {
        executor: { name: 'Robert', relationship: 'brother' }
      };

      const result = mergeStateUpdates(currentState, updates);

      assert.strictEqual(result.executor.name, 'Robert');
      assert.strictEqual(result.executor.relationship, 'brother');
    });
  });
});

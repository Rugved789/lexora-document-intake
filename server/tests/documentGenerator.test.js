import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generatePersonalWishesDocument, getCompletionStatus } from '../src/services/document/documentGenerator.js';
import { initialStructuredState } from '../src/schemas/structuredState.js';

describe('Document Generator', () => {
  describe('Document Generation', () => {
    it('should generate document with empty state', () => {
      const document = generatePersonalWishesDocument(initialStructuredState);

      assert.ok(document.includes('PERSONAL WISHES DOCUMENT'));
      assert.ok(document.includes('FICTIONAL DOCUMENT — NOT LEGAL ADVICE'));
      assert.ok(document.includes('DISCLAIMER'));
      assert.ok(document.includes('[Not provided]'));
    });

    it('should generate document with complete state', () => {
      const state = {
        full_name: 'Rahul Sharma',
        home_address: 'Nagpur, Maharashtra',
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
        additional_wishes: 'Please donate remaining assets to charity'
      };

      const document = generatePersonalWishesDocument(state);

      assert.ok(document.includes('Rahul Sharma'));
      assert.ok(document.includes('Nagpur, Maharashtra'));
      assert.ok(document.includes('worldwide assets'));
      assert.ok(document.includes('Priya'));
      assert.ok(document.includes('Arjun'));
      assert.ok(document.includes('Amit'));
      assert.ok(document.includes('brother'));
      assert.ok(document.includes('car'));
      assert.ok(document.includes('donate remaining assets to charity'));
    });

    it('should include disclaimer', () => {
      const document = generatePersonalWishesDocument(initialStructuredState);

      assert.ok(document.includes('FICTIONAL DRAFT'));
      assert.ok(document.includes('NOT constitute legal advice'));
      assert.ok(document.includes('consult a qualified'));
    });

    it('should handle no children correctly', () => {
      const state = {
        ...initialStructuredState,
        has_children: false
      };

      const document = generatePersonalWishesDocument(state);

      assert.ok(document.includes('No children'));
    });

    it('should handle worldwide assets false', () => {
      const state = {
        ...initialStructuredState,
        covers_worldwide_assets: false
      };

      const document = generatePersonalWishesDocument(state);

      assert.ok(document.includes('NOT intended to cover worldwide assets'));
    });
  });

  describe('Completion Status', () => {
    it('should calculate completion for empty state', () => {
      const status = getCompletionStatus(initialStructuredState);

      assert.strictEqual(status.completed, 0);
      assert.ok(status.total > 0);
      assert.strictEqual(status.percentage, 0);
    });

    it('should calculate completion for partial state', () => {
      const state = {
        ...initialStructuredState,
        full_name: 'Rahul Sharma',
        home_address: 'Nagpur'
      };

      const status = getCompletionStatus(state);

      assert.ok(status.completed > 0);
      assert.ok(status.completed < status.total);
      assert.ok(status.percentage > 0 && status.percentage < 100);
    });

    it('should calculate completion for complete state', () => {
      const state = {
        full_name: 'Rahul Sharma',
        home_address: 'Nagpur',
        covers_worldwide_assets: true,
        has_children: true,
        children: [{ name: 'Priya' }],
        executor: {
          name: 'Amit',
          relationship: 'brother'
        },
        specific_gifts: [],
        additional_wishes: null
      };

      const status = getCompletionStatus(state);

      assert.strictEqual(status.completed, status.total);
      assert.strictEqual(status.percentage, 100);
    });

    it('should handle has_children false correctly', () => {
      const state = {
        ...initialStructuredState,
        has_children: false
      };

      const status = getCompletionStatus(state);

      // Should count has_children as complete even though children array is empty
      assert.ok(status.fields.has_children === true);
      assert.ok(status.fields.children === true); // True because not required when has_children is false
    });
  });
});

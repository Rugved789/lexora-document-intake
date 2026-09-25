import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generatePersonalWishesPDF } from '../src/services/document/pdfGenerator.js';
import { initialStructuredState } from '../src/schemas/structuredState.js';

describe('PDF Document Generator', () => {
  it('TEST 1: should generate valid PDF with minimal data (Full name only)', async () => {
    const state = {
      ...initialStructuredState,
      full_name: 'Eleanor Vance'
    };

    const pdfBuffer = await generatePersonalWishesPDF(state, {
      title: 'Eleanor_Vance_Directive'
    });

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 1000, 'PDF buffer must have reasonable size');
    // Verify PDF magic bytes '%PDF-'
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('TEST 2: should generate valid PDF with complete structured state', async () => {
    const state = {
      full_name: 'Rahul Sharma',
      home_address: '123 MG Road, Bengaluru, Karnataka, India',
      covers_worldwide_assets: true,
      has_children: true,
      children: [{ name: 'Priya Sharma' }, { name: 'Arjun Sharma' }],
      executor: {
        name: 'Amit Sharma',
        relationship: 'Brother'
      },
      specific_gifts: [
        { item: 'Vintage Watch & Gold Ring', recipient: 'Arjun Sharma' },
        { item: 'Family Library & Rare Books', recipient: 'Priya Sharma' }
      ],
      additional_wishes: 'Please archive all digital accounts and close subscription services respectfully.'
    };

    const pdfBuffer = await generatePersonalWishesPDF(state, {
      title: 'Rahul_Sharma_Personal_Wishes'
    });

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 2000);
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-');

    const pdfString = pdfBuffer.toString('binary');
    // Verify Lexora branding is present and old Wenup branding is completely absent
    assert.ok(pdfString.includes('Lexora'), 'PDF must include Lexora branding');
    assert.ok(!pdfString.includes('WENUP') && !pdfString.includes('Wenup'), 'PDF must not include Wenup branding');

    // Verify page count: Standard complete state must fit in exactly 1 page (no orphan pages)
    const pageMatches = pdfString.match(/\/Type\s*\/Page\b/g);
    assert.strictEqual(pageMatches ? pageMatches.length : 0, 1, 'Standard document must generate exactly 1 page');
  });

  it('TEST 3: should handle long Additional Wishes across multiple pages', async () => {
    const longWishes = Array.from({ length: 40 }, (_, i) => 
      `Directive paragraph ${i + 1}: I desire that my personal records, papers, letters, and digital journals be preserved or destroyed at the sole discretion of my executor, with due consideration to the privacy of my family.`
    ).join('\n\n');

    const state = {
      full_name: 'Eleanor Vance',
      home_address: 'Boston, Massachusetts',
      covers_worldwide_assets: true,
      has_children: false,
      executor: {
        name: 'Marcus Vance',
        relationship: 'Brother'
      },
      specific_gifts: [],
      additional_wishes: longWishes
    };

    const pdfBuffer = await generatePersonalWishesPDF(state, {
      title: 'Eleanor_Vance_Long_Directive'
    });

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 5000);
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('TEST 4: should handle empty structured state without errors', async () => {
    const pdfBuffer = await generatePersonalWishesPDF(initialStructuredState);

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.ok(pdfBuffer.length > 1000);
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });

  it('TEST 5: should handle multiple children and specific gifts cleanly', async () => {
    const state = {
      ...initialStructuredState,
      full_name: 'Marcus Aurelius',
      has_children: true,
      children: [
        { name: 'Commodus' },
        { name: 'Lucilla' },
        { name: 'Fadilla' },
        { name: 'Cornificia' }
      ],
      specific_gifts: [
        { item: 'Philosophical Journal', recipient: 'Lucilla' },
        { item: 'Equestrian Gear', recipient: 'Commodus' },
        { item: 'Villa in Campania', recipient: 'Fadilla' }
      ]
    };

    const pdfBuffer = await generatePersonalWishesPDF(state, {
      title: 'Marcus_Aurelius_Directives'
    });

    assert.ok(Buffer.isBuffer(pdfBuffer));
    assert.strictEqual(pdfBuffer.subarray(0, 5).toString('ascii'), '%PDF-');
  });
});

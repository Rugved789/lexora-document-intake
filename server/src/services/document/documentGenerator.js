/**
 * Document Generation Service
 * 
 * Generates a Personal Wishes Document from structured state.
 * IMPORTANT: This uses structured state as the source of truth, NOT conversation history.
 */

/**
 * Generate a Personal Wishes Document from structured state
 * @param {object} state - The validated structured state
 * @returns {string} The formatted document
 */
export function generatePersonalWishesDocument(state) {
  const sections = [];

  // Header
  sections.push('═══════════════════════════════════════════════════════════');
  sections.push('              PERSONAL WISHES DOCUMENT');
  sections.push('           FICTIONAL DOCUMENT — NOT LEGAL ADVICE');
  sections.push('═══════════════════════════════════════════════════════════');
  sections.push('');

  // Section 1: Personal Information
  sections.push('1. PERSONAL INFORMATION');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  sections.push(`Full Name: ${formatValue(state.full_name)}`);
  sections.push(`Home Address: ${formatValue(state.home_address)}`);
  sections.push('');

  // Section 2: Scope
  sections.push('2. SCOPE OF THIS DOCUMENT');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  
  if (state.covers_worldwide_assets === true) {
    sections.push('This document is intended to cover worldwide assets.');
  } else if (state.covers_worldwide_assets === false) {
    sections.push('This document is NOT intended to cover worldwide assets.');
  } else {
    sections.push('Scope: [Not specified]');
  }
  sections.push('');

  // Section 3: Children
  sections.push('3. CHILDREN');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  
  if (state.has_children === true) {
    if (state.children && state.children.length > 0) {
      sections.push('The following children are named:');
      state.children.forEach((child, index) => {
        sections.push(`  ${index + 1}. ${child.name}`);
      });
    } else {
      sections.push('Has children (names not yet provided)');
    }
  } else if (state.has_children === false) {
    sections.push('No children.');
  } else {
    sections.push('[Not specified]');
  }
  sections.push('');

  // Section 4: Executor
  sections.push('4. EXECUTOR');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  
  if (state.executor && state.executor.name) {
    sections.push(`Executor Name: ${state.executor.name}`);
    sections.push(`Relationship: ${formatValue(state.executor.relationship)}`);
  } else {
    sections.push('Executor: [Not specified]');
  }
  sections.push('');

  // Section 5: Specific Gifts
  sections.push('5. SPECIFIC GIFTS');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  
  if (state.specific_gifts && state.specific_gifts.length > 0) {
    state.specific_gifts.forEach((gift, index) => {
      sections.push(`  ${index + 1}. ${gift.item} → ${gift.recipient}`);
    });
  } else {
    sections.push('[No specific gifts specified]');
  }
  sections.push('');

  // Section 6: Additional Wishes
  sections.push('6. ADDITIONAL WISHES');
  sections.push('─────────────────────────────────────────────────────────');
  sections.push('');
  
  if (state.additional_wishes) {
    sections.push(state.additional_wishes);
  } else {
    sections.push('[No additional wishes specified]');
  }
  sections.push('');

  // Disclaimer
  sections.push('');
  sections.push('═══════════════════════════════════════════════════════════');
  sections.push('                        DISCLAIMER');
  sections.push('═══════════════════════════════════════════════════════════');
  sections.push('');
  sections.push('This is a FICTIONAL DRAFT generated for demonstration purposes.');
  sections.push('');
  sections.push('This document does NOT constitute legal advice and should NOT');
  sections.push('be relied upon as a legally binding document.');
  sections.push('');
  sections.push('For actual legal documents, please consult a qualified');
  sections.push('legal professional in your jurisdiction.');
  sections.push('');
  sections.push('═══════════════════════════════════════════════════════════');

  return sections.join('\n');
}

/**
 * Format a value for display, handling null/undefined
 */
function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '[Not provided]';
  }
  return value;
}

/**
 * Get a summary of completion status
 */
export function getCompletionStatus(state) {
  const fields = {
    full_name: !!state.full_name,
    home_address: !!state.home_address,
    covers_worldwide_assets: state.covers_worldwide_assets !== null,
    has_children: state.has_children !== null,
    children: state.has_children === true ? (state.children?.length > 0) : (state.has_children !== null),
    executor_name: !!state.executor?.name,
    executor_relationship: !!state.executor?.relationship
  };

  const completed = Object.values(fields).filter(Boolean).length;
  const total = Object.keys(fields).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
    fields
  };
}

import { z } from 'zod';

/**Zod schema for a single child**/
export const ChildSchema = z.object({
  name: z.string()
});

/**Zod schema for executor information*/
export const ExecutorSchema = z.object({
  name: z.string().nullable(),
  relationship: z.string().nullable()
});

/**Zod schema for a specific gift*/
export const SpecificGiftSchema = z.object({
  item: z.string(),
  recipient: z.string()
});

/**Main structured state schema
 * This is the source of truth for all collected information**/
export const StructuredStateSchema = z.object({
  full_name: z.string().nullable(),
  home_address: z.string().nullable(),
  covers_worldwide_assets: z.boolean().nullable(),
  has_children: z.boolean().nullable(),
  children: z.array(ChildSchema).default([]),
  executor: ExecutorSchema.default({ name: null, relationship: null }),
  has_specific_gifts: z.boolean().nullable().default(null).optional(),
  specific_gifts: z.array(SpecificGiftSchema).default([]),
  additional_wishes: z.string().nullable()
});


export const initialStructuredState = {
  full_name: null,
  home_address: null,
  covers_worldwide_assets: null,
  has_children: null,
  children: [],
  executor: {
    name: null,
    relationship: null
  },
  has_specific_gifts: null,
  specific_gifts: [],
  additional_wishes: null
};

/**
 * Helper to validate and parse state
 * @param {unknown} data 
 * @returns {object} Validated state
 */
export function validateStructuredState(data) {
  return StructuredStateSchema.parse(data);
}

/**
 * Helper to safely merge state updates
 * @param {object} currentState 
 * @param {object} updates 
 * @returns {object} Merged state
 */
export function mergeStateUpdates(currentState, updates) {
  const merged = { ...currentState };

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;

    if (key === 'executor' && typeof value === 'object' && value !== null) {
      merged.executor = {
        ...merged.executor,
        ...value
      };
    } else if (key === 'children' && Array.isArray(value)) {
      merged.children = value;
      if (value.length > 0) {
        merged.has_children = true;
      }
    } else if (key === 'specific_gifts' && Array.isArray(value)) {
      merged.specific_gifts = value;
      if (value.length > 0) {
        merged.has_specific_gifts = true;
      }
    } else if (key === 'has_specific_gifts') {
      merged.has_specific_gifts = value;
      if (value === false) {
        merged.specific_gifts = [];
      }
    } else {
      merged[key] = value;
    }
  }

  return validateStructuredState(merged);
}

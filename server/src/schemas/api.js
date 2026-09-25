import { z } from 'zod';

/**API request validation schemas**/

export const CreateIntakeSchema = z.object({
  title: z.string().optional()
});

export const SendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty')
});

export const UpdateStateSchema = z.object({
  updates: z.record(z.unknown())
});

/**LLM request schema**/
export const LLMRequestSchema = z.object({
  currentState: z.object({}).passthrough(),
  conversation: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })),
  latestUserMessage: z.string()
});

/**LLM response schema*/
export const LLMResponseSchema = z.object({
  assistantMessage: z.string(),
  stateUpdates: z.record(z.unknown()).optional(),
  clarificationRequired: z.boolean(),
  clarificationReason: z.string().nullable(),
  fieldsNeedingClarification: z.array(z.string()).default([]),
  confidence: z.enum(['high', 'medium', 'low'])
});

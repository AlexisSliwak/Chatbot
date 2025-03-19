import { z } from "zod";

// Part schemas
export const textPartSchema = z.object({
  type: z.literal('text'),
  text: z.string()
});

export const reasoningDetailsSchema = z.union([
  z.object({
    type: z.literal('text'),
    text: z.string(),
    signature: z.string().optional()
  }),
  z.object({
    type: z.literal('redacted'),
    data: z.string()
  })
]);

export const reasoningPartSchema = z.object({
  type: z.literal('reasoning'),
  reasoning: z.string(),
  details: z.array(reasoningDetailsSchema)
});

// Tool invocation is complex - creating a flexible schema
export const toolCallSchema = z.object({
  id: z.string(),
  type: z.string(),
  function: z.object({
    name: z.string(),
    arguments: z.string().or(z.record(z.unknown()))
  }).optional()
}).and(z.record(z.unknown())); // Allow additional properties

export const toolResultSchema = z.object({
  toolCallId: z.string(),
  content: z.string().or(z.record(z.unknown())),
  result: z.unknown().optional()
}).and(z.record(z.unknown())); // Allow additional properties

export const toolInvocationSchema = z.union([
  z.object({
    state: z.literal('partial-call'),
    step: z.number().optional()
  }).and(toolCallSchema),
  z.object({
    state: z.literal('call'),
    step: z.number().optional()
  }).and(toolCallSchema),
  z.object({
    state: z.literal('result'),
    step: z.number().optional()
  }).and(toolResultSchema)
]);

export const toolInvocationPartSchema = z.object({
  type: z.literal('tool-invocation'),
  toolInvocation: toolInvocationSchema
});

export const sourcePartSchema = z.object({
  type: z.literal('source'),
  source: z.record(z.unknown()) // LanguageModelV1Source
});

// Combined parts schema
export const messageParts = z.union([
  textPartSchema,
  reasoningPartSchema,
  toolInvocationPartSchema,
  sourcePartSchema
]);

// Attachment schema
export const attachmentSchema = z.object({
  name: z.string().optional(),
  contentType: z.string().optional(),
  url: z.string()
});
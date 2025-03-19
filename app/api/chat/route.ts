import { NextRequest, NextResponse } from "next/server";
import { generateContentStream } from "../../../src/lib/ai";
import models, { AIModelName } from "../../../src/lib/ai-models";
import { UIMessage } from "ai";
import { z } from "zod"

const uiMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "assistant", "system", "data"]),
  content: z.string(),
  name: z.string().optional(),
  
  // Required for UIMessage but optional in Message
  // parts: z.array(messageParts),
  
  // Optional properties from Message
  // createdAt: z.instanceof(Date).optional(),
  reasoning: z.string().optional(),
  // experimental_attachments: z.array(attachmentSchema).optional(),
  // data: z.any().optional(),
  // annotations: z.array(z.any()).optional(),
  // toolInvocations: z.array(toolInvocationSchema).optional(),
  
  // Additional properties
  // created_at: z.number().optional(),
  // updated_at: z.number().optional(),
  // incomplete: z.boolean().optional(),
  // streaming: z.boolean().optional(),
  // additional_kwargs: z.record(z.unknown()).optional(),
  // function_call: z.record(z.unknown()).optional(),
  // tool_calls: z.array(z.any()).optional(),
  // tool_call_id: z.string().optional()
});

const requestSchema = z.object({
  messages: z.array(uiMessageSchema).min(1),
  provider: z.enum(["google", "microsoft", "openai"]),
  model: z.string(),
  generationConfig: z.record(z.unknown()).optional()
}).refine((data) => {
  return Object.hasOwn(models, data.provider) && Object.hasOwn(models[data.provider], data.model);
}, {
  message: "Invalid model",
  path: ["model"]
});

const MAX_CONTENT_LENGTH = 1024 * 1024; // 1MB

export async function POST(req: NextRequest) {
  try {
    // Check content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { message: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // Check content length
    const contentLength = parseInt(req.headers.get("content-length") || "0");
    if (contentLength > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { message: "Request body too large" },
        { status: 413 }
      );
    }

    // Validate request body
    const body = await req.json();
    const dataResult = requestSchema.safeParse(body);
    
    if (!dataResult.success) {
      console.error("Validation error:", dataResult.error.format());
      return NextResponse.json(
        { message: "Improper content format" },
        { status: 400 }
      );
    }

    const { provider, model, generationConfig } = dataResult.data;
    const messages = dataResult.data.messages as UIMessage[];

    console.log(dataResult.data.messages);

    switch (provider) {
      case "google": return generateContentStream(messages, provider, model as AIModelName<"google">, generationConfig);
      case "microsoft": return generateContentStream(messages, provider, model as AIModelName<"microsoft">, generationConfig);
      case "openai": return generateContentStream(messages, provider, model as AIModelName<"openai">, generationConfig);
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Failed to process request" },
      { status: 500 }
    );
  }
}
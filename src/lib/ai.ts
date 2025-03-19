import models, { AIModelName, AIProviderName } from './ai-models';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, streamText, UIMessage } from "ai";

export async function generateContent<P extends AIProviderName>(prompt: string, provider: P, modelName: AIModelName<P>, generationConfig: Record<string, unknown> = {}) {
  try {
    if (provider === "google") {

      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
      });

      const model = models.google[modelName as AIModelName<"google">];

      const { text } = await generateText({
        model: google(model.id),
        prompt,
        system: model.systemInstructions,
        ...generationConfig
      });

      return text;

    } else if (provider === "microsoft") {
      throw Error("ERROR: Microsoft provider not implemented");
    } else if (provider === "openai") {
      throw new Error("ERROR: OpenAI provider not implemented");
    }
    return "ERROR: AI Provider not found";
  } catch (error) {
    return `Error: ${(error as { message: string }).message}`;
  }
}

export async function generateContentStream<P extends AIProviderName>(messages: UIMessage[], provider: P, modelName: AIModelName<P>, generationConfig: Record<string, unknown> = {}) {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
  });

  const model = models.google[modelName as AIModelName<"google">];

  const stream = streamText({
    model: google(model.id),
    messages,
    system: model.systemInstructions,
    ...generationConfig
  });

  return stream.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return "unknown error";
      }
      if (typeof error === "string") {
        return error;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return JSON.stringify(error);
    },
  });
}
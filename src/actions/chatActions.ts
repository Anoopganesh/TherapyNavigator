'use server';

import { getBotChatResponse, TherapyChatInput, TherapyChatOutput, ChatMessage } from "@/ai/flows/therapy-chat-flow";

export async function callTherapyChatbot(
  userInput: string,
  therapyContext: string,
  chatHistory: ChatMessage[]
): Promise<{ data?: TherapyChatOutput; error?: string }> {
  if (!userInput || userInput.trim().length === 0) {
    return { error: "Message cannot be empty." };
  }

  const input: TherapyChatInput = {
    userInput,
    therapyContext,
    chatHistory,
  };

  try {
    const result = await getBotChatResponse(input);
    return { data: result };
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: `Failed to get response from Navi. Details: ${errorMessage}` };
  }
}

"use server";

import { recommendTherapy, RecommendTherapyInput, RecommendTherapyOutput } from "@/ai/flows/smart-therapy-recommendation";

export async function getTherapyRecommendation(symptoms: string): Promise<{ data?: RecommendTherapyOutput; error?: string }> {
  if (!symptoms || symptoms.trim().length === 0) {
    return { error: "Symptoms cannot be empty." };
  }

  const input: RecommendTherapyInput = { symptoms };

  try {
    const result = await recommendTherapy(input);
    // Validate if the recommended therapy is one of the known types
    const knownTherapyTypes = ["CBT", "MBCT", "Psychodynamic Therapy", "IPT", "Behavioral Activation", "Exposure Therapy"];
    if (!knownTherapyTypes.includes(result.therapyRecommendation)) {
      // If the AI suggests something outside the list, we might want to handle it.
      // For now, let's log it and potentially return a more generic message or fallback.
      console.warn(`AI recommended an unknown therapy type: ${result.therapyRecommendation}`);
      // Optionally, force a fallback or indicate this to the user.
      // For this implementation, we'll pass it through but this is a point for refinement.
    }
    return { data: result };
  } catch (error) {
    console.error("Error getting therapy recommendation:", error);
    return { error: "Failed to get therapy recommendation. Please try again later." };
  }
}

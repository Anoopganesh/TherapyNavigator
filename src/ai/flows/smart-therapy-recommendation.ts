// src/ai/flows/smart-therapy-recommendation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending a therapy type based on user symptoms.
 *
 * - recommendTherapy - A function that takes user symptoms as input and returns a recommended therapy type.
 * - RecommendTherapyInput - The input type for the recommendTherapy function.
 * - RecommendTherapyOutput - The return type for the recommendTherapy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTherapyInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A description of the user symptoms, feelings, and what they want help with.'
    ),
});
export type RecommendTherapyInput = z.infer<typeof RecommendTherapyInputSchema>;

const RecommendTherapyOutputSchema = z.object({
  therapyRecommendation: z
    .string()
    .describe('The recommended therapy type based on the user symptoms.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the therapy recommendation.'),
});
export type RecommendTherapyOutput = z.infer<typeof RecommendTherapyOutputSchema>;

export async function recommendTherapy(input: RecommendTherapyInput): Promise<RecommendTherapyOutput> {
  return recommendTherapyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTherapyPrompt',
  input: {schema: RecommendTherapyInputSchema},
  output: {schema: RecommendTherapyOutputSchema},
  prompt: `You are an AI therapy recommendation expert. Given the following user symptoms, you will recommend the most suitable therapy type. You will also provide a brief explanation of your reasoning. The therapy options are CBT, MBCT, Psychodynamic Therapy, IPT, Behavioral Activation, and Exposure Therapy.

Symptoms: {{{symptoms}}}

Therapy Recommendation (one of CBT, MBCT, Psychodynamic Therapy, IPT, Behavioral Activation, or Exposure Therapy) and Reasoning:
`, // Removed JSON output requirement
});

const recommendTherapyFlow = ai.defineFlow(
  {
    name: 'recommendTherapyFlow',
    inputSchema: RecommendTherapyInputSchema,
    outputSchema: RecommendTherapyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

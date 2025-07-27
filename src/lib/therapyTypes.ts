import type { LucideIcon } from 'lucide-react';
import { BrainCog, Sprout, Users2, MessagesSquare, Zap, ShieldCheck, HelpCircle } from 'lucide-react';

export interface TherapyType {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  samplePrompts: string[];
}

export const therapyTypes: TherapyType[] = [
  {
    id: 'cbt',
    name: 'CBT',
    description: 'Change negative thoughts and behaviors',
    Icon: BrainCog,
    samplePrompts: [
      "Let’s identify a recent negative thought. What happened, and what were you thinking?",
      "What’s the evidence for and against that thought?",
      "How could you reframe it?"
    ]
  },
  {
    id: 'mbct',
    name: 'Mindfulness-Based Cognitive Therapy (MBCT)',
    description: 'Combine mindfulness with cognitive therapy',
    Icon: Sprout,
    samplePrompts: [
      "Let’s begin with a mindful breathing exercise. Ready?",
      "Notice your thoughts without judgment. What are you experiencing right now?"
    ]
  },
  {
    id: 'psychodynamic',
    name: 'Psychodynamic Therapy',
    description: 'Explore past experiences and unconscious patterns',
    Icon: Users2, // Could also be History
    samplePrompts: [
      "Let’s explore your patterns. Can you recall a time earlier in life when you felt this way?",
      "How might that early experience be affecting you now?"
    ]
  },
  {
    id: 'ipt',
    name: 'Interpersonal Therapy (IPT)',
    description: 'Improve your relationships and social functioning',
    Icon: MessagesSquare,
    samplePrompts: [
      "Is there a recent conflict or relationship challenge you want to talk about?",
      "Let’s work on how to express your feelings clearly and assertively."
    ]
  },
  {
    id: 'behavioral_activation',
    name: 'Behavioral Activation',
    description: 'Get back into rewarding activities to improve mood',
    Icon: Zap,
    samplePrompts: [
      "Let’s list activities you used to enjoy.",
      "Choose one small activity you can do today. I’ll check in with you later."
    ]
  },
  {
    id: 'exposure_therapy',
    name: 'Exposure Therapy',
    description: 'Face and overcome your fears gradually',
    Icon: ShieldCheck,
    samplePrompts: [
      "Let’s build a fear hierarchy. What’s something that makes you anxious?",
      "Rate your anxiety from 0 to 10. Ready to take a small step toward facing it?"
    ]
  },
];

export const unknownTherapy: TherapyType = {
  id: 'unknown',
  name: 'Therapy Module',
  description: 'Engage with therapeutic exercises.',
  Icon: HelpCircle,
  samplePrompts: [
    "Welcome to your therapy session.",
    "How are you feeling today?",
    "What would you like to focus on?"
  ]
};

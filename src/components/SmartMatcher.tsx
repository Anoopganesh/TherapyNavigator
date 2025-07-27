"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Wand2, ArrowLeft } from 'lucide-react';
import { getTherapyRecommendation } from '@/actions/recommendationActions';
import type { RecommendTherapyOutput } from "@/ai/flows/smart-therapy-recommendation";
import { therapyTypes, type TherapyType } from '@/lib/therapyTypes';
import { useToast } from '@/hooks/use-toast';

interface SmartMatcherProps {
  onRecommendation: (therapyType: TherapyType) => void;
  onBack: () => void;
}

export function SmartMatcher({ onRecommendation, onBack }: SmartMatcherProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendTherapyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your symptoms or feelings.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    const result = await getTherapyRecommendation(symptoms);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.data) {
      setRecommendation(result.data);
    }
  };

  const handleStartRecommendedTherapy = () => {
    if (recommendation) {
      const matchedTherapy = therapyTypes.find(t => t.name.toLowerCase() === recommendation.therapyRecommendation.toLowerCase() || t.id.toLowerCase() === recommendation.therapyRecommendation.toLowerCase().replace(' ', '_'));
      if (matchedTherapy) {
        onRecommendation(matchedTherapy);
      } else {
         toast({
            title: "Therapy Not Found",
            description: `Could not find a module for "${recommendation.therapyRecommendation}". Please choose from the main menu.`,
            variant: "destructive",
        });
        onBack(); // Go back to selection if recommended therapy is not directly available
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-slide-up bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-2xl flex items-center">
            <Wand2 className="mr-2 h-6 w-6 text-primary" /> Smart Recommendation
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to therapy selection">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </div>
        <CardDescription>
          Describe how you're feeling or what you'd like help with, and I'll suggest a therapy approach.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="For example: 'I've been feeling very anxious about work lately and often find myself overthinking things.' or 'I'm struggling with low motivation and don't enjoy things I used to.'"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={6}
          className="bg-background focus:ring-primary"
          aria-label="Describe your symptoms"
          disabled={isLoading}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !symptoms.trim()} className="w-full bg-primary hover:bg-primary/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Recommendation
        </Button>
      </CardContent>

      {error && (
        <CardFooter className="flex flex-col items-start p-4 bg-destructive/10 rounded-b-lg">
          <div className="flex items-center text-destructive">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p className="font-semibold">Error</p>
          </div>
          <p className="text-sm text-destructive/80 ml-7">{error}</p>
        </CardFooter>
      )}

      {recommendation && (
        <CardFooter className="flex flex-col items-start p-6 bg-accent/10 rounded-b-lg">
          <div className="flex items-center text-accent-foreground mb-2">
            <CheckCircle className="mr-2 h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold font-headline">Recommendation</h3>
          </div>
          <p className="text-md font-medium text-accent-foreground">
            Based on your input, I recommend: <strong className="text-primary">{recommendation.therapyRecommendation}</strong>
          </p>
          <p className="text-sm text-accent-foreground/80 mt-1 mb-4">
            <strong className="font-medium">Reasoning:</strong> {recommendation.reasoning}
          </p>
          <div className="w-full space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
            <Button onClick={handleStartRecommendedTherapy} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              Start with {recommendation.therapyRecommendation}
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
              Choose a different therapy
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

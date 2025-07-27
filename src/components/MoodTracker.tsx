
"use client";

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, FileText, Save, Smile, Meh, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1 to 5
  note?: string;
}

const moodLevels: { value: number; label: string; Icon: React.ElementType }[] = [
  { value: 1, label: 'Very Unpleasant', Icon: Frown },
  { value: 2, label: 'Unpleasant', Icon: Frown },
  { value: 3, label: 'Neutral', Icon: Meh },
  { value: 4, label: 'Pleasant', Icon: Smile },
  { value: 5, label: 'Very Pleasant', Icon: Smile },
];

export function MoodTracker() {
  const [moodEntries, setMoodEntries] = useLocalStorage<MoodEntry[]>('therapyNavigator-moodEntries', []);
  const [currentMood, setCurrentMood] = useState<number[]>([3]); // Slider value is an array
  const [currentNote, setCurrentNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSaveMood = () => {
    if (currentMood[0] < 1 || currentMood[0] > 5) {
      toast({
        title: "Invalid Mood",
        description: "Please select a mood rating between 1 and 5.",
        variant: "destructive",
      });
      return;
    }
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: currentMood[0],
      note: currentNote.trim() || undefined,
    };
    setMoodEntries([newEntry, ...moodEntries]);
    setCurrentMood([3]);
    setCurrentNote('');
    toast({
      title: "Mood Logged",
      description: "Your mood has been saved successfully.",
    });
  };

  const getMoodDetails = (moodValue: number) => {
    return moodLevels.find(m => m.value === moodValue) || { value: moodValue, label: 'Unknown', Icon: Meh };
  };

  if (isLoading) {
    return (
      <Card className="mt-8 animate-pulse bg-card">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Smile className="mr-2 h-6 w-6 text-primary" /> Daily Mood Check-in</CardTitle>
          <CardDescription>Loading your mood log...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 mb-6 animate-slide-up bg-card shadow-lg" style={{animationDelay: '0.4s'}}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center text-xl">
          <Smile className="mr-3 h-7 w-7 text-primary" /> Daily Mood Check-in
        </CardTitle>
        <CardDescription>Log how you're feeling today. Consistent tracking can help you identify patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg bg-background/50 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="mood-slider" className="text-sm font-medium text-foreground/90">
              How are you feeling? (1: Very Unpleasant - 5: Very Pleasant)
            </label>
            <div className="flex items-center gap-4">
              <Frown className="text-primary opacity-70" />
              <Slider
                id="mood-slider"
                min={1}
                max={5}
                step={1}
                value={currentMood}
                onValueChange={setCurrentMood}
                className="my-2 flex-grow"
                aria-label={`Current mood: ${getMoodDetails(currentMood[0])?.label}`}
              />
              <Smile className="text-primary opacity-70" />
            </div>
            <div className="text-center text-sm font-medium text-primary">
              Selected: {getMoodDetails(currentMood[0])?.label}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="mood-note" className="text-sm font-medium text-foreground/90">
              Any thoughts or notes? (Optional)
            </label>
            <Textarea
              id="mood-note"
              placeholder="E.g., Felt good after a walk, or stressed about a deadline..."
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              rows={3}
              className="bg-background focus:ring-primary"
            />
          </div>
          <Button onClick={handleSaveMood} className="w-full bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save Mood
          </Button>
        </div>

        {moodEntries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground/90 flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" /> Your Mood History
            </h3>
            <ScrollArea className="h-60 w-full rounded-md border p-3 bg-background/50">
              <div className="space-y-3">
                {moodEntries.map((entry) => {
                  const moodDetail = getMoodDetails(entry.mood);
                  return (
                    <Card key={entry.id} className="p-3 shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                           <moodDetail.Icon className={`h-5 w-5 ${
                             entry.mood <= 2 ? 'text-red-500' : entry.mood === 3 ? 'text-yellow-500' : 'text-green-500'
                           }`} />
                          <h4 className="font-semibold text-primary">{moodDetail.label}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap flex items-start">
                          <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                          {entry.note}
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
        {moodEntries.length === 0 && !isLoading && (
             <p className="text-muted-foreground text-center py-3">You haven't logged your mood yet. Start today!</p>
        )}
      </CardContent>
       <CardFooter>
        <p className="text-xs text-muted-foreground">
          Your mood data is stored locally in your browser.
        </p>
      </CardFooter>
    </Card>
  );
}

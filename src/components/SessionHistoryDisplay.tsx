
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Archive } from 'lucide-react';
import { therapyTypes } from '@/lib/therapyTypes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SessionNote {
  id: string;
  therapyId: string; // e.g. 'cbt'
  therapyName: string; // e.g. 'CBT'
  date: string;
  text: string;
}

interface CombinedSessionNote extends SessionNote {
  originalTherapyId: string; // To keep track of which specific therapy it came from, same as therapyId
}

export function SessionHistoryDisplay() {
  const [allNotesForUI, setAllNotesForUI] = useState<CombinedSessionNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const therapyIds = useMemo(() => therapyTypes.map(t => t.id), []); // Stable
  
  // Get notes and setters for each therapy type.
  // localStorageData is an array of objects, recreated on each render, but `notes` within is stateful.
  const localStorageData = therapyIds.map(id => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [notes, setNotesValue] = useLocalStorage<SessionNote[]>(`therapyNavigator-sessionNotes-${id}`, []);
    return { therapyId: id, notes, setNotes: setNotesValue };
  });

  // Extract just the 'notes' arrays from localStorageData.
  // This array itself is a new reference on each render.
  const currentNotesFromAllSources = localStorageData.map(data => data.notes);

  // Memoize the calculation of combined and sorted notes.
  // This will only re-compute if one of the underlying 'notes' arrays (in currentNotesFromAllSources)
  // or therapyIds (stable) changes.
  const combinedAndSortedNotes = useMemo(() => {
    const combined: CombinedSessionNote[] = [];
    therapyIds.forEach((id, index) => {
      const notesForThisTherapy = currentNotesFromAllSources[index];
      if (notesForThisTherapy) {
        notesForThisTherapy.forEach(note => {
          // Assuming `note` from localStorage already contains necessary fields like therapyId, therapyName.
          // `originalTherapyId` is set to the `id` of the current therapy type being processed.
          combined.push({ ...note, originalTherapyId: id });
        });
      }
    });
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return combined;
  }, [...currentNotesFromAllSources, therapyIds]); // Spread currentNotesFromAllSources to depend on each notes array individually.

  // Effect to update UI state and loading status.
  useEffect(() => {
    setAllNotesForUI(combinedAndSortedNotes);
    if (isLoading) {
      setIsLoading(false);
    }
  }, [combinedAndSortedNotes, isLoading]);


  // Callback to clear all history.
  // It depends on localStorageData, which is not stable, so this callback ref changes each render.
  // This is generally fine for direct onClick handlers.
  const clearAllHistory = useCallback(() => {
    localStorageData.forEach(data => {
      data.setNotes([]);
    });
  }, [localStorageData]);


  if (isLoading) {
    return (
      <Card className="mt-8 animate-pulse bg-card">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Archive className="mr-2 h-6 w-6 text-primary" /> Session History</CardTitle>
          <CardDescription>Loading your saved session notes...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="mt-8 mb-6 animate-fade-in bg-card shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="font-headline flex items-center"><Archive className="mr-2 h-6 w-6 text-primary" /> Session History</CardTitle>
          <CardDescription>Review your notes from past sessions. All data is stored locally in your browser.</CardDescription>
        </div>
        {allNotesForUI.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your saved session notes from this browser. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllHistory} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {allNotesForUI.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">You have no saved session notes yet.</p>
        ) : (
          <ScrollArea className="h-72 w-full rounded-md border p-4 bg-background/50">
            <div className="space-y-4">
              {allNotesForUI.map((note) => (
                <Card key={note.id} className="p-4 shadow-sm bg-card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-primary">{note.therapyName}</h4>
                    <span className="text-xs text-muted-foreground">{new Date(note.date).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap">{note.text}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}


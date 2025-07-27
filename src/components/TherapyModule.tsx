
"use client";

import type { TherapyType } from '@/lib/therapyTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookOpen, Save, Trash2, SendHorizontal, MessageCircle, User } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useEffect, useState, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { callTherapyChatbot } from '@/actions/chatActions';
import type { ChatMessage } from '@/ai/flows/therapy-chat-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TherapyModuleProps {
  therapy: TherapyType;
  onBack: () => void;
}

interface SessionNote {
  id: string;
  therapyId: string;
  therapyName: string;
  date: string;
  text: string;
}

export function TherapyModule({ therapy, onBack }: TherapyModuleProps) {
  const [sessionNotes, setSessionNotes] = useLocalStorage<SessionNote[]>(`therapyNavigator-sessionNotes-${therapy.id}`, []);
  const [currentNote, setCurrentNote] = useState('');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentUserMessage, setCurrentUserMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages([
      {
        sender: 'bot',
        text: `Hello! I'm Navi, your AI companion. I'm here to listen and support you as you reflect on your ${therapy.name} exercises. How are you feeling after your session today? Remember, I'm not a therapist, but I'm here to chat if you'd like.`,
      },
    ]);
    setCurrentUserMessage(''); 
  }, [therapy.id, therapy.name]); 

  useEffect(() => {
    if (chatScrollAreaRef.current) {
      const scrollViewport = chatScrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [chatMessages]);

  const handleSaveNote = async () => {
    if (currentNote.trim()) {
      const noteToSave = currentNote; 
      const newNote: SessionNote = {
        id: Date.now().toString(),
        therapyId: therapy.id,
        therapyName: therapy.name,
        date: new Date().toISOString(),
        text: noteToSave,
      };
      setSessionNotes([...sessionNotes, newNote]);
      toast({ title: "Note Saved", description: `Your note for ${therapy.name} has been saved.` });
      setCurrentNote(''); 

      const noteAsUserMessageForUI: ChatMessage = { sender: 'user', text: noteToSave };
      
      setIsBotTyping(true);
      setChatMessages((prevMessages) => [...prevMessages, noteAsUserMessageForUI]);

      const historyForBot = chatMessages; // History *before* this new note was added for UI

      const result = await callTherapyChatbot(noteToSave, therapy.name, historyForBot);
      
      setIsBotTyping(false);

      let botResponseText = "I'm sorry, I'm having a little trouble responding right now. Could you try rephrasing?";
      if (result.error) {
        toast({
          title: 'Navi Error',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result.data?.botResponse) {
        botResponseText = result.data.botResponse;
      }
      
      setChatMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponseText }]);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setSessionNotes(sessionNotes.filter(note => note.id !== noteId));
    toast({ title: "Note Deleted", description: "The selected note has been removed.", variant: "destructive" });
  };

  const handleSendMessage = async () => {
    if (!currentUserMessage.trim()) return;

    const userMessageText = currentUserMessage;
    const newUserMessage: ChatMessage = { sender: 'user', text: userMessageText };
    
    setCurrentUserMessage('');
    setIsBotTyping(true);
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const historyForBot = chatMessages; // History *before* this new user message

    const result = await callTherapyChatbot(userMessageText, therapy.name, historyForBot);
    setIsBotTyping(false);
    
    let botResponseText = "I'm sorry, I'm having a little trouble responding right now. Could you try rephrasing?";
    if (result.error) {
      toast({
        title: 'Navi Error',
        description: result.error,
        variant: 'destructive',
      });
    } else if (result.data?.botResponse) {
      botResponseText = result.data.botResponse;
    }
    setChatMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponseText }]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-slide-up bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <therapy.Icon className="w-8 h-8 text-primary" />
          <CardTitle className="font-headline text-2xl">{therapy.name}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} aria-label="Back to therapy selection">
          <ArrowLeft className="mr-1 h-4 w-4" /> Switch Therapy
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground/90 mb-2 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-primary" /> Guided Prompts
          </h3>
          <CardDescription className="mb-1">{therapy.description}</CardDescription>
          <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-muted-foreground">
            {therapy.samplePrompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground/90 mb-2">Session Notes & Reflections</h3>
            <Textarea
            placeholder={`Record your thoughts, feelings, or responses to ${therapy.name} exercises here...`}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            rows={5}
            className="bg-background focus:ring-primary"
            aria-label="Session notes"
            />
            <Button onClick={handleSaveNote} disabled={!currentNote.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="mr-2 h-4 w-4" /> Save Note
            </Button>
        </div>

        {sessionNotes.length > 0 && (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground/90 mb-2">Your Saved Notes for {therapy.name}</h3>
                <ScrollArea className="h-48 w-full rounded-md border p-3 bg-background/50">
                {sessionNotes.slice().reverse().map(note => (
                    <Card key={note.id} className="mb-3 p-3 bg-card shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-xs text-muted-foreground">{new Date(note.date).toLocaleString()}</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80" onClick={() => handleDeleteNote(note.id)} aria-label="Delete note">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                    </Card>
                ))}
                </ScrollArea>
            </div>
        )}

        {/* Chatbot Section */}
        <div className="space-y-4 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground/90 mb-2 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" /> Chat with Navi
            </h3>
            <Card className="bg-background/70 shadow-inner">
                <CardContent className="p-0">
                    <ScrollArea className="h-72 w-full p-4" ref={chatScrollAreaRef}>
                        <div className="space-y-4">
                            {chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-end gap-2 animate-fade-in",
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {msg.sender === 'bot' && <MessageCircle className="h-6 w-6 text-primary self-start shrink-0" />}
                                    <div
                                        className={cn(
                                            "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow",
                                            msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted text-muted-foreground rounded-bl-none'
                                        )}
                                    >
                                        {msg.text.split('\n').map((line, i) => (
                                          <span key={i}>{line}<br/></span>
                                        ))}
                                    </div>
                                    {msg.sender === 'user' && <User className="h-6 w-6 text-muted-foreground self-start shrink-0" />}
                                </div>
                            ))}
                            {isBotTyping && (
                                <div className="flex items-end gap-2 justify-start animate-fade-in">
                                    <MessageCircle className="h-6 w-6 text-primary self-start" />
                                    <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm shadow bg-muted text-muted-foreground rounded-bl-none">
                                        <span className="italic">Navi is typing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-border bg-background/50">
                        <div className="flex items-center gap-2">
                            <Textarea
                                placeholder="Type your message to Navi..."
                                value={currentUserMessage}
                                onChange={(e) => setCurrentUserMessage(e.target.value)}
                                rows={1}
                                className="flex-grow resize-none bg-background focus:ring-primary"
                                aria-label="Chat message input"
                                onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                                }}
                                disabled={isBotTyping}
                            />
                            <Button onClick={handleSendMessage} disabled={!currentUserMessage.trim() || isBotTyping} className="bg-primary hover:bg-primary/90">
                                <SendHorizontal className="h-4 w-4" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </div>
                         <p className="text-xs text-muted-foreground mt-2">Navi is an AI assistant and not a therapist. For guidance, refer to the disclaimer.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          All your notes and chat interactions are stored locally in your browser. Navi's responses are for reflection and support, not medical advice.
        </p>
      </CardFooter>
    </Card>
  );
}


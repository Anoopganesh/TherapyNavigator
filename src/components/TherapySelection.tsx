
import { therapyTypes, type TherapyType } from '@/lib/therapyTypes';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface TherapySelectionProps {
  onSelectTherapy: (therapy: TherapyType) => void;
  onShowSmartMatcher: () => void;
}

export function TherapySelection({ onSelectTherapy, onShowSmartMatcher }: TherapySelectionProps) {
  return (
    <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
      <div className="text-center">
        <h2 className="text-2xl font-semibold font-headline mb-2">Welcome to Therapy Navigator</h2>
        <p className="text-muted-foreground mb-6">
          How are you feeling today? What kind of support are you looking for?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapyTypes.map((therapy) => (
          <Card 
            key={therapy.id} 
            className="hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col bg-card hover:bg-card/90"
            onClick={() => onSelectTherapy(therapy)}
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && onSelectTherapy(therapy)}
            aria-label={`Select ${therapy.name}`}
          >
            <CardHeader className="flex-row items-center gap-4 pb-2">
              <therapy.Icon className="w-10 h-10 text-primary" />
              <CardTitle className="font-headline text-lg flex-1 min-w-0">{therapy.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{therapy.description}</CardDescription>
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-primary hover:text-primary/80 whitespace-normal h-auto text-left"
                >
                  Start with {therapy.name} <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-accent/20 border-accent shadow-md text-center">
        <h3 className="text-xl font-semibold text-accent-foreground mb-3 font-headline">Not sure where to start?</h3>
        <p className="text-accent-foreground/80 mb-4">
          Answer a few quick questions and I’ll suggest a helpful approach based on your current feelings and needs.
        </p>
        <Button onClick={onShowSmartMatcher} variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Get a Recommendation <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Card>
    </div>
  );
}

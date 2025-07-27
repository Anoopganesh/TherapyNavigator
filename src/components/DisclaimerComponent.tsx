import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function DisclaimerComponent() {
  return (
    <Card className="mt-8 mb-4 bg-secondary/50 border-secondary shadow-lg animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-secondary-foreground mt-1" />
          <div>
            <h3 className="font-semibold text-secondary-foreground">Important Disclaimer</h3>
            <p className="text-sm text-secondary-foreground/80">
              I’m not a licensed therapist, but I can guide you using evidence-based tools.
              This tool is for informational and educational purposes only and does not constitute medical advice or diagnosis.
            </p>
            <div className="mt-2 space-x-4">
              <a 
                href="https://www.google.com/search?q=top+therapists+in+Bangalore" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Talk to a real therapist
              </a>
              <a 
                href="https://www.aasra.info/helpline.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-destructive hover:underline font-medium"
              >
                Access a crisis line
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DisclaimerComponent } from '@/components/DisclaimerComponent';
import { TherapySelection } from '@/components/TherapySelection';
import { SmartMatcher } from '@/components/SmartMatcher';
import { TherapyModule } from '@/components/TherapyModule';
import { SessionHistoryDisplay } from '@/components/SessionHistoryDisplay';
import { MoodTracker } from '@/components/MoodTracker'; // Import MoodTracker
import type { TherapyType } from '@/lib/therapyTypes';
import { unknownTherapy } from '@/lib/therapyTypes'; // Fallback therapy type

type ViewState = 'selection' | 'smartMatcher' | 'therapyModule';

export default function TherapyNavigatorClient() {
  const [currentView, setCurrentView] = useState<ViewState>('selection');
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyType | null>(null);
  
  // Add a key to TherapyModule to force re-mount when therapy changes
  const [therapyModuleKey, setTherapyModuleKey] = useState(0);

  useEffect(() => {
    // Scroll to top when view changes
    window.scrollTo(0, 0);
  }, [currentView, selectedTherapy]);

  const handleSelectTherapy = (therapy: TherapyType) => {
    setSelectedTherapy(therapy);
    setCurrentView('therapyModule');
    setTherapyModuleKey(prevKey => prevKey + 1); // Change key to re-mount TherapyModule
  };

  const handleShowSmartMatcher = () => {
    setCurrentView('smartMatcher');
  };

  const handleBackToSelection = () => {
    setSelectedTherapy(null);
    setCurrentView('selection');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'selection':
        return (
          <TherapySelection
            onSelectTherapy={handleSelectTherapy}
            onShowSmartMatcher={handleShowSmartMatcher}
          />
        );
      case 'smartMatcher':
        return (
          <SmartMatcher
            onRecommendation={handleSelectTherapy}
            onBack={handleBackToSelection}
          />
        );
      case 'therapyModule':
        return (
          <TherapyModule
            key={therapyModuleKey} // Use key here
            therapy={selectedTherapy || unknownTherapy} // Provide a fallback
            onBack={handleBackToSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="transition-opacity duration-500 ease-in-out">
          {renderContent()}
        </div>
        {currentView === 'selection' && (
          <>
            <MoodTracker /> 
            <SessionHistoryDisplay />
          </>
        )}
      </main>
      <footer className="container mx-auto px-4 py-2">
         <DisclaimerComponent />
      </footer>
    </div>
  );
}

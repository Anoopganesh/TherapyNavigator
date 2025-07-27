import { Compass } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 px-4 md:px-8 bg-primary/10 shadow-md">
      <div className="container mx-auto flex items-center gap-3">
        <Compass className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary font-headline">
          Therapy Navigator
        </h1>
      </div>
    </header>
  );
}

'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground">
      <div className="bg-card p-8 rounded-lg shadow-xl max-w-md">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-3 text-destructive">Oops! Something went wrong.</h2>
        <p className="mb-2 text-muted-foreground">
          We encountered an unexpected issue. Please try again.
        </p>
        {error?.message && (
          <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted/50 my-3">
            Error details: {error.message}
          </p>
        )}
        <Button
          onClick={() => reset()}
          className="mt-4"
          size="lg"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

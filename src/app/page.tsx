import QuizContainer from '@/components/quiz/QuizContainer';
import type { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getQuestions(): Promise<Question[]> {
  // Ensure NEXT_PUBLIC_APP_URL is set in your environment variables for production/Vercel.
  // Default to localhost for local development.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'; 
  
  // Adding a timestamp to prevent caching during development, remove for production if not needed.
  // const res = await fetch(`${baseUrl}/data/questions.json?t=${new Date().getTime()}`, { cache: 'no-store' });
  const res = await fetch(`${baseUrl}/data/questions.json`, { cache: 'no-store' });


  if (!res.ok) {
    let errorDetails = `Status: ${res.status}. URL: ${baseUrl}/data/questions.json.`;
    try {
      const errorBody = await res.text();
      errorDetails += ` Response: ${errorBody.substring(0, 200)}`; // Limit response length
    } catch (e) {
      // ignore if can't read body
    }
    console.error("Failed to fetch questions:", errorDetails);
    throw new Error(`Failed to fetch questions. ${errorDetails}`);
  }

  try {
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("Fetched questions data is empty or not an array. Ensure public/data/questions.json is correct.");
        return []; // Return empty array to be handled by UI
    }
    return data;
  } catch (error) {
    console.error("Failed to parse questions JSON:", error);
    throw new Error("Failed to parse questions JSON.");
  }
}

export default async function QuizPage() {
  let questions: Question[] = [];
  let fetchError: string | null = null;

  try {
    questions = await getQuestions();
  } catch (error: any) {
    fetchError = error.message || "An unknown error occurred while fetching questions.";
  }

  if (fetchError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="bg-card p-8 rounded-lg shadow-xl text-center max-w-lg">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Quiz</h1>
          <p className="mb-2">We couldn't load the questions for the quiz. This might be a temporary issue.</p>
          <p className="text-sm text-muted-foreground mb-4">Details: {fetchError}</p>
          <p className="mt-4 text-sm">Please ensure <code>questions.json</code> is available at <code>public/data/questions.json</code>. You might need to restart the application or check your network connection.</p>
          <Button asChild className="mt-6">
            <Link href="/">Try Again</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (questions.length === 0 && !fetchError) {
     return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="bg-card p-8 rounded-lg shadow-xl text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">No Questions Found</h1>
          <p>The quiz is currently empty. Please add some questions to <code>public/data/questions.json</code> and try again.</p>
           <Button asChild className="mt-6">
            <Link href="/">Reload Page</Link>
          </Button>
        </div>
      </main>
    );
  }

  return <QuizContainer questions={questions} />;
}

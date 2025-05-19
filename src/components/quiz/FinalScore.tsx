"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Award, RotateCcw } from 'lucide-react';

interface FinalScoreProps {
  score: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

const FinalScore: React.FC<FinalScoreProps> = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "";
  let messageColor = "text-foreground";

  if (percentage >= 80) {
    message = "Excellent Work! You're a QuizWhiz!";
    messageColor = "text-primary"; // Use primary for excellent
  } else if (percentage >= 50) {
    message = "Good Job! Keep practicing!";
    messageColor = "text-accent-foreground bg-accent/30 p-2 rounded-md inline-block"; // Use accent related color for good
  } else {
    message = "Better luck next time! Keep learning!";
    messageColor = "text-muted-foreground";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-8">
          <Award className="h-20 w-20 text-accent mx-auto animate-bounce" /> {/* Bounce animation for award */}
          <p className={`text-xl font-semibold ${messageColor}`}>{message}</p>
          <p className="text-5xl font-bold text-foreground">
            {score} <span className="text-3xl text-muted-foreground">/ {totalQuestions}</span>
          </p>
          <p className="text-2xl font-medium text-primary">({percentage}%)</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onPlayAgain} size="lg" className="w-full text-lg py-6">
            <RotateCcw className="mr-2 h-5 w-5" /> Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FinalScore;

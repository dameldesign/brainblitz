"use client";

import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface FeedbackDisplayProps {
  type: 'correct' | 'incorrect';
  correctAnswer?: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ type, correctAnswer }) => {
  const isCorrect = type === 'correct';
  const Icon = isCorrect ? CheckCircle2 : XCircle;
  const message = isCorrect ? "Correct!" : "Oops, not quite!";
  
  // Use theme colors: primary for correct, destructive for incorrect
  const feedbackColorClass = isCorrect ? "text-primary" : "text-destructive";
  // For correct answer highlight, use accent color background with its foreground
  const correctAnswerBoxClass = "bg-accent text-accent-foreground";


  return (
    <div className={`mt-6 p-4 rounded-md text-center animate-fadeIn`}>
      <div className={`flex items-center justify-center text-2xl font-bold ${feedbackColorClass}`}>
        <Icon className={`mr-2.5 h-8 w-8`} />
        <span>{message}</span>
      </div>
      {!isCorrect && correctAnswer && (
        <p className={`mt-3 text-md text-muted-foreground`}>
          The correct answer was: 
          <span className={`ml-1.5 font-semibold p-1.5 rounded-md ${correctAnswerBoxClass}`}>
            {correctAnswer}
          </span>
        </p>
      )}
    </div>
  );
};

export default FeedbackDisplay;

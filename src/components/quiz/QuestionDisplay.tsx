"use client";

import React from 'react';
import type { Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  disabled: boolean; // True during feedback phase or if an answer is already submitted
  feedbackType: 'correct' | 'incorrect' | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled,
  feedbackType,
}) => {
  return (
    <div className="p-1 md:p-4 rounded-lg">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-foreground">{question.questionText}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = question.correctAnswer === option;

          let buttonVariant: "outline" | "default" | "secondary" | "destructive" = "outline";
          let additionalClasses = "transition-all duration-300 ease-in-out";

          if (disabled && feedbackType) { // During feedback phase
            if (isCorrectOption) {
              // This option is the correct one
              buttonVariant = "default"; 
              additionalClasses += " bg-accent text-accent-foreground border-accent hover:bg-accent/90 focus:ring-accent";
            } else if (isSelected && !isCorrectOption) {
              // User selected this option, and it's incorrect
              buttonVariant = "destructive";
              additionalClasses += " hover:bg-destructive/90";
            } else {
              // Option is neither selected by user nor the correct one (or it is correct but not selected - covered above)
              buttonVariant = "outline";
              additionalClasses += " opacity-70 hover:bg-muted/50";
            }
          } else if (isSelected && !disabled) { // User's current pick, before feedback, and not disabled
            buttonVariant = "default";
            additionalClasses += " ring-2 ring-primary";
          } else { // Default state for options
            buttonVariant = "outline";
            additionalClasses += " hover:bg-muted/80";
          }

          return (
            <Button
              key={index}
              variant={buttonVariant}
              className={cn(
                "w-full justify-start p-4 h-auto text-left text-base leading-tight break-words whitespace-normal focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
                additionalClasses
              )}
              onClick={() => onAnswerSelect(option)}
              disabled={disabled}
              aria-pressed={isSelected}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;

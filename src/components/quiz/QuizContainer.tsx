"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Question } from '@/types/quiz';
import QuestionDisplay from './QuestionDisplay';
import TimerDisplay from './TimerDisplay';
import ScoreDisplay from './ScoreDisplay';
import FeedbackDisplay from './FeedbackDisplay';
import FinalScore from './FinalScore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type QuizStatus = 'not-started' | 'active' | 'feedback' | 'finished';
type FeedbackType = 'correct' | 'incorrect' | null;

interface QuizContainerProps {
  questions: Question[];
}

const QuizContainer: React.FC<QuizContainerProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('not-started');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [timerKey, setTimerKey] = useState(0); // To reset timer animation & interval

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (quizStatus === 'active' && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
      setTimerKey(prev => prev + 1); // Resets TimerDisplay progress and ensures useEffect for interval re-runs
    }
  }, [currentQuestionIndex, quizStatus, currentQuestion]);

  const handleAnswerSubmission = useCallback((answer: string | null) => {
    if (quizStatus !== 'active' || !currentQuestion) return;

    setQuizStatus('feedback');
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedbackType('correct');
    } else {
      setFeedbackType('incorrect');
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setFeedbackType(null);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setQuizStatus('active');
      } else {
        setQuizStatus('finished');
      }
    }, 2000); // 2 seconds for feedback
  }, [currentQuestion, currentQuestionIndex, questions.length, quizStatus]);

  useEffect(() => {
    if (quizStatus !== 'active' || !currentQuestion) { 
      return;
    }
    
    if (timeLeft <= 0) { 
      handleAnswerSubmission(null); 
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) { 
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [quizStatus, timeLeft, timerKey, currentQuestion, handleAnswerSubmission]); 


  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedbackType(null);
    setQuizStatus('active');
  };

  const handleAnswerSelect = (answer: string) => {
    if (quizStatus === 'active') {
      setSelectedAnswer(answer);
      handleAnswerSubmission(answer); // Auto-submit on selection
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Quiz Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No questions available. Please check the configuration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (quizStatus === 'not-started') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">QuizWhiz!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-lg text-muted-foreground">Ready to test your knowledge?</p>
            <Button onClick={handleStartQuiz} size="lg" className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizStatus === 'finished') {
    return <FinalScore score={score} totalQuestions={questions.length} onPlayAgain={handleStartQuiz} />;
  }
  
  if (!currentQuestion && quizStatus !== 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl md:text-2xl font-semibold">Question {currentQuestionIndex + 1}/{questions.length}</CardTitle>
            <ScoreDisplay score={score} />
          </div>
          {currentQuestion && <TimerDisplay timeLeft={timeLeft} totalTime={currentQuestion.timeLimit} key={`timer-${timerKey}`} />}
        </CardHeader>
        <CardContent>
          {currentQuestion && <QuestionDisplay
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            disabled={quizStatus === 'feedback'}
            feedbackType={feedbackType}
          />}
          {quizStatus === 'feedback' && feedbackType && currentQuestion && (
            <FeedbackDisplay type={feedbackType} correctAnswer={currentQuestion.correctAnswer} />
          )}
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
           <p className="text-sm text-center text-muted-foreground">Select an answer before the timer runs out. Good luck!</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizContainer;

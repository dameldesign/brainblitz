"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime }) => {
  const percentageLeft = totalTime > 0 ? Math.max(0, (timeLeft / totalTime) * 100) : 0;
  
  let progressColorClass = "[&>div]:bg-primary"; // Default color (blue)
  if (percentageLeft <= 25) {
    progressColorClass = "[&>div]:bg-destructive"; // Red when time is low
  } else if (percentageLeft <= 50) {
    progressColorClass = "[&>div]:bg-accent"; // Accent color (yellow) for medium time
  }


  return (
    <div className="w-full max-w-xs mx-auto my-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>Time Remaining</span>
        </div>
        <span className="text-sm font-semibold text-foreground">{timeLeft}s</span>
      </div>
      <Progress value={percentageLeft} className={`h-2.5 w-full ${progressColorClass}`} />
    </div>
  );
};

export default TimerDisplay;

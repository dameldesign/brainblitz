"use client";

import React from 'react';
import { Trophy } from 'lucide-react'; // Changed Star to Trophy for score icon

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="flex items-center space-x-2 text-lg font-semibold text-primary">
      <Trophy className="h-6 w-6" /> {/* Icon inherits text-primary color */}
      <span>Score: {score}</span>
    </div>
  );
};

export default ScoreDisplay;

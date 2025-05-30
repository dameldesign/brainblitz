export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  timeLimit: number; // seconds
}

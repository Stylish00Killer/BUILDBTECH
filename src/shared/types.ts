export interface User {
  id: number;
  username: string;
  password: string;
}

export interface LabReport {
  id: number;
  userId: number;
  title: string;
  content: string;
  data: string;
  createdAt: string;
}

export interface ProjectIdea {
  id: number;
  title: string;
  description: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface ExamPrep {
  id: number;
  subject: string;
  topic: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

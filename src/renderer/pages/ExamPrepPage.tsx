import React, { useState } from 'react';
import { Question } from '../../shared/types';

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: 'What is the primary purpose of Object-Oriented Programming?',
    options: [
      'To make code faster',
      'To organize code into reusable objects',
      'To reduce memory usage',
      'To write less code'
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: 'Which data structure uses LIFO principle?',
    options: [
      'Queue',
      'Stack',
      'Linked List',
      'Array'
    ],
    correctAnswer: 1
  }
];

const ExamPrepPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === sampleQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  if (showResult) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Exam Preparation</h1>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-4">
            Your score: {score} out of {sampleQuestions.length}
          </p>
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Exam Preparation</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">
            Question {currentQuestionIndex + 1} of {sampleQuestions.length}
          </span>
          <span className="text-lg font-medium">
            Score: {score}
          </span>
        </div>

        <div className="space-y-4">
          <p className="text-xl">{currentQuestion.text}</p>

          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-3 text-left rounded ${
                  selectedAnswer === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          {currentQuestionIndex === sampleQuestions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default ExamPrepPage;

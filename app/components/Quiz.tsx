'use client';

import { useState, useEffect } from 'react';
import { QuizQuestion, quizQuestions } from '../data/quizData';

interface QuizProps {
  playerName: string;
  playerSchool: string;
  onQuizComplete: (result: QuizResult) => void;
}

export interface QuizResult {
  playerName: string;
  playerSchool: string;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  totalTime: number;
  answers: { questionId: number; selectedAnswer: number; isCorrect: boolean; timeSpent: number }[];
}

export default function Quiz({ playerName, playerSchool, onQuizComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 각 문제당 60초
  const [totalTime, setTotalTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<QuizResult['answers']>([]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 시간 초과시 자동으로 다음 문제로
      handleNextQuestion();
    }
  }, [timeLeft]);

  // 새 문제 시작시 타이머 리셋
  useEffect(() => {
    setTimeLeft(60);
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // 답안 기록
    const newAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer ?? -1,
      isCorrect,
      timeSpent
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // 퀴즈 완료
      const correctAnswers = updatedAnswers.filter(answer => answer.isCorrect).length;
      const totalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
      
      const result: QuizResult = {
        playerName,
        playerSchool,
        totalScore,
        correctAnswers,
        totalQuestions: quizQuestions.length,
        totalTime,
        answers: updatedAnswers
      };
      
      onQuizComplete(result);
    } else {
      // 다음 문제로
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0041C2] to-[#003399] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* 헤더 */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">콴다 학교대항전 퀴즈</h1>
          <div className="flex justify-center items-center space-x-6 text-lg">
            <span>👤 {playerName}</span>
            <span>🏫 {playerSchool}</span>
            <span>⏰ {timeLeft}초</span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>문제 {currentQuestionIndex + 1} / {quizQuestions.length}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
          <div className="w-full bg-blue-900 rounded-full h-3">
            <div 
              className="bg-[#FFD60A] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 퀴즈 카드 */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* 과목 태그 */}
          <div className="inline-block bg-[#0041C2] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            {currentQuestion.subject}
          </div>

          {/* 문제 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* 선택지 */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:shadow-md ${
                  selectedAnswer === index
                    ? 'border-[#0041C2] bg-blue-50 text-[#0041C2] font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* 다음 버튼 */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              난이도: <span className="font-medium">{
                currentQuestion.difficulty === 'easy' ? '쉬움' :
                currentQuestion.difficulty === 'medium' ? '보통' : '어려움'
              }</span>
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="bg-[#FFD60A] text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? '결과 확인하기' : '다음 문제'}
            </button>
          </div>
        </div>

        {/* 타이머 경고 */}
        {timeLeft <= 10 && (
          <div className="text-center mt-4">
            <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full animate-pulse">
              ⚠️ {timeLeft}초 남았습니다!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

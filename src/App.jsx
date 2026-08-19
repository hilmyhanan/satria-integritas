import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizBoard from './components/QuizBoard';
import ScoreBoard from './components/ScoreBoard';
import Leaderboard from './components/Leaderboard';
import { getRandomQuestions } from './data/questions';
import { saveScore } from './firebase';

// State Enum
const STAGES = {
  WELCOME: 'WELCOME',
  QUIZ: 'QUIZ',
  SCORE_TRANSITION: 'SCORE_TRANSITION',
  LEADERBOARD: 'LEADERBOARD'
};

function App() {
  const [stage, setStage] = useState(STAGES.WELCOME);
  
  // User Data
  const [userName, setUserName] = useState('');
  const [userCategory, setUserCategory] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  
  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);

  const startQuiz = (name, category, avatar) => {
    setUserName(name);
    setUserCategory(category);
    setUserAvatar(avatar);
    setQuestions(getRandomQuestions(10)); // Mengambil 10 soal acak
    setCurrentQuestionIndex(0);
    setScore(0);
    setStage(STAGES.QUIZ);
  };

  const handleAnswer = (isCorrect, pointsEarned) => {
    setLastAnswerCorrect(isCorrect);
    setLastPointsEarned(pointsEarned);
    if (isCorrect) {
      setScore(prev => prev + pointsEarned);
    }
    setStage(STAGES.SCORE_TRANSITION);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setStage(STAGES.QUIZ);
    } else {
      // Quiz Selesai, simpan skor
      let finalScore = score;
      if (lastAnswerCorrect && stage === STAGES.SCORE_TRANSITION) {
        // Wait, score was already updated in handleAnswer, 
        // because setState is async but we calculate it. 
        // We use the current `score` state here since it has updated before next question.
        finalScore = score;
      }
      
      await saveScore(userName, userCategory, finalScore, userAvatar);
      setStage(STAGES.LEADERBOARD);
    }
  };

  const restartQuiz = () => {
    setStage(STAGES.WELCOME);
    setUserName('');
    setUserCategory('');
    setUserAvatar('');
    setScore(0);
  };

  return (
    <div className="app-container">
      {stage === STAGES.WELCOME && (
        <WelcomeScreen 
          onStart={startQuiz} 
          onViewLeaderboard={() => setStage(STAGES.LEADERBOARD)}
        />
      )}
      
      {stage === STAGES.QUIZ && questions.length > 0 && (
        <QuizBoard 
          questionData={questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      )}
      
      {stage === STAGES.SCORE_TRANSITION && (
        <ScoreBoard 
          currentScore={score} 
          isCorrect={lastAnswerCorrect}
          lastPointsEarned={lastPointsEarned}
          userName={userName}
          userCategory={userCategory}
          userAvatar={userAvatar}
          onNext={handleNextQuestion}
        />
      )}
      
      {stage === STAGES.LEADERBOARD && (
        <Leaderboard 
          userScore={score}
          userName={userName}
          userCategory={userCategory}
          onRestart={restartQuiz}
        />
      )}
    </div>
  );
}

export default App;

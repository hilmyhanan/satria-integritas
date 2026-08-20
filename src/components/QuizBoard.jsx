import React, { useState, useEffect } from 'react';

const QuizBoard = ({ questionData, questionIndex, totalQuestions, onAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Reset state when question changes
    setTimeLeft(20);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [questionData]);

  useEffect(() => {
    if (timeLeft === 0 && !showResult) {
      handleTimeUp();
      return;
    }

    if (!showResult) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft, showResult]);

  const handleTimeUp = () => {
    setShowResult(true);
    setTimeout(() => {
      onAnswer(false, 0); // Wrong answer due to timeout, 0 points
    }, 2000);
  };

  const handleOptionClick = (option) => {
    if (showResult) return; // Prevent clicking after answering

    // Haptic feedback for tap
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    setSelectedAnswer(option);
    setShowResult(true);
    
    const isCorrect = option === questionData.answer;
    let pointsEarned = 0;
    if (isCorrect) {
      // Time-based scoring (max 1000, min 500)
      pointsEarned = Math.round((timeLeft / 20) * 500) + 500;
    }
    
    if (window.navigator && window.navigator.vibrate) {
      if (isCorrect) {
        window.navigator.vibrate([100, 50, 100]); // Success feel
      } else {
        window.navigator.vibrate([50, 100, 50, 100, 50]); // Error feel
      }
    }
    
    setTimeout(() => {
      onAnswer(isCorrect, pointsEarned, option);
    }, 2000);
  };

  return (
    <div className="fade-in" key={questionData.id}>
      <div className="quiz-header">
        <div className="progress">
          Pertanyaan {questionIndex + 1} / {totalQuestions}
        </div>
        <div className={`timer-badge ${timeLeft <= 5 ? 'danger' : ''}`}>
          ⏱ {timeLeft}s
        </div>
      </div>
      
      <div className="question-text">
        {questionData.text || questionData.question}
      </div>
      
      <div className="options-grid">
        {questionData.options.map((option, idx) => {
          let btnClass = "option-btn";
          
          // Kahoot color mapping based on index
          const colorClasses = ['opt-red', 'opt-blue', 'opt-yellow', 'opt-green'];
          const baseColorClass = colorClasses[idx % 4];
          btnClass += ` ${baseColorClass}`;

          if (showResult) {
            if (option === questionData.answer) {
              btnClass += " correct";
            } else if (option === selectedAnswer) {
              btnClass += " wrong";
            }
          } else if (selectedAnswer === option) {
            btnClass += " selected";
          }
          
          const letter = String.fromCharCode(65 + idx); // 0 -> A, 1 -> B, etc.

          return (
            <button 
              key={idx}
              className={btnClass}
              onClick={() => !showResult && handleOptionClick(option)}
              disabled={showResult}
            >
              <span className="opt-letter">{letter}.</span> {option}
              {showResult && option === questionData.answer && <span className="result-icon">✓</span>}
              {showResult && selectedAnswer === option && option !== questionData.answer && <span className="result-icon">✕</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizBoard;

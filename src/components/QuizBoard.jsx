import React, { useState, useEffect } from 'react';

// Sound effects helper
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

const QuizBoard = ({ questionData, questionIndex, totalQuestions, onAnswer, streak }) => {
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
    
    playSound(isCorrect ? 'correct' : 'wrong');
    
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
        {streak >= 3 && (
          <div className="streak-badge pulse-animation" style={{ color: '#FF5722', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
            🔥 ON FIRE! {streak} STREAK (1.5x Points)
          </div>
        )}
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

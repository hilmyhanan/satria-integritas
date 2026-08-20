import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../firebase';

const Leaderboard = ({ userScore, userName, userCategory, userAnswers, onRestart }) => {
  const [activeTab, setActiveTab] = useState(userCategory);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const fetchLeaderboard = async (category) => {
    setLoading(true);
    try {
      const data = await getLeaderboard(category);
      setLeaderboardData(data);
      
      // Calculate user rank if it's the category they played
      if (category === userCategory && userName) {
        const rankIndex = data.findIndex(item => item.name === userName && item.score === userScore);
        if (rankIndex !== -1) {
          setUserRank(rankIndex + 1);
        } else {
          setUserRank('>10');
        }
      } else {
        setUserRank(null);
      }
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h1>Klasemen Akhir</h1>
      
      <div className="final-score-display">
        <span className="final-score-label">Total Poin</span>
        <div className="final-score-number">{userScore}</div>
      </div>
      
      <div className="congrats-text">
        Kerja bagus, <span className="highlight-name">{userName}</span>! 
      </div>

      {userRank && (
        <div className="rank-banner fade-in">
          {userRank !== '>10' ? (
            <span>Luar biasa! Anda berada di Peringkat <strong>#{userRank}</strong>! 🎉</span>
          ) : (
            <span>Skor akhirmu tersimpan! Terus tingkatkan untuk masuk Top 10!</span>
          )}
        </div>
      )}

      {userAnswers && userAnswers.length > 0 && (
        <div className="action-buttons-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setShowReview(true)} style={{ margin: 0 }}>
            📖 Lihat Pembahasan
          </button>
          <button className="btn-primary" onClick={onRestart} style={{ margin: 0 }}>
            🏠 Beranda
          </button>
        </div>
      )}

      <div className="leaderboard-tabs" style={{ marginTop: '2.5rem' }}>
        <button 
          className={`tab-btn ${activeTab === 'Mahasiswa / Pelajar' ? 'active' : ''}`}
          onClick={() => setActiveTab('Mahasiswa / Pelajar')}
        >
          Mahasiswa / Pelajar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'Umum' ? 'active' : ''}`}
          onClick={() => setActiveTab('Umum')}
        >
          Umum
        </button>
      </div>
      
      {loading ? (
        <p className="loading-text">Memuat data klasemen...</p>
      ) : (
        <ul className="leaderboard-list">
          {leaderboardData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#7F8C8D' }}>Belum ada data di kategori ini.</p>
          ) : (
            leaderboardData.map((item, index) => {
              const isCurrentUser = item.name === userName && item.score === userScore && activeTab === userCategory;
              return (
                <li key={index} className={`leaderboard-item fade-in ${isCurrentUser ? 'highlight-current' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`rank rank-${index + 1}`}>{index + 1}</div>
                <div className="player-info">
                  <div className="player-name">
                    <span className="player-avatar">{item.avatar || '👤'}</span> 
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7F8C8D' }}>{item.date ? new Date(item.date).toLocaleDateString('id-ID') : ''}</div>
                </div>
                  <div className="player-score">{item.score}</div>
                </li>
              );
            })
          )}
        </ul>
      )}

      {(!userAnswers || userAnswers.length === 0) && (
        <button className="btn-primary" onClick={onRestart} style={{ marginTop: '2rem' }}>
          Kembali ke Beranda
        </button>
      )}

      {showReview && (
        <div className="modal-overlay fade-in" onClick={() => setShowReview(false)}>
          <div className="modal-content review-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Pembahasan Kuis</h2>
              <button className="close-btn" onClick={() => setShowReview(false)}>✕</button>
            </div>
            <div className="modal-body">
              {userAnswers.map((item, index) => (
                <div key={index} className="review-card">
                  <div className="review-question">
                    <span className="q-number">{index + 1}</span>
                    <p>{item.question.text}</p>
                  </div>
                  
                  <div className="review-answer-box">
                    <div className={`answer-pill ${item.isCorrect ? 'pill-correct' : 'pill-wrong'}`}>
                      <strong>Jawaban Anda:</strong> {item.selectedOption}
                      <span className="icon">{item.isCorrect ? '✓' : '✕'}</span>
                    </div>
                    
                    {!item.isCorrect && (
                      <div className="answer-pill pill-correct-key" style={{ marginTop: '0.5rem' }}>
                        <strong>Kunci Jawaban:</strong> {item.question.answer}
                      </div>
                    )}
                  </div>
                  
                  {item.question.pembahasan && (
                    <div className="explanation-box">
                      <strong>💡 Penjelasan:</strong>
                      <p>{item.question.pembahasan}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

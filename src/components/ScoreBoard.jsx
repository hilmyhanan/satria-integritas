import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../firebase';

const ScoreBoard = ({ currentScore, isCorrect, lastPointsEarned, userName, userCategory, userAvatar, onNext }) => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jeda dinaikkan jadi 5 detik agar punya waktu membaca klasemen
    const timer = setTimeout(() => {
      onNext();
    }, 5000); 
    
    return () => clearTimeout(timer);
  }, [onNext]);

  useEffect(() => {
    const fetchAndCalculateRank = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(userCategory);
        
        // Membuat virtual leaderboard dengan menyisipkan skor pemain saat ini
        // Karena skor pemain belum di-save ke DB sampai akhir game
        const virtualList = [...data, { name: userName, avatar: userAvatar, score: currentScore, isMe: true }];
        
        // Urutkan ulang berdasarkan skor tertinggi
        virtualList.sort((a, b) => b.score - a.score);
        
        // Cari posisi pemain
        const rankIndex = virtualList.findIndex(item => item.isMe);
        setUserRank(rankIndex + 1);
        
        // Ambil Top 5 saja untuk ditampilkan
        setTopPlayers(virtualList.slice(0, 5));
      } catch (error) {
        console.error("Error fetching live leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndCalculateRank();
  }, [userCategory, currentScore, userName, userAvatar]);

  return (
    <div className="score-board fade-in">
      <div className="score-header">
        <h2>
          {isCorrect ? 'Jawaban Benar! ' : 'Jawaban Salah! '}
          <span className={`emoji-animate ${isCorrect ? 'emoji-tada' : 'emoji-sad'}`}>
            {isCorrect ? '🎉' : '😞'}
          </span>
        </h2>
        {isCorrect && <h3 style={{ color: 'var(--success)', marginTop: '-5px', marginBottom: '10px' }}>+{lastPointsEarned} Poin!</h3>}
        <div className="current-score-pill">Skor Anda: {currentScore}</div>
      </div>

      <div className="live-leaderboard-container">
        <h3 className="live-title">Klasemen Sementara</h3>
        {loading ? (
          <p className="loading-text" style={{ margin: '1rem' }}>Memuat...</p>
        ) : (
          <ul className="mini-leaderboard">
            {topPlayers.map((p, idx) => (
              <li key={idx} className={`mini-item ${p.isMe ? 'is-me' : ''}`}>
                <div className="mini-rank-badge">{idx + 1}</div>
                <div className="mini-info">
                  <span className="mini-avatar">{p.avatar || '👤'}</span>
                  <span className="mini-name">{p.name}</span>
                </div>
                <div className="mini-score">{p.score}</div>
              </li>
            ))}
          </ul>
        )}
        
        {userRank && userRank > 5 && (
           <div className="mini-rank-bottom">
             Posisi Anda saat ini: <strong>#{userRank}</strong>
           </div>
        )}
      </div>

      <button className="btn-skip" onClick={onNext}>Ketuk Untuk Melanjutkan ⏩</button>
      <p className="subtitle" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Pertanyaan selanjutnya akan segera dimulai...</p>
    </div>
  );
};

export default ScoreBoard;

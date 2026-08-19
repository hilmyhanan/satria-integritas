import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../firebase';

const Leaderboard = ({ userScore, userName, userCategory, onRestart }) => {
  const [activeTab, setActiveTab] = useState(userCategory);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

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

      <div className="leaderboard-tabs" style={{ marginTop: '2rem' }}>
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

      <button className="btn-primary" onClick={onRestart} style={{ marginTop: '2rem' }}>
        Kembali ke Beranda
      </button>
    </div>
  );
};

export default Leaderboard;

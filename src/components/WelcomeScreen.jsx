import React, { useState } from 'react';
import { checkNameExists } from '../firebase';

const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🦁', '🐧'];

const WelcomeScreen = ({ onStart, onViewLeaderboard }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (name.trim() && category && avatar) {
      setIsChecking(true);
      const exists = await checkNameExists(name.trim());
      setIsChecking(false);
      
      if (exists) {
        setErrorMsg('Nama ini sudah digunakan pemain lain. Silakan pilih nama yang unik!');
        return;
      }
      
      onStart(name.trim(), category, avatar);
    }
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    // Haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  return (
    <div className="fade-in">
      {/* Top Navigation for Leaderboard (Responsive, no overlap) */}
      <div className="top-nav">
        <button 
          type="button" 
          className="btn-leaderboard" 
          onClick={onViewLeaderboard}
          title="Lihat Papan Peringkat Global"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM7 10.82C5.84 10.4 5 9.3 5 8V7h2v3.82zM19 8c0 1.3-.84 2.4-2 2.82V7h2v1z" fill="currentColor"/>
          </svg>
          <span>Leaderboard</span>
        </button>
      </div>

      <div className="logo-container">
        <img 
          src="https://inspektorat.jatengprov.go.id/assets/header/logo-(3).png" 
          alt="Inspektorat Jateng Logo" 
          className="main-logo"
        />
      </div>
      
      <h1>Satria Integritas</h1>
      <p className="subtitle">Kuis Edukasi Integritas - Inspektorat Provinsi Jawa Tengah</p>
      <form className="welcome-form" onSubmit={handleSubmit}>
        {errorMsg && (
          <div className="error-message" style={{ color: 'var(--danger)', fontWeight: 'bold', marginBottom: '1rem', background: '#FEE2E2', padding: '0.8rem', borderRadius: '10px' }}>
            {errorMsg}
          </div>
        )}
        <div className="input-group">
          <label className="category-label">Pilih Karaktermu</label>
          <div className="avatar-selection">
            {AVATARS.map((a) => (
              <div 
                key={a}
                className={`avatar-option ${avatar === a ? 'active' : ''}`}
                onClick={() => {
                  setAvatar(a);
                  if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(20);
                }}
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Masukkan nama Anda..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>
        
        <div className="input-group">
          <label className="category-label">Pilih Tipe Peserta</label>
          <div className="category-grid">
            {/* Card 1: Pelajar */}
            <div 
              className={`category-card ${category === 'Mahasiswa / Pelajar' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('Mahasiswa / Pelajar')}
            >
              <div className="category-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
                </svg>
              </div>
              <div className="category-info">
                <div className="category-title">Mahasiswa / Pelajar</div>
                <div className="category-desc">SD, SMP, SMA, Perguruan Tinggi</div>
              </div>
            </div>

            {/* Card 2: Umum */}
            <div 
              className={`category-card ${category === 'Umum' ? 'active' : ''}`}
              onClick={() => handleCategorySelect('Umum')}
            >
              <div className="category-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
                </svg>
              </div>
              <div className="category-info">
                <div className="category-title">Umum</div>
                <div className="category-desc">Masyarakat, Pegawai, Warga</div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={!name.trim() || !category || !avatar || isChecking}
        >
          {isChecking ? 'Memeriksa Nama...' : 'Mulai Kuis 🚀'}
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;

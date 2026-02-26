import React, { useState } from 'react';
import api from './api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsScanning(true); // Trigger the pulse effect
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('chronos_token', res.data.token);
      localStorage.setItem('clearance', res.data.clearance);
      onLogin();
    } catch (err) { 
      setIsScanning(false);
      alert("ACCESS DENIED: IDENTITY UNVERIFIED"); 
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <div className="hud-frame" style={{ width: '400px', textAlign: 'center' }}>
        
        {/* Fingerprint Scanner SVG */}
        <div className={`fingerprint-scanner ${isScanning ? 'pulse-green' : ''}`} style={{ marginBottom: '20px' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12C2 12 5 7 12 7C19 7 22 12 22 12C22 12 19 17 12 17C5 17 2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
          </svg>
        </div>

        <h3 className="blink-text">IDENTITY VERIFICATION</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', textAlign: 'left' }}>
          <label style={{ fontSize: '0.7rem' }}>AGENT EMAIL</label>
          <input className="terminal-input" type="email" placeholder="USER@CHRONOS" onChange={e => setEmail(e.target.value)} />
          <label style={{ fontSize: '0.7rem' }}>SECURITY KEY</label>
          <input className="terminal-input" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="terminal-button" style={{ width: '100%', marginTop: '20px' }}>INITIATE UPLINK</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
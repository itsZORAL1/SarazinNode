import React, { useState } from 'react';
import api from './api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(''); // Clear previous errors
  try {
    const response = await api.post('/login', { 
      email: email.trim(), 
      password: password 
    });
    
    // Success logic
    localStorage.setItem('chronos_token', response.data.token);
    localStorage.setItem('clearance', response.data.clearance);
    onLogin(); 
  } catch (err) {
    // Log the actual error to the browser console to see if it's 401, 404, or 500
    console.error("Auth Error Details:", err.response?.data || err.message);
    setError("ACCESS DENIED: IDENTITY UNVERIFIED");
  }
};

  return (
    <div className="login-screen terminal-border" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>CRITICAL: IDENTITY VERIFICATION</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>AGENT EMAIL:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="terminal-input"
            required 
          />
        </div>
        <div className="input-group">
          <label>SECURITY KEY:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="terminal-input"
            required 
          />
        </div>
        <button type="submit" className="terminal-button">INITIALIZE LINK</button>
      </form>
      {error && <p className="blink-text" style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import api from './api';

const Archive = () => {
  const [era, setEra] = useState('');
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrambledText, setScrambledText] = useState('');

  // Scrambler Logic
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        const chars = '0123456789ABCDEF!@#$%^&*';
        let str = '';
        for (let i = 0; i < 20; i++) {
          str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setScrambledText(str);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [loading]);

const handleScan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setArtifacts([]); 
    try {
      // The 'era' state variable now acts as a general search term
      const response = await api.get(`/artifacts/search?era=${era}`);
      setTimeout(() => {
        setArtifacts(response.data);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

return (
    <div className="archive-view">
      <h2 className="glow-text">> ARTIFACT REGISTRY</h2>
      <div className="hud-frame">
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '10px' }}>
          <input 
            className="terminal-input" 
            type="text" 
            placeholder="SEARCH BY NAME OR ERA (e.g. London)" // Updated placeholder
            value={era}
            onChange={e => setEra(e.target.value)} 
          />
          <button type="submit" className="terminal-button">SCAN</button>
        </form>
      </div>

      {loading && (
        <div className="hud-bracket" style={{ textAlign: 'center' }}>
          <h3 className="blink-text">DECRYPTING_STREAM...</h3>
          <div style={{ color: 'var(--terminal-green)', fontSize: '1.2rem' }}>{scrambledText}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {artifacts.map(item => (
          <div key={item.id} className="hud-bracket">
            <small>ID: {item.serialNumber}</small>
            <h3 style={{color: 'var(--terminal-green)'}}>{item.name}</h3>
            <p>ERA: {item.originEra}</p>
            
            {/* NEW: ENHANCED INFO DISPLAY */}
            <div style={{ fontSize: '0.65rem', borderTop: '1px solid var(--terminal-dim)', paddingTop: '5px', marginTop: '10px', color: '#aaa' }}>
              <div>LOCATION: VAULT_ID_{item.vaultId}</div>
              <div>DANGER_LEVEL: {item.dangerLevel} / 5</div>
              <div style={{ color: 'var(--terminal-green)', marginTop: '5px' }}>STATUS: SECURED_IN_VAULT</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
import React, { useState, useEffect } from 'react';
import api from './api';

const Vaults = () => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null); 

  const fetchVaults = async () => {
    try {
      const res = await api.get('/vaults');
      setVaults(res.data);
    } catch (err) { console.error("Access denied"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVaults(); }, []);

const handleSweep = async (vaultId) => {
  try {
    const res = await api.post(`/containment/vaults/${vaultId}/sweep`);
    if (res.data.status === 'CRITICAL') {
      setPopup({ type: 'error', msg: `BREACH DETECTED: ${res.data.report.title}` });
    } else {
      setPopup({ type: 'success', msg: 'SWEEP COMPLETE: NO LEAKS FOUND' });
    }
    
    
    setTimeout(() => {
      setPopup(null);
    }, 3000);
    
  } catch (err) {
    setPopup({ type: 'error', msg: 'SCAN_FAILURE' });
    setTimeout(() => setPopup(null), 3000);
  }
};
return (
    <div className="vault-interface">
      {popup && (
        <div className="tactical-overlay">
          <div className={`popup-content hud-bracket ${popup.type}`}>
            <h2 style={{ color: popup.type === 'error' ? 'red' : 'var(--terminal-green)' }}>
              {popup.type === 'error' ? '!! WARNING !!' : '>> SYSTEM SECURE'}
            </h2>
            <p>{popup.msg}</p>
          </div>
        </div>
      )}

      <h2 className="glow-text"> {`> `} BIO CONTAINMENT GRID</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {vaults.map(v => {
          const artifactCount = v.artifacts ? v.artifacts.length : 0;
          const maxCap = v.maxCapacity || 100;
          const integrity = v.integrity || 100;

          return (
            <div className="hud-frame vault-node" key={v.id}>
              <div className="node-id">UNIT: {v.locationName || `ID_${v.id}`}</div>
              
              <div style={{ margin: '10px 0', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
                <span style={{ fontSize: '0.6rem', color: 'gray' }}>>> CONTENTS:</span>
                {artifactCount > 0 ? (
                  v.artifacts.map(art => (
                    <div key={art.id} style={{ color: 'var(--terminal-green)', fontSize: '0.75rem' }}>
                      • {art.name}
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'red', fontSize: '0.75rem', opacity: 0.5 }}>EMPTY</div>
                )}
              </div>

              <div className="integrity-bar">
                 <div className="fill" style={{ width: `${integrity}%` }}></div>
              </div>

              <div style={{ fontSize: '0.7rem', marginBottom: '10px' }}>
                LOAD: {artifactCount} / {maxCap} // PROT: {v.securityProtocol || 'STANDARD'}
              </div>
              
              <button className="terminal-button" onClick={() => handleSweep(v.id)}>INITIATE SWEEP</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Vaults;
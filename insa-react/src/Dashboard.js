import React, { useEffect, useState } from 'react';
import api from './api';

const Dashboard = () => {
  const [data, setData] = useState({ 
    metrics: { totalArtifacts: 0, unresolvedAnomalies: 0 },
    agencyStatus: "STABLE" 
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/intelligence/overview');
        setData(res.data);
      } catch (err) { console.error("INTEL_LINK_ERROR", err); }
    };
    fetchStats();
  }, []);

  
  const healthPercent = Math.max(100 - (data.metrics.unresolvedAnomalies * 10), 10);
  const healthColor = healthPercent > 70 ? 'var(--terminal-green)' : healthPercent > 40 ? 'orange' : 'red';

  return (
    <div className="dashboard-interface">
      <header>
        <h2 className="glow-text">> CHRONOS INTEL FEED</h2>
        <div className="status-bar">UPLINK STABLE // NODE: {data.agencyStatus}</div>
      </header>

      {}
      <div className="hud-bracket" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>TIMELINE STABILITY INDEX</label>
          <span style={{ color: healthColor }}>{healthPercent}%</span>
        </div>
        <div className="integrity-bar" style={{ height: '20px', background: 'rgba(255,255,255,0.05)', marginTop: '10px' }}>
          <div className="fill" style={{ 
            width: `${healthPercent}%`, 
            background: healthColor,
            boxShadow: `0 0 15px ${healthColor}`,
            transition: 'width 2s ease-in-out'
          }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        <div className="hud-bracket" style={{ flex: 1 }}>
          <label>SECURED ASSETS</label>
          <div style={{ fontSize: '3.5rem' }}>{data.metrics.totalArtifacts}</div>
        </div>
        <div className="hud-bracket" style={{ flex: 1, color: healthPercent < 50 ? 'red' : 'white' }}>
          <label>ACTIVE THREATS</label>
          <div style={{ fontSize: '3.5rem' }}>{data.metrics.unresolvedAnomalies}</div>
        </div>
      </div>

      <div className="hud-bracket" style={{ marginTop: '30px' }}>
        <h4 style={{ borderBottom: '1px solid var(--terminal-dim)' }}>LIVE SYSTEM LOGS</h4>
        <div style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.5' }}>
          {`[${new Date().toLocaleTimeString()}] > STABILITY CHECK: ${healthPercent}%`}<br/>
          {`[${new Date().toLocaleTimeString()}] > SCANNING SECTOR 7G... NOMINAL`}<br/>
          {`[${new Date().toLocaleTimeString()}] > NEURAL SYNC COMPLETE: AGENT CONNECTED`}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
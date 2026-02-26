import React, { useEffect, useState } from 'react';
import api from './api';

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/intelligence/overview');
        setData(response.data);
      } catch (err) {
        console.error("Dashboard offline", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">CONNECTING TO CHRONOS...</div>;

  return (
    <div className="dashboard-container">
      <header className="terminal-border" style={{ borderColor: data.agencyStatus === 'CRITICAL' ? 'red' : 'var(--primary-glow)' }}>
        <h1>AGENCY STATUS: {data.agencyStatus}</h1>
        {data.securityNotice && <p className="blink-text">⚠️ {data.securityNotice}</p>}
      </header>

      <div className="metrics-grid" style={{ display: 'flex', gap: '20px' }}>
        <div className="terminal-border" style={{ flex: 1 }}>
          <h3>ARTIFACTS</h3>
          <p style={{ fontSize: '2rem' }}>{data.metrics.totalArtifacts}</p>
        </div>
        <div className="terminal-border" style={{ flex: 1 }}>
          <h3>ANOMALIES</h3>
          <p style={{ fontSize: '2rem' }}>{data.metrics.unresolvedAnomalies}</p>
        </div>
      </div>

      <div className="vaults-section">
        <h3>VAULT INTEGRITY</h3>
        {data.vaults.map(v => (
          <div key={v.name} className="vault-bar">
            <span>{v.name}</span>
            <div className="progress-bg">
                <div className="progress-fill" style={{ width: v.capacity.split('/')[0] * 2 + '%' }}></div>
            </div>
            <span>{v.capacity} units</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
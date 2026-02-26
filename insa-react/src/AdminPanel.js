import React, { useState, useEffect } from 'react';
import api from './api';

const AdminPanel = () => {
  const [newAgent, setNewAgent] = useState({
    firstname: '', lastname: '', email: '', password: '', clearanceLevel: 1
  });
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState(null);

  // Fetch Mission Logs on mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/mission-logs');
        setLogs(res.data);
      } catch (err) {
        console.error("LOG_FETCH_ERROR", err);
      }
    };
    fetchLogs();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/register', newAgent);
      setMsg({ type: 'success', text: 'AGENT ENLISTED SUCCESSFULLY' });
      setNewAgent({ firstname: '', lastname: '', email: '', password: '', clearanceLevel: 1 });
    } catch (err) {
      setMsg({ type: 'error', text: 'REGISTRATION FAILED' });
    }
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <div className="admin-view" style={{ padding: '20px' }}>
      <div className="admin-panel hud-frame">
        <h2 className="glow-text">> PERSONNEL MANAGEMENT</h2>
        {msg && <p style={{ color: msg.type === 'error' ? 'red' : 'lime' }}>{msg.text}</p>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input className="terminal-input" placeholder="FIRST NAME" value={newAgent.firstname} onChange={e => setNewAgent({...newAgent, firstname: e.target.value})} />
          <input className="terminal-input" placeholder="LAST NAME" value={newAgent.lastname} onChange={e => setNewAgent({...newAgent, lastname: e.target.value})} />
          <input className="terminal-input" placeholder="EMAIL" value={newAgent.email} onChange={e => setNewAgent({...newAgent, email: e.target.value})} />
          <input className="terminal-input" type="password" placeholder="SECURITY KEY" value={newAgent.password} onChange={e => setNewAgent({...newAgent, password: e.target.value})} />
          <label style={{ fontSize: '0.8rem' }}>CLEARANCE_LEVEL (1-5)</label>
          <input className="terminal-input" type="number" min="1" max="5" value={newAgent.clearanceLevel} onChange={e => setNewAgent({...newAgent, clearanceLevel: parseInt(e.target.value)})} />
          <button type="submit" className="terminal-button">CREATE AGENT</button>
        </form>
      </div>

      {/* MISSION LOGS SECTION */}
      <div className="hud-frame" style={{ marginTop: '30px' }}>
        <h3>>> AUDIT_LOG: MISSION_FINALIZATION</h3>
        <div className="log-table" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {logs.length === 0 ? <p>NO RECENT ACTIONS RECORDED</p> : logs.map(log => (
            <div key={log.id} style={{ borderBottom: '1px solid #222', padding: '10px 0', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--terminal-green)' }}>[{new Date(log.createdAt).toLocaleTimeString()}]</span>
              <span style={{ color: '#aaa' }}> AGENT: </span> {log.author?.firstname || 'SYSTEM'} 
              <span style={{ color: '#aaa' }}> ACTION: </span> <span style={{ color: 'yellow' }}>{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
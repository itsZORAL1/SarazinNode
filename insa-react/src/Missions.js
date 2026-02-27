import React, { useState, useEffect } from 'react';
import api from './api';

const Missions = () => {
  const [anomalyData, setAnomalyData] = useState({ 
    description: '', location: '', severity: 1, timelineId: 1, isArtifactMission: false 
  });
  const [activeMissions, setActiveMissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [recoveryForm, setRecoveryForm] = useState(null); 
  const [artifactDetails, setArtifactDetails] = useState({ name: '', serial: '', vaultId: 1 });

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/missions');
      setActiveMissions(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMissions(); }, []);

  const closePopup = () => {
    setPopup(null);
    setRecoveryForm(null);
  };

  const handleFinalizeClick = (mission) => {
    if (mission.anomaly?.status === 'RECOVERY_REQUIRED') {
      setRecoveryForm(mission.id); 
    } else {
      resolveAnomaly(mission.id); 
    }
  };

  const resolveAnomaly = async (missionId, manualArtifact = null) => {
    setLoading(true);
    try {
      await api.put(`/missions/${missionId}/finalize`, { artifact: manualArtifact });
      setPopup({ type: 'success', msg: 'MISSION COMPLETE: Timeline Stabilized.' });
      setRecoveryForm(null); 
      fetchMissions(); 
    } catch (err) {
      setPopup({ type: 'error', msg: 'REPAIR_FAILED: Internal Temporal Error' });
    } finally {
      setLoading(false);
      setTimeout(() => setPopup(null), 3000);
    }
  };

  const reportAnomaly = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/missions/report', anomalyData); 
      setPopup({ type: 'success', msg: 'ANOMALY LOGGED: MISSION GENERATED' });
      setAnomalyData({ description: '', location: '', severity: 1, timelineId: 1, isArtifactMission: false });
      setTimeout(() => {
        fetchMissions();
        setPopup(null);
      }, 2000); 
    } catch (err) { 
      setPopup({ type: 'error', msg: 'UPLINK_ERROR: Check clearance' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="missions-view">
      {}
      {popup && (
        <div className="tactical-overlay">
          <div className={`popup-content hud-bracket ${popup.type}`}>
            <button className="close-btn" onClick={closePopup} style={{position:'absolute', right:'10px', top:'10px', background:'none', border:'none', color:'white', cursor:'pointer'}}>X</button>
            <h2 style={{ color: popup.type === 'error' ? 'red' : 'var(--terminal-green)' }}>
              {popup.type === 'error' ? '!! SECURITY ALERT !!' : '>> SYSTEM UPDATE'}
            </h2>
            <p>{popup.msg}</p>
          </div>
        </div>
      )}

      {}
      {recoveryForm && (
        <div className="tactical-overlay">
          <div className="popup-content hud-bracket">
            <h3>>> ARTIFACT RECOVERY PROTOCOL</h3>
            <form onSubmit={(e) => { e.preventDefault(); resolveAnomaly(recoveryForm, artifactDetails); }}>
              <input className="terminal-input" placeholder="ARTIFACT NAME" 
                onChange={e => setArtifactDetails({...artifactDetails, name: e.target.value})} required />
              <input className="terminal-input" placeholder="SERIAL NUMBER" 
                onChange={e => setArtifactDetails({...artifactDetails, serial: e.target.value})} required />
              <input className="terminal-input" type="number" placeholder="VAULT ID"
                onChange={e => setArtifactDetails({...artifactDetails, vaultId: e.target.value})} />
              <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                <button type="submit" className="terminal-button" disabled={loading}>{loading ? 'SYNCING...' : 'COMMIT TO ARCHIVE'}</button>
                <button type="button" className="terminal-button" onClick={closePopup} style={{borderColor:'red', color:'red'}}>ABORT</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="glow-text">> TEMPORAL COMMAND CENTER</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
        
        {}
        <div className="hud-frame" style={{display:'flex', flexDirection:'column'}}>
          <h3>REPORT DISRUPTION</h3>
          <form onSubmit={reportAnomaly} style={{display:'flex', flexDirection:'column', flexGrow: 1}}>
            <label style={{ fontSize: '0.7rem' }}>COORDINATES</label>
            <input className="terminal-input" placeholder="ERA OR LOCATION" value={anomalyData.location}
              onChange={e => setAnomalyData({...anomalyData, location: e.target.value})} />
            
            <label style={{ fontSize: '0.7rem', marginTop: '10px' }}>SIGNATURE</label>
            <textarea className="terminal-input" style={{ height: '100px', resize: 'none' }} placeholder="DESCRIBE TEAR" 
              value={anomalyData.description} onChange={e => setAnomalyData({...anomalyData, description: e.target.value})} />
            
            {}
            <div style={{ border: '1px solid var(--terminal-dim)', padding: '10px', marginTop: 'auto', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input 
                    type="checkbox" 
                    id="artifactCheck" 
                    style={{cursor:'pointer'}}
                    checked={anomalyData.isArtifactMission}
                    onChange={e => setAnomalyData({...anomalyData, isArtifactMission: e.target.checked})} 
                />
                <label htmlFor="artifactCheck" style={{ fontSize: '0.75rem', color: '#00ff41', cursor:'pointer', textTransform:'uppercase',background: 'none' }}>
                    Artifact Recovery Required?
                </label>
                </div>
                <button type="submit" className="terminal-button" style={{width: '100%'}}>
                    {loading ? 'INITIATING...' : 'INITIATE PROTOCOL'}
                </button>
            </div>
          </form>
        </div>

        {}
        <div className="hud-frame">
          <h3>ACTIVE OPERATIONS</h3>
          <div style={{ height: '400px', overflowY: 'auto' }}>
            {activeMissions.map(m => (
              <div key={m.id} style={{ marginBottom: '15px', borderBottom: '1px solid var(--terminal-dim)', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: m.status === 'COMPLETED' ? 'gray' : (m.anomaly?.status === 'RECOVERY_REQUIRED' ? '#ff9900' : 'yellow') }}>
                    [{m.status}]{m.anomaly?.status === 'RECOVERY_REQUIRED' ? ' - RECOVERY' : ''}
                  </span>
                  {m.status !== 'COMPLETED' && (
                    <button onClick={() => handleFinalizeClick(m)} className="finalize-btn-small"
                      style={{ background: 'none', border: '1px solid red', color: 'red', fontSize: '0.6rem', cursor: 'pointer', padding:'2px 5px' }}>
                      FINALIZE
                    </button>
                  )}
                </div>
                <div style={{color: 'var(--terminal-green)', marginTop: '5px'}}>ERA: {m.anomaly?.location || 'Unknown'}</div>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '5px 0' }}>{m.anomaly?.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Missions;
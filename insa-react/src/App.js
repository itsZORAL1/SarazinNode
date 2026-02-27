// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Archive from './Archive';
import Missions from './Missions';
import Vaults from './Vaults';
import AdminPanel from './AdminPanel'; 
import './App.css';

function App() {
    const [auth, setAuth] = useState(!!localStorage.getItem('chronos_token'));
    
    const clearance = parseInt(localStorage.getItem('clearance')) || 1;

    const logout = () => {
        localStorage.removeItem('chronos_token');
        localStorage.removeItem('clearance');
        setAuth(false);
    };

    return (
        <Router>
            <div className="agency-shell">
                {auth && (
                    <nav className="side-hud">
                        <div className="clearance-badge">
                            <span className="blink-text">●</span> CLEARANCE LEVEL {clearance}
                        </div>
                        <Link to="/dashboard" className="hud-link">SYSTEM OVERVIEW</Link>
                        <Link to="/archive" className="hud-link">ARTIFACT ARCHIVE</Link>
                        <Link to="/missions" className="hud-link">TEMPORAL MISSIONS</Link>
                        <Link to="/vaults" className="hud-link">CONTAINMENT VAULTS</Link>

                        {}
                        {clearance === 5 && (
                            <Link to="/admin" className="hud-link admin-link">>> ADMIN_PANEL</Link>
                        )}

                        <button onClick={logout} className="hud-link terminate">TERMINATE SESSION</button>
                    </nav>
                )}

                <main className="content-viewport">
                    <Routes>
                        <Route path="/login" element={!auth ? <Login onLogin={() => setAuth(true)} /> : <Navigate to="/dashboard" />} />
                        
                        {}
                        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/archive" element={auth ? <Archive /> : <Navigate to="/login" />} />
                        <Route path="/missions" element={auth ? <Missions /> : <Navigate to="/login" />} />
                        <Route path="/vaults" element={auth ? <Vaults /> : <Navigate to="/login" />} />
                        
                        {}
                        {auth && clearance === 5 && (
                            <Route path="/admin" element={<AdminPanel />} />
                        )}

                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
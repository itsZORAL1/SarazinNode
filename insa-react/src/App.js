import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import './App.css'; // We will add terminal styles here next

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('chronos_token'));

  const logout = () => {
    localStorage.removeItem('chronos_token');
    localStorage.removeItem('clearance');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="agency-shell">
        {isAuthenticated && (
          <nav className="side-nav terminal-border">
            <div className="agency-logo">CHRONOS_OS</div>
            <Link to="/dashboard" className="nav-link">SYSTEM_OVERVIEW</Link>
            <Link to="/archive" className="nav-link">ARTIFACT_ARCHIVE</Link>
            <Link to="/missions" className="nav-link">TEMPORAL_MISSIONS</Link>
            <button onClick={logout} className="nav-link logout-btn">TERMINATE_SESSION</button>
          </nav>
        )}

        <main className="content-area">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            {/* We will build Archive and Missions next */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
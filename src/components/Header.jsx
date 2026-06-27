import React from 'react';
import '../styles/Header.css';

const Header = ({ onNewMatch }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <span className="cricket-icon"></span>
            <h1>CricScore</h1>
          </div>
          <span className="tagline">Live Cricket Scoring</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={onNewMatch}>
            <span className="icon"></span>
            New Match
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

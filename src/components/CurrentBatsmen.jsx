import React from 'react';
import '../styles/CurrentBatsmen.css';

const CurrentBatsmen = ({ batsman1, batsman2, striker }) => {
  if (!batsman1 || !batsman2) return null;

  return (
    <div className="current-batsmen">
      <h3>Current Batsmen</h3>
      <div className="batsmen-container">
        <div className={`batsman-card ${striker === 1 ? 'striker' : 'non-striker'}`}>
          {striker === 1 && <span className="striker-badge">★ Striker</span>}
          <h4>{batsman1.name}</h4>
          <div className="batsman-stats">
            <div className="stat">
              <span className="stat-label">Runs:</span>
              <span className="stat-value">{batsman1.runs}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Balls:</span>
              <span className="stat-value">{batsman1.balls}</span>
            </div>
            <div className="stat">
              <span className="stat-label">SR:</span>
              <span className="stat-value">{batsman1.strikeRate}</span>
            </div>
          </div>
          <div className="boundaries">
            <span>4s: {batsman1.fours}</span>
            <span>6s: {batsman1.sixes}</span>
          </div>
        </div>

        <div className={`batsman-card ${striker === 2 ? 'striker' : 'non-striker'}`}>
          {striker === 2 && <span className="striker-badge">★ Striker</span>}
          <h4>{batsman2.name}</h4>
          <div className="batsman-stats">
            <div className="stat">
              <span className="stat-label">Runs:</span>
              <span className="stat-value">{batsman2.runs}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Balls:</span>
              <span className="stat-value">{batsman2.balls}</span>
            </div>
            <div className="stat">
              <span className="stat-label">SR:</span>
              <span className="stat-value">{batsman2.strikeRate}</span>
            </div>
          </div>
          <div className="boundaries">
            <span>4s: {batsman2.fours}</span>
            <span>6s: {batsman2.sixes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentBatsmen;
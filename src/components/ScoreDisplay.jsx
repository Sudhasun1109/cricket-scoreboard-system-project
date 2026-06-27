import React from 'react';
import '../styles/ScoreDisplay.css';

const ScoreDisplay = ({ innings, currentInnings, target }) => {
  const currentInningsData = innings[currentInnings];
  const runRate = currentInningsData.overs > 0 
    ? (currentInningsData.totalScore / (currentInningsData.overs + currentInningsData.balls / 6)).toFixed(2)
    : 0;

  return (
    <div className="score-display">
      <div className="innings-badge">Innings {currentInnings}</div>
      <div className="main-score">
        <h1>{currentInningsData.totalScore}/{currentInningsData.wickets}</h1>
      </div>
      <div className="score-details">
        <div className="detail-item">
          <span className="label">Overs:</span>
          <span className="value">{currentInningsData.overs}.{currentInningsData.balls}</span>
        </div>
        <div className="detail-item">
          <span className="label">Run Rate:</span>
          <span className="value">{runRate}</span>
        </div>
        {target && currentInnings === 2 && (
          <div className="detail-item target">
            <span className="label">Target:</span>
            <span className="value">{target}</span>
          </div>
        )}
        {target && currentInnings === 2 && (
          <div className="detail-item">
            <span className="label">Required:</span>
            <span className="value">{target - currentInningsData.totalScore}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
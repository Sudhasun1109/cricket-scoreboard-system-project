import React from 'react';
import '../styles/InningsSelector.css';

const InningsSelector = ({ currentInnings, onEndInnings, innings }) => {
  const currentInningsData = innings[currentInnings];
  const canEndInnings = currentInningsData.wickets === 10 || currentInningsData.players.length >= 2;

  if (currentInnings === 2) return null;

  return (
    <div className="innings-selector">
      <div className="innings-info-box">
        <p>🏏 {currentInningsData.teamName} - {currentInningsData.totalScore}/{currentInningsData.wickets}</p>
        <p>Complete this innings to start {innings[2].teamName}'s chase</p>
      </div>
      <button 
        onClick={onEndInnings} 
        className="end-innings-btn"
        disabled={!canEndInnings}
      >
        End {currentInningsData.teamName} Innings
      </button>
    </div>
  );
};

export default InningsSelector;
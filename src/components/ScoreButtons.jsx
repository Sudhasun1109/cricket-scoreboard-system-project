import React, { useState } from 'react';
import '../styles/ScoreButtons.css';

const ScoreButtons = ({ onAddRuns, onWicket, onRotateStrike, onUndo, onAddExtra, canUndo }) => {
  const [showExtras, setShowExtras] = useState(false);

  const handleExtra = (type) => {
    let runs = 1; // Default for wide, noball
    
    if (type === 'bye' || type === 'legbye') {
      const input = prompt(`How many ${type}s?`, '1');
      runs = parseInt(input) || 1;
    }
    
    onAddExtra({ type, runs });
    setShowExtras(false);
  };

  return (
    <div className="score-buttons-container">
      <h3>Score Controls</h3>
      
      <div className="runs-buttons">
        <button onClick={() => onAddRuns(0)} className="run-btn dot-ball">
          0
        </button>
        <button onClick={() => onAddRuns(1)} className="run-btn">
          1
        </button>
        <button onClick={() => onAddRuns(2)} className="run-btn">
          2
        </button>
        <button onClick={() => onAddRuns(3)} className="run-btn">
          3
        </button>
        <button onClick={() => onAddRuns(4)} className="run-btn four">
          4
        </button>
        <button onClick={() => onAddRuns(6)} className="run-btn six">
          6
        </button>
      </div>

      <div className="action-buttons">
        <button onClick={onWicket} className="wicket-btn">
          🏏 Wicket
        </button>
        <button onClick={onRotateStrike} className="rotate-btn">
          🔄 Rotate
        </button>
        <button onClick={() => setShowExtras(!showExtras)} className="extras-btn">
          + Extras
        </button>
        <button 
          onClick={onUndo} 
          className="undo-btn" 
          disabled={!canUndo}
        >
          ↶ Undo
        </button>
      </div>

      {/* Extras Panel */}
      {showExtras && (
        <div className="extras-panel">
          <h4>Select Extra Type</h4>
          <div className="extras-buttons">
            <button onClick={() => handleExtra('wide')} className="extra-btn">
              Wide (1)
            </button>
            <button onClick={() => handleExtra('noball')} className="extra-btn">
              No Ball (1)
            </button>
            <button onClick={() => handleExtra('bye')} className="extra-btn">
              Bye
            </button>
            <button onClick={() => handleExtra('legbye')} className="extra-btn">
              Leg Bye
            </button>
          </div>
          <button onClick={() => setShowExtras(false)} className="close-extras">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ScoreButtons;
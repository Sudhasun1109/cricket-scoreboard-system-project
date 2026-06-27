import React, { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/ScoreControls.css';

const ScoreControls = () => {
  const { state, dispatch } = useMatch();
  const currentInning = state.innings[state.currentInnings];
  const [showExtras, setShowExtras] = useState(false);
  const [showWicket, setShowWicket] = useState(false);
  const [showBowlerChange, setShowBowlerChange] = useState(false);
  const [newBowlerId, setNewBowlerId] = useState('');
  const [outBatsmanId, setOutBatsmanId] = useState('');
  const [newBatsmanId, setNewBatsmanId] = useState('');

  const handleRuns = (runs, isBoundary = false) => {
    dispatch({
      type: 'ADD_RUNS',
      payload: { runs, isExtra: false, isBoundary }
    });
  };

  const handleExtra = (extraType, runs) => {
    dispatch({
      type: 'ADD_RUNS',
      payload: { runs, isExtra: true, extraType }
    });
    setShowExtras(false);
  };

  const handleWicket = () => {
    if (outBatsmanId && newBatsmanId) {
      dispatch({
        type: 'WICKET',
        payload: {
          outBatsmanId: Number(outBatsmanId),
          newBatsmanId: Number(newBatsmanId)
        }
      });
      setShowWicket(false);
      setOutBatsmanId('');
      setNewBatsmanId('');
    }
  };

  const handleBowlerChange = () => {
    if (newBowlerId) {
      dispatch({ type: 'CHANGE_BOWLER', payload: Number(newBowlerId) });
      setShowBowlerChange(false);
      setNewBowlerId('');
    }
  };

  const handleUndo = () => {
    if (window.confirm('Undo last ball?')) {
      dispatch({ type: 'UNDO_BALL' });
    }
  };

  const availableBatsmen = currentInning.players.filter(
    p => !p.isOut && 
    p.id !== currentInning.currentBatsmen.striker && 
    p.id !== currentInning.currentBatsmen.nonStriker
  );

  const availableBowlers = currentInning.bowlers.filter(
    b => b.id !== currentInning.currentBowler
  );

  return (
    <div className="score-controls">
      <div className="controls-header">
        <h3>Score Controls</h3>
        <button className="undo-btn" onClick={handleUndo} disabled={currentInning.ballByBall.length === 0}>
          ↶ Undo
        </button>
      </div>

      {/* Runs Buttons */}
      <div className="runs-grid">
        <button className="run-btn dot" onClick={() => handleRuns(0)}>0</button>
        <button className="run-btn" onClick={() => handleRuns(1)}>1</button>
        <button className="run-btn" onClick={() => handleRuns(2)}>2</button>
        <button className="run-btn" onClick={() => handleRuns(3)}>3</button>
        <button className="run-btn four" onClick={() => handleRuns(4, true)}>4</button>
        <button className="run-btn six" onClick={() => handleRuns(6, true)}>6</button>
      </div>

      {/* Action Buttons */}
      <div className="action-grid">
        <button className="action-btn wicket" onClick={() => setShowWicket(true)}>
          🏏 Wicket
        </button>
        <button className="action-btn extras" onClick={() => setShowExtras(true)}>
          + Extras
        </button>
        <button className="action-btn bowler-change" onClick={() => setShowBowlerChange(true)}>
          🔄 Change Bowler
        </button>
      </div>

      {/* Extras Modal */}
      {showExtras && (
        <div className="modal-overlay" onClick={() => setShowExtras(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>Select Extra Type</h4>
            <div className="extras-grid">
              <button onClick={() => handleExtra('wide', 1)} className="extra-btn">
                Wide (1)
              </button>
              <button onClick={() => handleExtra('noBall', 1)} className="extra-btn">
                No Ball (1)
              </button>
              <button onClick={() => handleExtra('bye', 1)} className="extra-btn">
                Bye (1)
              </button>
              <button onClick={() => handleExtra('legBye', 1)} className="extra-btn">
                Leg Bye (1)
              </button>
            </div>
            <button className="close-btn" onClick={() => setShowExtras(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Wicket Modal */}
      {showWicket && (
        <div className="modal-overlay" onClick={() => setShowWicket(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>Record Wicket</h4>
            <div className="wicket-form">
              <div className="form-group">
                <label>Out Batsman</label>
                <select value={outBatsmanId} onChange={(e) => setOutBatsmanId(e.target.value)}>
                  <option value="">Select batsman</option>
                  <option value={currentInning.currentBatsmen.striker}>
                    {currentInning.players.find(p => p.id === currentInning.currentBatsmen.striker)?.name} (Striker)
                  </option>
                  <option value={currentInning.currentBatsmen.nonStriker}>
                    {currentInning.players.find(p => p.id === currentInning.currentBatsmen.nonStriker)?.name}
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>New Batsman</label>
                <select value={newBatsmanId} onChange={(e) => setNewBatsmanId(e.target.value)}>
                  <option value="">Select batsman</option>
                  {availableBatsmen.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button 
                className="submit-btn" 
                onClick={handleWicket}
                disabled={!outBatsmanId || !newBatsmanId}
              >
                Record Wicket
              </button>
            </div>
            <button className="close-btn" onClick={() => setShowWicket(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Bowler Change Modal */}
      {showBowlerChange && (
        <div className="modal-overlay" onClick={() => setShowBowlerChange(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h4>Change Bowler</h4>
            <div className="bowler-form">
              <select value={newBowlerId} onChange={(e) => setNewBowlerId(e.target.value)}>
                <option value="">Select bowler</option>
                {availableBowlers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button 
                className="submit-btn" 
                onClick={handleBowlerChange}
                disabled={!newBowlerId}
              >
                Change Bowler
              </button>
            </div>
            <button className="close-btn" onClick={() => setShowBowlerChange(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreControls;
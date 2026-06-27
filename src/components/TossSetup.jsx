import React, { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/TossSetup.css';

const TossSetup = () => {
  const { state, dispatch } = useMatch();
  const { team1Name, team2Name } = state.matchSetup;
  const [tossWinner, setTossWinner] = useState('');
  const [tossDecision, setTossDecision] = useState('');

  const handleTossSubmit = () => {
    if (tossWinner && tossDecision) {
      dispatch({ 
        type: 'SET_TOSS', 
        payload: { winner: tossWinner, decision: tossDecision } 
      });
    }
  };

  return (
    <div className="toss-setup">
      <div className="toss-container">
        <div className="toss-header">
          <div className="coin-icon">🪙</div>
          <h2>Toss</h2>
          <p>Let's decide who bats first</p>
        </div>

        <div className="toss-form">
          <div className="form-group">
            <label>Who won the toss?</label>
            <div className="team-selector">
              <button
                className={`team-option ${tossWinner === team1Name ? 'selected' : ''}`}
                onClick={() => setTossWinner(team1Name)}
              >
                <span className="team-flag">🏏</span>
                <span>{team1Name}</span>
              </button>
              <button
                className={`team-option ${tossWinner === team2Name ? 'selected' : ''}`}
                onClick={() => setTossWinner(team2Name)}
              >
                <span className="team-flag">🏏</span>
                <span>{team2Name}</span>
              </button>
            </div>
          </div>

          {tossWinner && (
            <div className="form-group decision-group">
              <label>{tossWinner} elected to?</label>
              <div className="decision-selector">
                <button
                  className={`decision-option ${tossDecision === 'bat' ? 'selected' : ''}`}
                  onClick={() => setTossDecision('bat')}
                >
                  <span className="decision-icon">🏏</span>
                  <span>Bat First</span>
                </button>
                <button
                  className={`decision-option ${tossDecision === 'bowl' ? 'selected' : ''}`}
                  onClick={() => setTossDecision('bowl')}
                >
                  <span className="decision-icon">⚡</span>
                  <span>Bowl First</span>
                </button>
              </div>
            </div>
          )}

          <button
            className="proceed-btn"
            onClick={handleTossSubmit}
            disabled={!tossWinner || !tossDecision}
          >
            Proceed to Team Setup →
          </button>
        </div>

        {tossWinner && tossDecision && (
          <div className="toss-summary">
            <p>
              <strong>{tossWinner}</strong> won the toss and elected to{' '}
              <strong>{tossDecision === 'bat' ? 'bat first' : 'bowl first'}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TossSetup;
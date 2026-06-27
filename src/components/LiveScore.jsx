import React from 'react';
import { useMatch } from '../context/MatchContext';
import { calculateRunRate, calculateRequiredRunRate, formatOvers } from '../utils/calculations';
import '../styles/LiveScore.css';

const LiveScore = () => {
  const { state } = useMatch();
  const currentInning = state.innings[state.currentInnings];
  const { matchSetup } = state;

  const currentRunRate = calculateRunRate(
    currentInning.totalRuns,
    currentInning.overs,
    currentInning.balls
  );

  const requiredRunRate = state.currentInnings === 2 && state.target
    ? calculateRequiredRunRate(
        state.target,
        currentInning.totalRuns,
        matchSetup.overs,
        currentInning.overs,
        currentInning.balls
      )
    : null;

  const totalExtras = Object.values(currentInning.extras).reduce((a, b) => a + b, 0);

  return (
    <div className="live-score">
      <div className="match-info-bar">
        <div className="match-title">
          <h3>{matchSetup.matchName}</h3>
          <span className="innings-badge">Innings {state.currentInnings}</span>
        </div>
      </div>

      <div className="score-main">
        <div className="batting-team">
          <h2>{currentInning.battingTeam}</h2>
          <div className="score-display">
            <span className="runs">{currentInning.totalRuns}</span>
            <span className="separator">/</span>
            <span className="wickets">{currentInning.wickets}</span>
          </div>
          <div className="overs-display">
            <span className="label">Overs:</span>
            <span className="value">{formatOvers(currentInning.overs, currentInning.balls)}</span>
            <span className="total">/ {matchSetup.overs}</span>
          </div>
        </div>

        <div className="score-stats">
          <div className="stat-item">
            <span className="stat-label">CRR</span>
            <span className="stat-value">{currentRunRate}</span>
          </div>
          
          {state.currentInnings === 2 && state.target && (
            <>
              <div className="stat-item highlight">
                <span className="stat-label">Target</span>
                <span className="stat-value">{state.target}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">RRR</span>
                <span className="stat-value">{requiredRunRate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Need</span>
                <span className="stat-value">{Math.max(0, state.target - currentInning.totalRuns)}</span>
              </div>
            </>
          )}
          
          {totalExtras > 0 && (
            <div className="stat-item">
              <span className="stat-label">Extras</span>
              <span className="stat-value">{totalExtras}</span>
            </div>
          )}
        </div>
      </div>

      {state.currentInnings === 2 && state.target && (
        <div className="target-info">
          <p>
            {currentInning.battingTeam} need <strong>{Math.max(0, state.target - currentInning.totalRuns)}</strong> runs 
            from <strong>{(matchSetup.overs - currentInning.overs) * 6 - currentInning.balls}</strong> balls
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveScore;
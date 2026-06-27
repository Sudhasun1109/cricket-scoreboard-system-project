import React from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/BowlingCard.css';

const BowlingCard = () => {
  const { state } = useMatch();
  const currentInning = state.innings[state.currentInnings];

  const getCurrentBowler = () => {
    return currentInning.bowlers.find(b => b.id === currentInning.currentBowler);
  };

  const currentBowler = getCurrentBowler();

  const formatBowlerOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
  };

  return (
    <div className="bowling-card">
      <h3 className="card-title">
        <span className="icon">⚽</span>
        Bowling
      </h3>

      {currentBowler && (
        <div className="current-bowler">
          <h4>Current Bowler</h4>
          <div className="bowler-row active">
            <div className="bowler-info">
              <span className="bowler-badge">●</span>
              <span className="bowler-name">{currentBowler.name}</span>
            </div>
            <div className="bowler-stats">
              <span className="overs">{formatBowlerOvers(currentBowler.balls)}</span>
              <span className="maidens">M: {currentBowler.maidens}</span>
              <span className="runs">R: {currentBowler.runs}</span>
              <span className="wickets">W: {currentBowler.wickets}</span>
              <span className="economy">Econ: {currentBowler.economy}</span>
            </div>
          </div>
        </div>
      )}

      {/* All Bowlers */}
      <div className="all-bowlers">
        <h4>All Bowlers</h4>
        <div className="bowlers-table">
          <div className="table-header">
            <span>Bowler</span>
            <span>O</span>
            <span>M</span>
            <span>R</span>
            <span>W</span>
            <span>Econ</span>
          </div>
          {currentInning.bowlers.map(bowler => (
            <div key={bowler.id} className={`table-row ${bowler.id === currentInning.currentBowler ? 'active' : ''}`}>
              <span className="player-name">{bowler.name}</span>
              <span>{formatBowlerOvers(bowler.balls)}</span>
              <span>{bowler.maidens}</span>
              <span>{bowler.runs}</span>
              <span>{bowler.wickets}</span>
              <span>{bowler.economy}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BowlingCard;

import React from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/BattingCard.css';

const BattingCard = () => {
  const { state } = useMatch();
  const currentInning = state.innings[state.currentInnings];

  const getPlayerById = (id) => {
    return currentInning.players.find(p => p.id === id);
  };

  const striker = getPlayerById(currentInning.currentBatsmen.striker);
  const nonStriker = getPlayerById(currentInning.currentBatsmen.nonStriker);

  return (
    <div className="batting-card">
      <h3 className="card-title">
        <span className="icon">🏏</span>
        Current Partnership
      </h3>

      <div className="batsmen-container">
        {striker && (
          <div className="batsman-row striker">
            <div className="batsman-info">
              <span className="striker-badge">★</span>
              <span className="batsman-name">{striker.name}</span>
            </div>
            <div className="batsman-stats">
              <span className="runs">{striker.runs}</span>
              <span className="balls">({striker.balls})</span>
              <span className="sr">SR: {striker.strikeRate}</span>
              <div className="boundaries">
                <span className="fours">4s: {striker.fours}</span>
                <span className="sixes">6s: {striker.sixes}</span>
              </div>
            </div>
          </div>
        )}

        {nonStriker && (
          <div className="batsman-row">
            <div className="batsman-info">
              <span className="batsman-name">{nonStriker.name}</span>
            </div>
            <div className="batsman-stats">
              <span className="runs">{nonStriker.runs}</span>
              <span className="balls">({nonStriker.balls})</span>
              <span className="sr">SR: {nonStriker.strikeRate}</span>
              <div className="boundaries">
                <span className="fours">4s: {nonStriker.fours}</span>
                <span className="sixes">6s: {nonStriker.sixes}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Batsmen */}
      <div className="all-batsmen">
        <h4>All Batsmen</h4>
        <div className="batsmen-table">
          <div className="table-header">
            <span>Batsman</span>
            <span>R</span>
            <span>B</span>
            <span>4s</span>
            <span>6s</span>
            <span>SR</span>
          </div>
          {currentInning.players.map(player => (
            <div key={player.id} className={`table-row ${player.isOut ? 'out' : ''}`}>
              <span className="player-name">
                {player.name}
                {player.isOut && <span className="out-badge">Out</span>}
              </span>
              <span>{player.runs}</span>
              <span>{player.balls}</span>
              <span>{player.fours}</span>
              <span>{player.sixes}</span>
              <span>{player.strikeRate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattingCard;
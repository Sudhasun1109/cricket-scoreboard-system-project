import React from 'react';
import '../styles/PlayersList.css';

const PlayersList = ({ players }) => {
  if (players.length === 0) return null;

  const activePlayers = players.filter(p => !p.isOut);
  const outPlayers = players.filter(p => p.isOut);

  return (
    <div className="players-list-container">
      <h3>Scorecard</h3>
      
      {activePlayers.length > 0 && (
        <div className="players-section">
          <h4 className="section-title">Batting</h4>
          <div className="players-grid">
            {activePlayers.map((player) => (
              <div key={player.id} className="player-card active">
                <div className="player-header">
                  <h5>{player.name}</h5>
                  <span className="player-status batting">Batting</span>
                </div>
                <div className="player-stats">
                  <div className="stat-row">
                    <span>Runs:</span>
                    <strong>{player.runs}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Balls:</span>
                    <strong>{player.balls}</strong>
                  </div>
                  <div className="stat-row">
                    <span>SR:</span>
                    <strong>{player.strikeRate}</strong>
                  </div>
                  <div className="stat-row">
                    <span>4s/6s:</span>
                    <strong>{player.fours}/{player.sixes}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outPlayers.length > 0 && (
        <div className="players-section">
          <h4 className="section-title">Out</h4>
          <div className="players-grid">
            {outPlayers.map((player) => (
              <div key={player.id} className="player-card out">
                <div className="player-header">
                  <h5>{player.name}</h5>
                  <span className="player-status out-badge">Out</span>
                </div>
                <div className="player-stats">
                  <div className="stat-row">
                    <span>Runs:</span>
                    <strong>{player.runs}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Balls:</span>
                    <strong>{player.balls}</strong>
                  </div>
                  <div className="stat-row">
                    <span>SR:</span>
                    <strong>{player.strikeRate}</strong>
                  </div>
                  <div className="stat-row">
                    <span>4s/6s:</span>
                    <strong>{player.fours}/{player.sixes}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersList;
import React, { useState } from 'react';
import '../styles/PlayerInput.css';

const PlayerInput = ({ onAddPlayer, onRemovePlayer, onStartGame, players, gameStarted, teamName }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      setError('Please enter a player name');
      return;
    }

    if (players.length >= 11) {
      setError('Maximum 11 players allowed!');
      return;
    }

    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      setError('Player already exists');
      return;
    }

    onAddPlayer(name.trim());
    setName('');
    setError('');
  };

  const canStartGame = players.length >= 2;

  return (
    <div className="player-input-container">
      <div className="team-header">
        <h3>🏏 {teamName || 'Team'}</h3>
        <span className="player-count-badge">{players.length}/11 Players</span>
      </div>
      
      <form onSubmit={handleSubmit} className="player-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter player name"
          className="player-input"
          disabled={gameStarted || players.length >= 11}
          maxLength={30}
        />
        <button 
          type="submit" 
          className="add-btn" 
          disabled={gameStarted || players.length >= 11}
        >
          + Add Player
        </button>
      </form>
      
      {error && <p className="error-message">{error}</p>}

      {/* Players List */}
      {players.length > 0 && (
        <div className="added-players-list">
          <h4>Squad ({players.length})</h4>
          <div className="players-grid-mini">
            {players.map((player, index) => (
              <div key={player.id} className="player-mini-card">
                <span className="player-number">{index + 1}</span>
                <span className="player-name">{player.name}</span>
                {!gameStarted && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="remove-player-btn"
                    title="Remove player"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Messages */}
      {players.length === 0 && (
        <div className="info-message">
          <p>📋 Add at least 2 players to start (Maximum 11)</p>
        </div>
      )}

      {players.length === 1 && (
        <div className="info-message warning">
          <p>⚠️ Add at least 1 more player to start the match</p>
        </div>
      )}

      {/* Start Game Button */}
      {canStartGame && !gameStarted && (
        <button onClick={onStartGame} className="start-game-btn">
          🏏 Start Innings
        </button>
      )}
    </div>
  );
};

export default PlayerInput;
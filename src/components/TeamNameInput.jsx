import React, { useState } from 'react';
import '../styles/TeamNameInput.css';

const TeamNameInput = ({ onSetTeamNames, currentInnings }) => {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (team1Name.trim() === '' || team2Name.trim() === '') {
      setError('Please enter both team names');
      return;
    }

    if (team1Name.trim() === team2Name.trim()) {
      setError('Team names must be different');
      return;
    }

    onSetTeamNames({
      team1: team1Name.trim(),
      team2: team2Name.trim()
    });

    setError('');
  };

  return (
    <div className="team-name-input-container">
      <h2>🏏 Setup Match</h2>
      <p className="subtitle">Enter team names to start</p>
      
      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-group">
          <label htmlFor="team1">Team 1 Name</label>
          <input
            id="team1"
            type="text"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            placeholder="e.g., India"
            className="team-input"
            maxLength={20}
          />
        </div>

        <div className="vs-divider">
          <span>VS</span>
        </div>

        <div className="form-group">
          <label htmlFor="team2">Team 2 Name</label>
          <input
            id="team2"
            type="text"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            placeholder="e.g., Australia"
            className="team-input"
            maxLength={20}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-team-btn">
          Continue to Add Players
        </button>
      </form>
    </div>
  );
};

export default TeamNameInput;
import React, { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/TeamSetup.css';

const TeamSetup = () => {
  const { state, dispatch } = useMatch();
  const currentInning = state.innings[state.currentInnings];
  const maxPlayers = state.matchSetup.playersPerSide;

  const [battingPlayers, setBattingPlayers] = useState([]);
  const [bowlingPlayers, setBowlingPlayers] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [bowlerName, setBowlerName] = useState('');
  const [openingBatsmen, setOpeningBatsmen] = useState({ striker: '', nonStriker: '' });
  const [openingBowler, setOpeningBowler] = useState('');
  const [step, setStep] = useState(1); // 1: batting squad, 2: bowling squad, 3: select openers

  const addBattingPlayer = () => {
    if (playerName.trim() && battingPlayers.length < maxPlayers) {
      const newPlayer = {
        id: Date.now(),
        name: playerName.trim(),
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: '0.00',
        isOut: false
      };
      setBattingPlayers([...battingPlayers, newPlayer]);
      dispatch({ type: 'ADD_PLAYER', payload: newPlayer });
      setPlayerName('');
    }
  };

  const addBowlingPlayer = () => {
    if (bowlerName.trim() && bowlingPlayers.length < maxPlayers) {
      const newBowler = {
        id: Date.now(),
        name: bowlerName.trim(),
        overs: 0,
        balls: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: '0.00'
      };
      setBowlingPlayers([...bowlingPlayers, newBowler]);
      dispatch({ type: 'ADD_BOWLER', payload: newBowler });
      setBowlerName('');
    }
  };

  const removePlayer = (id) => {
    setBattingPlayers(battingPlayers.filter(p => p.id !== id));
  };

  const removeBowler = (id) => {
    setBowlingPlayers(bowlingPlayers.filter(b => b.id !== id));
  };

  const handleContinue = () => {
    if (step === 1 && battingPlayers.length >= 2) {
      setStep(2);
    } else if (step === 2 && bowlingPlayers.length >= 1) {
      setStep(3);
    }
  };

  const startMatch = () => {
    if (openingBatsmen.striker && openingBatsmen.nonStriker && openingBowler) {
      dispatch({ 
        type: 'SET_OPENING_BATSMEN', 
        payload: { 
          striker: Number(openingBatsmen.striker), 
          nonStriker: Number(openingBatsmen.nonStriker) 
        } 
      });
      dispatch({ type: 'SET_OPENING_BOWLER', payload: Number(openingBowler) });
    }
  };

  return (
    <div className="team-setup">
      <div className="setup-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Batting Squad</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Bowling Squad</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Select Openers</span>
        </div>
      </div>

      {step === 1 && (
        <div className="setup-section">
          <div className="section-header">
            <h3>🏏 {currentInning.battingTeam} - Batting Squad</h3>
            <span className="player-count">{battingPlayers.length}/{maxPlayers}</span>
          </div>

          <div className="add-player-form">
            <input
              type="text"
              placeholder="Enter player name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBattingPlayer()}
              maxLength={30}
            />
            <button 
              onClick={addBattingPlayer}
              disabled={battingPlayers.length >= maxPlayers || !playerName.trim()}
            >
              + Add Player
            </button>
          </div>

          <div className="players-list">
            {battingPlayers.map((player, index) => (
              <div key={player.id} className="player-item">
                <span className="player-number">{index + 1}</span>
                <span className="player-name">{player.name}</span>
                <button onClick={() => removePlayer(player.id)} className="remove-btn">×</button>
              </div>
            ))}
          </div>

          {battingPlayers.length === 0 && (
            <div className="empty-state">
              <p>👥 Add at least 2 players to continue</p>
            </div>
          )}

          <button 
            className="continue-btn"
            onClick={handleContinue}
            disabled={battingPlayers.length < 2}
          >
            Continue to Bowling Squad →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="setup-section">
          <div className="section-header">
            <h3>⚡ {currentInning.bowlingTeam} - Bowling Squad</h3>
            <span className="player-count">{bowlingPlayers.length}/{maxPlayers}</span>
          </div>

          <div className="add-player-form">
            <input
              type="text"
              placeholder="Enter bowler name"
              value={bowlerName}
              onChange={(e) => setBowlerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBowlingPlayer()}
              maxLength={30}
            />
            <button 
              onClick={addBowlingPlayer}
              disabled={bowlingPlayers.length >= maxPlayers || !bowlerName.trim()}
            >
              + Add Bowler
            </button>
          </div>

          <div className="players-list">
            {bowlingPlayers.map((bowler, index) => (
              <div key={bowler.id} className="player-item">
                <span className="player-number">{index + 1}</span>
                <span className="player-name">{bowler.name}</span>
                <button onClick={() => removeBowler(bowler.id)} className="remove-btn">×</button>
              </div>
            ))}
          </div>

          {bowlingPlayers.length === 0 && (
            <div className="empty-state">
              <p>⚡ Add at least 1 bowler to continue</p>
            </div>
          )}

          <div className="button-group">
            <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
            <button 
              className="continue-btn"
              onClick={handleContinue}
              disabled={bowlingPlayers.length < 1}
            >
              Select Opening Players →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="setup-section">
          <h3>🎯 Select Opening Players</h3>

          <div className="openers-selection">
            <div className="opener-card">
              <label>Opening Batsman 1 (Striker)</label>
              <select
                value={openingBatsmen.striker}
                onChange={(e) => setOpeningBatsmen({ ...openingBatsmen, striker: e.target.value })}
              >
                <option value="">Select Striker</option>
                {battingPlayers.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === Number(openingBatsmen.nonStriker)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="opener-card">
              <label>Opening Batsman 2 (Non-Striker)</label>
              <select
                value={openingBatsmen.nonStriker}
                onChange={(e) => setOpeningBatsmen({ ...openingBatsmen, nonStriker: e.target.value })}
              >
                <option value="">Select Non-Striker</option>
                {battingPlayers.map(p => (
                  <option key={p.id} value={p.id} disabled={p.id === Number(openingBatsmen.striker)}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="opener-card">
              <label>Opening Bowler</label>
              <select
                value={openingBowler}
                onChange={(e) => setOpeningBowler(e.target.value)}
              >
                <option value="">Select Bowler</option>
                {bowlingPlayers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-group">
            <button className="back-btn" onClick={() => setStep(2)}>← Back</button>
            <button 
              className="start-match-btn"
              onClick={startMatch}
              disabled={!openingBatsmen.striker || !openingBatsmen.nonStriker || !openingBowler}
            >
              🏏 Start Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSetup;
import React, { useState } from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/MatchSetup.css';

const MatchSetup = () => {
  const { dispatch } = useMatch();
  const [formData, setFormData] = useState({
    matchName: '',
    team1Name: '',
    team2Name: '',
    overs: 20,
    playersPerSide: 11
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.matchName.trim()) newErrors.matchName = 'Match name is required';
    if (!formData.team1Name.trim()) newErrors.team1Name = 'Team 1 name is required';
    if (!formData.team2Name.trim()) newErrors.team2Name = 'Team 2 name is required';
    if (formData.team1Name.trim() === formData.team2Name.trim()) {
      newErrors.team2Name = 'Team names must be different';
    }
    if (formData.overs < 1 || formData.overs > 50) {
      newErrors.overs = 'Overs must be between 1 and 50';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      dispatch({ type: 'SETUP_MATCH', payload: formData });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="match-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h2> Match Setup</h2>
          <p>Configure your cricket match details</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label>Match Name</label>
            <input
              type="text"
              placeholder="e.g., IPL Final 2024"
              value={formData.matchName}
              onChange={(e) => setFormData({ ...formData, matchName: e.target.value })}
              className={errors.matchName ? 'error' : ''}
            />
            {errors.matchName && <span className="error-msg">{errors.matchName}</span>}
          </div>

          <div className="teams-grid">
            <div className="form-group">
              <label>Team 1 Name</label>
              <input
                type="text"
                placeholder="e.g., Mumbai Indians"
                value={formData.team1Name}
                onChange={(e) => setFormData({ ...formData, team1Name: e.target.value })}
                className={errors.team1Name ? 'error' : ''}
              />
              {errors.team1Name && <span className="error-msg">{errors.team1Name}</span>}
            </div>

            <div className="vs-badge">VS</div>

            <div className="form-group">
              <label>Team 2 Name</label>
              <input
                type="text"
                placeholder="e.g., Chennai Super Kings"
                value={formData.team2Name}
                onChange={(e) => setFormData({ ...formData, team2Name: e.target.value })}
                className={errors.team2Name ? 'error' : ''}
              />
              {errors.team2Name && <span className="error-msg">{errors.team2Name}</span>}
            </div>
          </div>

          <div className="match-config">
            <div className="form-group">
              <label>Number of Overs</label>
              <select
                value={formData.overs}
                onChange={(e) => setFormData({ ...formData, overs: Number(e.target.value) })}
              >
                <option value={5}>5 Overs</option>
                <option value={10}>10 Overs</option>
                <option value={20}>20 Overs (T20)</option>
                <option value={50}>50 Overs (ODI)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Players Per Side</label>
              <select
                value={formData.playersPerSide}
                onChange={(e) => setFormData({ ...formData, playersPerSide: Number(e.target.value) })}
              >
                <option value={11}>11 Players</option>
                <option value={8}>8 Players</option>
                <option value={6}>6 Players</option>
              </select>
            </div>
          </div>

          <button type="submit" className="continue-btn">
            Continue to Toss
            <span className="arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchSetup;

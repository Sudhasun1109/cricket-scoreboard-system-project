import React from 'react';
import { useMatch } from '../context/MatchContext';
import { getMatchResult } from '../utils/calculations';
import '../styles/MatchSummary.css';

const MatchSummary = () => {
  const { state, dispatch } = useMatch();
  const innings1 = state.innings[1];
  const innings2 = state.innings[2];

  const topBatsman = (innings) => {
    return innings.players.reduce((prev, current) => 
      (prev.runs > current.runs) ? prev : current
    );
  };

  const topBowler = (innings) => {
    return innings.bowlers.reduce((prev, current) => 
      (prev.wickets > current.wickets) ? prev : current
    );
  };

  const result = getMatchResult(innings1, innings2, innings1.battingTeam, innings2.battingTeam);

  return (
    <div className="match-summary-overlay">
      <div className="match-summary">
        <div className="summary-header">
          <h2>🏆 Match Complete</h2>
          <div className="result-banner">
            {result}
          </div>
        </div>

        <div className="innings-summary">
          {/* Innings 1 */}
          <div className="innings-card">
            <h3>{innings1.battingTeam}</h3>
            <div className="score-big">
              {innings1.totalRuns}/{innings1.wickets}
            </div>
            <p className="overs">({innings1.overs}.{innings1.balls} overs)</p>
            
            <div className="top-performers">
              <div className="performer">
                <span className="label">Top Scorer:</span>
                <span className="value">
                  {topBatsman(innings1).name} ({topBatsman(innings1).runs})
                </span>
              </div>
              <div className="performer">
                <span className="label">Best Bowler:</span>
                <span className="value">
                  {topBowler(innings1).name} ({topBowler(innings1).wickets}/{topBowler(innings1).runs})
                </span>
              </div>
            </div>
          </div>

          {/* Innings 2 */}
          <div className="innings-card">
            <h3>{innings2.battingTeam}</h3>
            <div className="score-big">
              {innings2.totalRuns}/{innings2.wickets}
            </div>
            <p className="overs">({innings2.overs}.{innings2.balls} overs)</p>
            
            <div className="top-performers">
              <div className="performer">
                <span className="label">Top Scorer:</span>
                <span className="value">
                  {topBatsman(innings2).name} ({topBatsman(innings2).runs})
                </span>
              </div>
              <div className="performer">
                <span className="label">Best Bowler:</span>
                <span className="value">
                  {topBowler(innings2).name} ({topBowler(innings2).wickets}/{topBowler(innings2).runs})
                </span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="new-match-btn"
          onClick={() => {
            if (window.confirm('Start a new match?')) {
              dispatch({ type: 'RESET_MATCH' });
            }
          }}
        >
          Start New Match
        </button>
      </div>
    </div>
  );
};

export default MatchSummary;
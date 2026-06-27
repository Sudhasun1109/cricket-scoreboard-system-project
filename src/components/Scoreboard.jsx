import React from 'react';
import { useMatch } from '../context/MatchContext';
import LiveScore from './LiveScore';
import BattingCard from './BattingCard';
import BowlingCard from './BowlingCard';
import ScoreControls from './ScoreControls';
import OverTimeline from './OverTimeline';
import '../styles/Scoreboard.css';

const Scoreboard = () => {
  const { state, dispatch } = useMatch();

  const handleEndInnings = () => {
    const currentInningsName = state.innings[state.currentInnings].battingTeam;
    const nextInningsName = state.innings[2].battingTeam || 'Team 2';
    
    if (window.confirm(`End ${currentInningsName} innings and start ${nextInningsName} innings?`)) {
      dispatch({ type: 'START_INNINGS_2' });
    }
  };

  return (
    <div className="scoreboard">
      <LiveScore />
      
      <div className="scoreboard-grid">
        <div className="left-column">
          <BattingCard />
          <BowlingCard />
        </div>
        
        <div className="right-column">
          <ScoreControls />
          <OverTimeline />
          
          {state.currentInnings === 1 && (
            <button className="end-innings-btn" onClick={handleEndInnings}>
              End Innings & Start Innings 2
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
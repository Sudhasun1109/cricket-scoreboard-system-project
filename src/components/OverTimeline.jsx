import React from 'react';
import { useMatch } from '../context/MatchContext';
import '../styles/OverTimeline.css';

const OverTimeline = () => {
  const { state } = useMatch();
  const currentInning = state.innings[state.currentInnings];

  const getCurrentOver = () => {
    return currentInning.ballByBall.filter(
      ball => ball.over === currentInning.overs
    );
  };

  const getLastFiveOvers = () => {
    const overs = [];
    for (let i = Math.max(0, currentInning.overs - 5); i < currentInning.overs; i++) {
      overs.push({
        overNumber: i,
        balls: currentInning.ballByBall.filter(ball => ball.over === i)
      });
    }
    return overs;
  };

  const getBallDisplay = (ball) => {
    if (ball.isExtra) {
      return `${ball.runs}${ball.extraType === 'wide' ? 'Wd' : ball.extraType === 'noBall' ? 'Nb' : 'B'}`;
    }
    return ball.runs === 0 ? '•' : ball.runs;
  };

  const getBallClass = (ball) => {
    if (ball.isExtra) return 'extra';
    if (ball.runs === 6) return 'six';
    if (ball.runs === 4) return 'four';
    if (ball.runs === 0) return 'dot';
    return 'runs';
  };

  return (
    <div className="over-timeline">
      <h3>Current Over</h3>
      <div className="current-over">
        {getCurrentOver().map((ball, index) => (
          <div key={index} className={`ball ${getBallClass(ball)}`}>
            {getBallDisplay(ball)}
          </div>
        ))}
        {currentInning.balls < 6 && (
          Array(6 - getCurrentOver().length).fill(0).map((_, i) => (
            <div key={`empty-${i}`} className="ball empty">-</div>
          ))
        )}
      </div>

      {getLastFiveOvers().length > 0 && (
        <>
          <h4>Recent Overs</h4>
          <div className="recent-overs">
            {getLastFiveOvers().reverse().map((over) => (
              <div key={over.overNumber} className="over-row">
                <span className="over-number">Over {over.overNumber + 1}</span>
                <div className="over-balls">
                  {over.balls.map((ball, index) => (
                    <span key={index} className={`ball-mini ${getBallClass(ball)}`}>
                      {getBallDisplay(ball)}
                    </span>
                  ))}
                </div>
                <span className="over-runs">
                  {over.balls.reduce((sum, ball) => sum + ball.runs, 0)} runs
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OverTimeline;
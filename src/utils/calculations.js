export const calculateRunRate = (runs, overs, balls) => {
  const totalOvers = overs + (balls / 6);
  return totalOvers > 0 ? (runs / totalOvers).toFixed(2) : '0.00';
};

export const calculateRequiredRunRate = (target, currentRuns, totalOvers, oversCompleted, ballsCompleted) => {
  const oversRemaining = totalOvers - oversCompleted - (ballsCompleted / 6);
  const runsRequired = target - currentRuns;
  return oversRemaining > 0 ? (runsRequired / oversRemaining).toFixed(2) : '0.00';
};

export const calculateStrikeRate = (runs, balls) => {
  return balls > 0 ? ((runs / balls) * 100).toFixed(2) : '0.00';
};

export const calculateEconomy = (runs, balls) => {
  const overs = balls / 6;
  return overs > 0 ? (runs / overs).toFixed(2) : '0.00';
};

export const formatOvers = (overs, balls) => {
  return `${overs}.${balls}`;
};

export const getMatchResult = (innings1, innings2, team1, team2) => {
  if (innings2.wickets === 10) {
    const margin = innings1.totalRuns - innings2.totalRuns;
    return `${team1} won by ${margin} runs`;
  } else if (innings2.totalRuns > innings1.totalRuns) {
    const wicketsRemaining = 10 - innings2.wickets;
    return `${team2} won by ${wicketsRemaining} wickets`;
  } else {
    return 'Match Tied';
  }
};
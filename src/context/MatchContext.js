import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MatchContext = createContext();

const initialState = {
  matchSetup: {
    matchName: '',
    team1Name: '',
    team2Name: '',
    overs: 20,
    playersPerSide: 11,
    isSetupComplete: false
  },
  currentInnings: 1,
  tossWinner: null,
  tossDecision: null,
  innings: {
    1: {
      battingTeam: '',
      bowlingTeam: '',
      players: [],
      bowlers: [],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
      currentBatsmen: { striker: null, nonStriker: null },
      currentBowler: null,
      ballByBall: [],
      partnerships: []
    },
    2: {
      battingTeam: '',
      bowlingTeam: '',
      players: [],
      bowlers: [],
      totalRuns: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      extras: { wide: 0, noBall: 0, bye: 0, legBye: 0 },
      currentBatsmen: { striker: null, nonStriker: null },
      currentBowler: null,
      ballByBall: [],
      partnerships: []
    }
  },
  matchStatus: 'setup', // setup, toss, innings1, innings2, completed
  target: null,
  winner: null
};

function matchReducer(state, action) {
  switch (action.type) {
    case 'SETUP_MATCH':
      return {
        ...state,
        matchSetup: {
          ...action.payload,
          isSetupComplete: true
        },
        matchStatus: 'toss'
      };

    case 'SET_TOSS':
      const { winner, decision } = action.payload;
      const battingTeam = decision === 'bat' ? winner : (winner === state.matchSetup.team1Name ? state.matchSetup.team2Name : state.matchSetup.team1Name);
      const bowlingTeam = battingTeam === state.matchSetup.team1Name ? state.matchSetup.team2Name : state.matchSetup.team1Name;
      
      return {
        ...state,
        tossWinner: winner,
        tossDecision: decision,
        innings: {
          ...state.innings,
          1: {
            ...state.innings[1],
            battingTeam,
            bowlingTeam
          }
        },
        matchStatus: 'teamSetup'
      };

    case 'ADD_PLAYER':
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...state.innings[state.currentInnings],
            players: [...state.innings[state.currentInnings].players, action.payload]
          }
        }
      };

    case 'ADD_BOWLER':
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...state.innings[state.currentInnings],
            bowlers: [...state.innings[state.currentInnings].bowlers, action.payload]
          }
        }
      };

    case 'SET_OPENING_BATSMEN':
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...state.innings[state.currentInnings],
            currentBatsmen: action.payload
          }
        }
      };

    case 'SET_OPENING_BOWLER':
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...state.innings[state.currentInnings],
            currentBowler: action.payload
          }
        },
        matchStatus: state.currentInnings === 1 ? 'innings1' : 'innings2'
      };

    case 'ADD_RUNS': {
      const currentInning = state.innings[state.currentInnings];
      const { runs, isExtra, extraType, isBoundary } = action.payload;
      
      let newBalls = currentInning.balls;
      let newOvers = currentInning.overs;
      
      // Only increment ball count for legal deliveries
      if (!isExtra || (extraType !== 'wide' && extraType !== 'noBall')) {
        newBalls += 1;
        if (newBalls === 6) {
          newBalls = 0;
          newOvers += 1;
        }
      }

      // Update striker stats
      const updatedPlayers = currentInning.players.map(p => {
        if (p.id === currentInning.currentBatsmen.striker) {
          return {
            ...p,
            runs: p.runs + (isExtra ? 0 : runs),
            balls: p.balls + (isExtra && (extraType === 'wide' || extraType === 'noBall') ? 0 : 1),
            fours: p.fours + (isBoundary && runs === 4 ? 1 : 0),
            sixes: p.sixes + (isBoundary && runs === 6 ? 1 : 0),
            strikeRate: ((p.runs + (isExtra ? 0 : runs)) / (p.balls + 1) * 100).toFixed(2)
          };
        }
        return p;
      });

      // Update bowler stats
      const updatedBowlers = currentInning.bowlers.map(b => {
        if (b.id === currentInning.currentBowler) {
          return {
            ...b,
            runs: b.runs + runs,
            balls: b.balls + (isExtra && (extraType === 'wide' || extraType === 'noBall') ? 0 : 1),
            economy: ((b.runs + runs) / ((b.balls + 1) / 6)).toFixed(2)
          };
        }
        return b;
      });

      // Update extras
      const updatedExtras = { ...currentInning.extras };
      if (isExtra && extraType) {
        updatedExtras[extraType] += runs;
      }

      // Ball by ball record
      const ballRecord = {
        over: newOvers,
        ball: newBalls,
        runs,
        isExtra,
        extraType,
        batsmanId: currentInning.currentBatsmen.striker,
        bowlerId: currentInning.currentBowler,
        totalRuns: currentInning.totalRuns + runs
      };

      // Rotate strike on odd runs (only for legal deliveries)
      let newBatsmen = currentInning.currentBatsmen;
      if (runs % 2 !== 0 && !isExtra) {
        newBatsmen = {
          striker: currentInning.currentBatsmen.nonStriker,
          nonStriker: currentInning.currentBatsmen.striker
        };
      }

      // Rotate strike after over
      if (newBalls === 0 && newOvers !== currentInning.overs) {
        newBatsmen = {
          striker: newBatsmen.nonStriker,
          nonStriker: newBatsmen.striker
        };
      }

      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInning,
            totalRuns: currentInning.totalRuns + runs,
            balls: newBalls,
            overs: newOvers,
            players: updatedPlayers,
            bowlers: updatedBowlers,
            extras: updatedExtras,
            currentBatsmen: newBatsmen,
            ballByBall: [...currentInning.ballByBall, ballRecord]
          }
        }
      };
    }

    case 'WICKET': {
      const currentInning = state.innings[state.currentInnings];
      const { outBatsmanId, newBatsmanId } = action.payload;
      
      let newBalls = currentInning.balls + 1;
      let newOvers = currentInning.overs;
      
      if (newBalls === 6) {
        newBalls = 0;
        newOvers += 1;
      }

      const updatedPlayers = currentInning.players.map(p => {
        if (p.id === outBatsmanId) {
          return { ...p, isOut: true, balls: p.balls + 1 };
        }
        return p;
      });

      const updatedBowlers = currentInning.bowlers.map(b => {
        if (b.id === currentInning.currentBowler) {
          return {
            ...b,
            wickets: b.wickets + 1,
            balls: b.balls + 1
          };
        }
        return b;
      });

      const newWickets = currentInning.wickets + 1;
      
      // Check if innings is over
      if (newWickets === 10 || newOvers === state.matchSetup.overs) {
        return {
          ...state,
          innings: {
            ...state.innings,
            [state.currentInnings]: {
              ...currentInning,
              wickets: newWickets,
              balls: newBalls,
              overs: newOvers,
              players: updatedPlayers,
              bowlers: updatedBowlers
            }
          },
          matchStatus: state.currentInnings === 1 ? 'innings1Complete' : 'completed',
          target: state.currentInnings === 1 ? currentInning.totalRuns + 1 : state.target
        };
      }

      // Update current batsmen
      const isStrikerOut = outBatsmanId === currentInning.currentBatsmen.striker;
      const newBatsmen = {
        striker: isStrikerOut ? newBatsmanId : currentInning.currentBatsmen.striker,
        nonStriker: isStrikerOut ? currentInning.currentBatsmen.nonStriker : newBatsmanId
      };

      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInning,
            wickets: newWickets,
            balls: newBalls,
            overs: newOvers,
            players: updatedPlayers,
            bowlers: updatedBowlers,
            currentBatsmen: newBatsmen
          }
        }
      };
    }

    case 'CHANGE_BOWLER':
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...state.innings[state.currentInnings],
            currentBowler: action.payload
          }
        }
      };

    case 'START_INNINGS_2':
      const innings1 = state.innings[1];
      return {
        ...state,
        currentInnings: 2,
        target: innings1.totalRuns + 1,
        innings: {
          ...state.innings,
          2: {
            ...state.innings[2],
            battingTeam: innings1.bowlingTeam,
            bowlingTeam: innings1.battingTeam
          }
        },
        matchStatus: 'teamSetup'
      };

    case 'UNDO_BALL': {
      const currentInning = state.innings[state.currentInnings];
      if (currentInning.ballByBall.length === 0) return state;

      const lastBall = currentInning.ballByBall[currentInning.ballByBall.length - 1];
      const newBallByBall = currentInning.ballByBall.slice(0, -1);

      // Restore previous state
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInning,
            totalRuns: lastBall.totalRuns - lastBall.runs,
            balls: lastBall.ball === 0 ? 5 : lastBall.ball - 1,
            overs: lastBall.ball === 0 ? lastBall.over - 1 : lastBall.over,
            ballByBall: newBallByBall
          }
        }
      };
    }

    case 'RESET_MATCH':
      localStorage.removeItem('cricketMatch');
      return initialState;

    default:
      return state;
  }
}

export function MatchProvider({ children }) {
  const [state, dispatch] = useReducer(matchReducer, initialState, (initial) => {
    const saved = localStorage.getItem('cricketMatch');
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem('cricketMatch', JSON.stringify(state));
  }, [state]);

  return (
    <MatchContext.Provider value={{ state, dispatch }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatch must be used within MatchProvider');
  }
  return context;
}
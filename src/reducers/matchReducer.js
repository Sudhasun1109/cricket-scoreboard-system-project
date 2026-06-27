export const initialState = {
  currentInnings: 1,
  innings: {
    1: {
      teamName: '',
      players: [],
      totalScore: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      currentBatsman1Index: null,
      currentBatsman2Index: null,
      striker: 1,
      ballHistory: [],
      extras: 0
    },
    2: {
      teamName: '',
      players: [],
      totalScore: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      currentBatsman1Index: null,
      currentBatsman2Index: null,
      striker: 1,
      ballHistory: [],
      extras: 0
    }
  },
  gameStarted: false,
  matchEnded: false,
  target: null,
  teamNamesSet: false
};

export const matchReducer = (state, action) => {
  const currentInningsData = state.innings[state.currentInnings];

  switch (action.type) {
    case 'SET_TEAM_NAMES': {
      return {
        ...state,
        innings: {
          1: {
            ...state.innings[1],
            teamName: action.payload.team1
          },
          2: {
            ...state.innings[2],
            teamName: action.payload.team2
          }
        },
        teamNamesSet: true
      };
    }

    case 'ADD_PLAYER': {
      if (currentInningsData.players.length >= 11) {
        alert('Maximum 11 players allowed per team!');
        return state;
      }

      const newPlayer = {
        id: Date.now(),
        name: action.payload,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        strikeRate: 0,
        battingPosition: currentInningsData.players.length + 1
      };

      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            players: [...currentInningsData.players, newPlayer]
          }
        }
      };
    }

    case 'REMOVE_PLAYER': {
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            players: currentInningsData.players.filter(p => p.id !== action.payload)
          }
        }
      };
    }

    case 'START_GAME': {
      const hasMinPlayers = currentInningsData.players.length >= 2;
      if (!hasMinPlayers) {
        alert('You need at least 2 players to start the match!');
        return state;
      }

      return {
        ...state,
        gameStarted: true,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            currentBatsman1Index: 0,
            currentBatsman2Index: 1,
            striker: 1
          }
        }
      };
    }

    case 'ADD_RUNS': {
      const runs = action.payload;
      const strikerIndex = currentInningsData.striker === 1 
        ? currentInningsData.currentBatsman1Index 
        : currentInningsData.currentBatsman2Index;

      const updatedPlayers = currentInningsData.players.map((player, index) => {
        if (index === strikerIndex) {
          const newRuns = player.runs + runs;
          const newBalls = player.balls + 1;
          return {
            ...player,
            runs: newRuns,
            balls: newBalls,
            fours: runs === 4 ? player.fours + 1 : player.fours,
            sixes: runs === 6 ? player.sixes + 1 : player.sixes,
            strikeRate: newBalls > 0 ? ((newRuns / newBalls) * 100).toFixed(2) : 0
          };
        }
        return player;
      });

      let newBalls = currentInningsData.balls + 1;
      let newOvers = currentInningsData.overs;
      let newStriker = currentInningsData.striker;

      if (newBalls === 6) {
        newBalls = 0;
        newOvers += 1;
        newStriker = newStriker === 1 ? 2 : 1;
      }

      if (runs % 2 !== 0) {
        newStriker = newStriker === 1 ? 2 : 1;
      }

      const ballRecord = {
        type: 'runs',
        runs,
        striker: strikerIndex,
        totalScore: currentInningsData.totalScore + runs,
        wickets: currentInningsData.wickets,
        over: newOvers,
        ball: newBalls
      };

      // Check if target is achieved
      let matchEnded = false;
      if (state.currentInnings === 2 && state.target) {
        if (currentInningsData.totalScore + runs >= state.target) {
          matchEnded = true;
        }
      }

      return {
        ...state,
        matchEnded,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            players: updatedPlayers,
            totalScore: currentInningsData.totalScore + runs,
            balls: newBalls,
            overs: newOvers,
            striker: newStriker,
            ballHistory: [...currentInningsData.ballHistory, ballRecord]
          }
        }
      };
    }

    case 'ADD_EXTRA': {
      const { type, runs } = action.payload; // type: 'wide', 'noball', 'bye', 'legbye'
      
      let newBalls = currentInningsData.balls;
      let newOvers = currentInningsData.overs;
      
      // Wide and No-ball don't count as legal deliveries
      if (type !== 'wide' && type !== 'noball') {
        newBalls += 1;
        if (newBalls === 6) {
          newBalls = 0;
          newOvers += 1;
        }
      }

      const ballRecord = {
        type: 'extra',
        extraType: type,
        runs,
        totalScore: currentInningsData.totalScore + runs,
        wickets: currentInningsData.wickets,
        over: newOvers,
        ball: newBalls
      };

      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            totalScore: currentInningsData.totalScore + runs,
            extras: currentInningsData.extras + runs,
            balls: newBalls,
            overs: newOvers,
            ballHistory: [...currentInningsData.ballHistory, ballRecord]
          }
        }
      };
    }

    case 'HANDLE_WICKET': {
      const strikerIndex = currentInningsData.striker === 1 
        ? currentInningsData.currentBatsman1Index 
        : currentInningsData.currentBatsman2Index;

      const updatedPlayers = currentInningsData.players.map((player, index) => {
        if (index === strikerIndex) {
          return {
            ...player,
            isOut: true,
            balls: player.balls + 1,
            strikeRate: player.balls + 1 > 0 ? ((player.runs / (player.balls + 1)) * 100).toFixed(2) : 0
          };
        }
        return player;
      });

      const nextBatsmanIndex = updatedPlayers.findIndex(
        (p, idx) => !p.isOut && idx !== currentInningsData.currentBatsman1Index && idx !== currentInningsData.currentBatsman2Index
      );

      let newBalls = currentInningsData.balls + 1;
      let newOvers = currentInningsData.overs;
      let newStriker = currentInningsData.striker;

      if (newBalls === 6) {
        newBalls = 0;
        newOvers += 1;
        newStriker = newStriker === 1 ? 2 : 1;
      }

      const newWickets = currentInningsData.wickets + 1;
      let matchEnded = newWickets === 10;

      if (state.currentInnings === 2 && state.target) {
        if (currentInningsData.totalScore < state.target && newWickets === 10) {
          matchEnded = true;
        }
      }

      const ballRecord = {
        type: 'wicket',
        runs: 0,
        striker: strikerIndex,
        totalScore: currentInningsData.totalScore,
        wickets: newWickets,
        over: newOvers,
        ball: newBalls
      };

      let newCurrentBatsman1Index = currentInningsData.currentBatsman1Index;
      let newCurrentBatsman2Index = currentInningsData.currentBatsman2Index;

      if (currentInningsData.striker === 1) {
        newCurrentBatsman1Index = nextBatsmanIndex !== -1 ? nextBatsmanIndex : newCurrentBatsman1Index;
      } else {
        newCurrentBatsman2Index = nextBatsmanIndex !== -1 ? nextBatsmanIndex : newCurrentBatsman2Index;
      }

      return {
        ...state,
        matchEnded,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            players: updatedPlayers,
            wickets: newWickets,
            balls: newBalls,
            overs: newOvers,
            striker: newStriker,
            currentBatsman1Index: newCurrentBatsman1Index,
            currentBatsman2Index: newCurrentBatsman2Index,
            ballHistory: [...currentInningsData.ballHistory, ballRecord]
          }
        }
      };
    }

    case 'ROTATE_STRIKE': {
      return {
        ...state,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            striker: currentInningsData.striker === 1 ? 2 : 1
          }
        }
      };
    }

    case 'UNDO_LAST_BALL': {
      if (currentInningsData.ballHistory.length === 0) return state;

      const lastBall = currentInningsData.ballHistory[currentInningsData.ballHistory.length - 1];
      const newHistory = currentInningsData.ballHistory.slice(0, -1);
      const previousBall = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;

      let restoredPlayers = [...currentInningsData.players];
      
      if (lastBall.type === 'runs') {
        restoredPlayers = restoredPlayers.map((player, index) => {
          if (index === lastBall.striker) {
            const newBalls = player.balls - 1;
            const newRuns = player.runs - lastBall.runs;
            return {
              ...player,
              runs: newRuns,
              balls: newBalls,
              fours: lastBall.runs === 4 ? player.fours - 1 : player.fours,
              sixes: lastBall.runs === 6 ? player.sixes - 1 : player.sixes,
              strikeRate: newBalls > 0 ? ((newRuns / newBalls) * 100).toFixed(2) : 0
            };
          }
          return player;
        });
      } else if (lastBall.type === 'wicket') {
        restoredPlayers = restoredPlayers.map((player, index) => {
          if (index === lastBall.striker) {
            const newBalls = player.balls - 1;
            return {
              ...player,
              isOut: false,
              balls: newBalls,
              strikeRate: newBalls > 0 ? ((player.runs / newBalls) * 100).toFixed(2) : 0
            };
          }
          return player;
        });
      }

      const previousTotalScore = previousBall ? previousBall.totalScore : 0;
      const previousWickets = previousBall ? previousBall.wickets : 0;
      const previousOvers = previousBall ? previousBall.over : 0;
      const previousBalls = previousBall ? previousBall.ball : 0;

      return {
        ...state,
        matchEnded: false,
        innings: {
          ...state.innings,
          [state.currentInnings]: {
            ...currentInningsData,
            players: restoredPlayers,
            totalScore: previousTotalScore,
            wickets: previousWickets,
            overs: previousOvers,
            balls: previousBalls,
            ballHistory: newHistory
          }
        }
      };
    }

    case 'END_INNINGS': {
      return {
        ...state,
        currentInnings: 2,
        target: state.innings[1].totalScore + 1,
        gameStarted: false,
        matchEnded: false
      };
    }

    case 'RESET_MATCH': {
      return initialState;
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
};
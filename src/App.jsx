import React from 'react';
import { MatchProvider, useMatch } from './context/MatchContext';
import Header from './components/Header';
import MatchSetup from './components/MatchSetup';
import TossSetup from './components/TossSetup';
import TeamSetup from './components/TeamSetup';
import Scoreboard from './components/Scoreboard';
import MatchSummary from './components/MatchSummary';
import './App.css';

function AppContent() {
  const { state, dispatch } = useMatch();

  const handleNewMatch = () => {
    if (window.confirm('Start a new match? All current data will be lost.')) {
      dispatch({ type: 'RESET_MATCH' });
    }
  };

  return (
    <div className="App">
      <Header onNewMatch={handleNewMatch} />
      
      <main className="main-content">
        {state.matchStatus === 'setup' && <MatchSetup />}
        {state.matchStatus === 'toss' && <TossSetup />}
        {state.matchStatus === 'teamSetup' && <TeamSetup />}
        {(state.matchStatus === 'innings1' || state.matchStatus === 'innings2') && <Scoreboard />}
        {state.matchStatus === 'completed' && <MatchSummary />}
      </main>
    </div>
  );
}

function App() {
  return (
    <MatchProvider>
      <AppContent />
    </MatchProvider>
  );
}

export default App;
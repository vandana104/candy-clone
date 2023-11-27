import React, { createContext, useContext, useReducer } from "react";

const initialGameState = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  score: 0,
  movesRemaining: 25,
};

const GameContext = createContext();

const checkWin = (state) => {
  if (state.score >= 1125) {
    return "won";
  } else if (state.movesRemaining === 0) {
    return "lost";
  }
  return null;
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case "GAME_WON":
      return {
        ...state,
        gamesPlayed: state.gamesPlayed + 1,
        gamesWon: state.gamesWon + 1,
      };
    case "GAME_LOST":
      return {
        ...state,
        gamesPlayed: state.gamesPlayed + 1,
        gamesLost: state.gamesLost + 1,
      };
    case "INCREMENT_SCORE":
      const newScore = state.score + action.points;
      const movesRemaining = state.movesRemaining - 1;
      const winStatus =
        checkWin({ ...state, score: newScore, movesRemaining }) ||
        (movesRemaining === 0 && newScore >= 1125 ? "won" : null);
      return {
        ...state,
        score: newScore,
        movesRemaining,
        winStatus,
      };
    default:
      return state;
  }
};

const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

export { GameProvider, useGameContext };

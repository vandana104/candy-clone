import GameBoard from "./Components/Main/GameBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GameProvider } from "./utils/GameContext";
function App() {
  return (
    <div className="App">
      <GameProvider>
      <DndProvider backend={HTML5Backend}>
        <GameBoard/>

         
      </DndProvider>
      </GameProvider>

      
    </div>
  );
}

export default App;

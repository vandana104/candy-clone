import GameBoard from "./Components/Main/GameBoard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GameProvider } from "./utils/GameContext";
import Slider from "./Slider/Slider";
import InputFiled from "./InputField/InputFiled";
function App() {
  return (
    <div className="App">
      {/* <GameProvider>
      <DndProvider backend={HTML5Backend}>
        <GameBoard/>

         
      </DndProvider>
      </GameProvider> */}

      <InputFiled/>

    </div>
  );
}

export default App;

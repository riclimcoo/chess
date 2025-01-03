import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Board } from "./Board";
import { Center } from "./Center";
import BoardModel from "./model/BoardModel";

function App() {
  const [board, setBoard] = useState<BoardModel>(BoardModel.defaultSetup());

  return (
    <div>
      <Center>
        <Board boardModel={board} setBoardModel={setBoard} />

        <div className="flex flex-col bg-slate-200 p-4 rounded-md shadow-md">
          <p>Game state: {board.state}</p>
          <p>Repetitions: {board.repetitionCount}</p>
        </div>
        {/* <Modal /> */}
      </Center>
    </div>
  );
}

export default App;

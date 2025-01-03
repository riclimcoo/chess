import { useRef } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Board } from "./Board";
import { Center } from "./Center";
import BoardModel from "./model/BoardModel";

function App() {
  const boardModel = useRef<BoardModel | null>(null);
  if (boardModel.current === null) {
    boardModel.current = new BoardModel();
  }

  return (
    <div>
      <Center>
        <Board boardModel={boardModel.current} />
        {/* <Modal /> */}
      </Center>
    </div>
  );
}

export default App;

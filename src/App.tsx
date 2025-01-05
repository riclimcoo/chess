import { useMemo, useState } from "react";
import "./App.css";
import { Board } from "./Board";
import { Center } from "./Center";
import BoardModel from "./model/BoardModel";
import { toast, Toaster } from "react-hot-toast";
import { PromoDialog } from "./PromoDialog";

function App() {
  const savedBoard = useMemo(
    () => BoardModel.fromJson(localStorage.getItem("boardModel")),
    []
  );
  const [board, setBoard] = useState<BoardModel>(
    savedBoard ? savedBoard : BoardModel.defaultSetup()
  );
  BoardModel.notify = toast;

  const ctx = {
    board: board,
    setBoard: setBoard,
  };

  return (
    <div>
      <Center>
        <div className="flex flex-col items-center gap-3">
          <PromoDialog color="white" />
          <Board boardModel={board} setBoardModel={setBoard} />
          <PromoDialog color={"black"} />
        </div>
        <div className="flex flex-col bg-slate-200 p-4 rounded-md shadow-md">
          <p>It's {board.activePlayer}'s turn.</p>
          <p>Game state: {board.state}</p>
          <p>Repetitions: {board.repetitionCount}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setBoard(BoardModel.defaultSetup);
              localStorage.clear();
            }}
          >
            New Game
          </button>
        </div>
        <div className="flex flex-col bg-slate-200 p-4 rounded-md shadow-md">
          <p>FEN: {board.fen} </p>
        </div>
        <Toaster />
        {/* <Modal /> */}
      </Center>
    </div>
  );
}

export default App;

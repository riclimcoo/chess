import { useMemo, useRef, useState } from "react";
import "./App.css";
import { Board } from "./Board";
import { Center } from "./Center";
import BoardModel from "./model/BoardModel";
import { toast, Toaster } from "react-hot-toast";
import { PromoDialog } from "./PromoDialog";
import { Card } from "./Card";
import { rank } from "./model/utilities";
import { Modal } from "./Modal";

export type CtxType = {
  board: BoardModel;
  setBoard: React.Dispatch<React.SetStateAction<BoardModel>>;
  play: (x: number, y: number, p?: rank | undefined) => void;
};

function App() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const savedBoard = useMemo(
    () => BoardModel.fromJson(localStorage.getItem("boardModel")),
    []
  );
  const [board, setBoard] = useState<BoardModel>(
    savedBoard ? savedBoard : BoardModel.defaultSetup()
  );
  const [propMove, setPropMove] = useState<
    [srcIdx: number, destIdx: number] | null
  >(null);

  BoardModel.notify = toast;

  const ctx: CtxType = {
    board: board,
    setBoard: setBoard,
    play: (srcIdx: number, destIdx: number, promoPiece?: rank) => {
      if (promoPiece || !board.isPromotion(srcIdx, destIdx)) {
        const nextBoard = board.play(srcIdx, destIdx, promoPiece);
        setBoard(nextBoard);
        localStorage.setItem("boardModel", JSON.stringify(nextBoard));
      } else {
        setPropMove([srcIdx, destIdx]);
        modalRef.current?.showModal();
      }
    },
  };

  function handlePromoClick(p: rank) {
    if (propMove !== null) {
      ctx.play(...propMove, p);
      modalRef.current?.close();
      setPropMove(null);
    }
  }

  return (
    <div>
      <Center>
        <div className="flex flex-col items-center gap-3">
          <Board ctx={ctx} />
        </div>
        <Card>
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
        </Card>
        {/* <Card>
          <p>FEN: {board.fen} </p>
        </Card> */}
        <Toaster />
        <Modal modalRef={modalRef}>
          Promote to:
          <PromoDialog ctx={ctx} onClick={handlePromoClick} />
        </Modal>
      </Center>
    </div>
  );
}

export default App;

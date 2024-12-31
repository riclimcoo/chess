import { useState } from "react";
import Square from "./Square";
import { PieceType } from "./utilities";
import BoardModel from "./BoardModel";

export function Board({
  activeSquare,
  setActiveSquare,
  boardModel,
  highlightedSquares,
  setHighlightedSquares,
}: {
  activeSquare: number | null;
  setActiveSquare: (x: number | null) => void;
  boardModel: BoardModel;
  highlightedSquares: Array<number>;
  setHighlightedSquares: (x: Array<number>) => void;
}) {
  const [board, setBoard] = useState<Array<PieceType>>(boardModel.flat);

  function handleClick(newIdx: number) {
    function clear() {
      setActiveSquare(null);
      setHighlightedSquares([]);
    }
    if (activeSquare == null) {
      setActiveSquare(newIdx);
      setHighlightedSquares(boardModel.validSquares(newIdx));
    } else if (highlightedSquares.includes(newIdx)) {
      boardModel.play(activeSquare, newIdx);
      setBoard(boardModel.flat);
      clear();
    } else {
      clear();
    }
  }

  function handleState(idx: number) {
    if (activeSquare == idx) {
      return "selected";
    } else if (highlightedSquares.includes(idx)) {
      return "highlighted";
    } else {
      return "unselected";
    }
  }
  return (
    <div className="grid grid-cols-8 shadow-md">
      {board.map((el, idx) => (
        <Square
          piece={el}
          idx={idx}
          selectionState={handleState(idx)}
          key={idx}
          onClick={(e: Event) => {
            e.stopPropagation();
            handleClick(idx);
          }}
        ></Square>
      ))}
    </div>
  );
}

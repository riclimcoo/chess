import { useEffect, useRef, useState } from "react";
import Square, { selectionStateType } from "./Square";
import { PieceType } from "./utilities";
import BoardModel from "./model/BoardModel";

export function Board({ boardModel }: { boardModel: BoardModel }) {
  const [board, setBoard] = useState<Array<PieceType | undefined>>(
    boardModel.flat
  );
  const boardRef = useRef<any>(null);
  const [activeSquare, setActiveSquare] = useState<number | null>(null);
  const [highlightedSquares, setHighlightedSquares] = useState<Array<number>>(
    []
  );
  function clearHighlighting() {
    setActiveSquare(null);
    setHighlightedSquares([]);
  }

  function handleClick(clickedIdx: number) {
    if (activeSquare !== null && activeSquare === clickedIdx) {
      clearHighlighting();
    } else if (
      activeSquare === null ||
      !highlightedSquares.includes(clickedIdx)
    ) {
      setActiveSquare(clickedIdx);
      setHighlightedSquares(boardModel.validSquares(clickedIdx));
    } else {
      boardModel.play(activeSquare, clickedIdx);
      updateBoard();
      clearHighlighting();
    }
  }

  function updateBoard() {
    setBoard(boardModel.flat);
    clearHighlighting();
  }

  function handleClickOutside(e: MouseEvent) {
    if (!boardRef.current?.contains(e.target)) {
      clearHighlighting();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  function handleState(idx: number): selectionStateType {
    if (activeSquare == undefined) {
      return "unselected";
    }
    if (activeSquare == idx) {
      return "selected";
    } else if (
      highlightedSquares.includes(idx) &&
      (board[idx] ||
        (boardModel.enPassantPos?.toIdx === idx &&
          boardModel.at(activeSquare)?.rank === "p"))
    ) {
      return "capturable";
    } else if (highlightedSquares.includes(idx) && board[idx] === undefined) {
      return "highlighted";
    } else {
      return "unselected";
    }
  }

  return (
    <div className="grid grid-cols-8 shadow-md" ref={boardRef}>
      {[...Array(64)].map((_, idx) => (
        <Square
          piece={board.at(idx)}
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

import { useEffect, useRef, useState } from "react";
import Square, { selectionStateType } from "./Square";
import BoardModel from "./model/BoardModel";

export function Board({
  boardModel,
  setBoardModel,
}: {
  boardModel: BoardModel;
  setBoardModel: (b: BoardModel) => void;
}) {
  const board = boardModel.flat;
  const boardHtmlRef = useRef<any>(null);
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
      setBoardModel(boardModel.play(activeSquare, clickedIdx));
      clearHighlighting();
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (!boardHtmlRef.current?.contains(e.target)) {
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
    if (activeSquare === null) {
      return "unselected";
    } else if (activeSquare === idx) {
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
    <div className="grid grid-cols-8 shadow-md" ref={boardHtmlRef}>
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

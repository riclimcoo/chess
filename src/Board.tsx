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
    console.log(boardModel);
    if (activeSquare !== null && activeSquare === clickedIdx) {
      clearHighlighting();
    } else if (
      activeSquare === null ||
      !highlightedSquares.includes(clickedIdx)
    ) {
      setActiveSquare(clickedIdx);
      setHighlightedSquares(boardModel.validSquares(clickedIdx));
    } else {
      const nextBoard = boardModel.play(activeSquare, clickedIdx);
      setBoardModel(nextBoard);
      localStorage.setItem("boardModel", JSON.stringify(nextBoard));
      // update();
      clearHighlighting();
    }
  }

  // function update() {
  //   console.log("update");
  //   localStorage.setItem("boardModel", JSON.stringify(boardModel));
  // }

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
      return "green";
    } else if (
      highlightedSquares.includes(idx) &&
      (board[idx] ||
        (boardModel.enPassantPos?.toIdx === idx &&
          boardModel.at(activeSquare)?.rank === "p"))
    ) {
      return "red";
    } else if (highlightedSquares.includes(idx) && board[idx] === undefined) {
      return "yellow";
    } else {
      return "unselected";
    }
  }

  return (
    <div
      className="grid grid-cols-8 grid-rows-8 shadow-md rounded-sm overflow-hidden"
      ref={boardHtmlRef}
    >
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
        />
      ))}
    </div>
  );
}

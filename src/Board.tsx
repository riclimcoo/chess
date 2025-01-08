import { useEffect, useRef, useState } from "react";
import Square, { selectionStateType } from "./Square";
import { CtxType } from "./App";

export function Board({ ctx }: { ctx: CtxType }) {
  const board = ctx.board.flat;
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
      setHighlightedSquares(ctx.board.validSquares(clickedIdx));
    } else {
      ctx.play(activeSquare, clickedIdx);
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
      return "green";
    } else if (
      highlightedSquares.includes(idx) &&
      (board[idx] ||
        (ctx.board.enPassantPos?.toIdx === idx &&
          ctx.board.at(activeSquare)?.rank === "p"))
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

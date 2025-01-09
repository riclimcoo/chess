import { PieceType, FancyPiece } from "./model/utilities";

export type selectionStateType = "green" | "unselected" | "yellow" | "red";

export default function Square({
  piece,
  idx = 0,
  selectionState = "unselected",
  onClick,
}: {
  piece: PieceType | undefined;
  idx?: number;
  selectionState?: selectionStateType;
  onClick: (e: any) => void;
}) {
  // const isWhite = (idx + Math.trunc(idx / 8)) % 2 === 0;

  function getClassName(idx: number) {
    const className = "chess size-10 rounded-none text-black text-4xl ";
    const defaultColorClass =
      (idx + Math.trunc(idx / 8)) % 2 === 0 ? "bg-white" : "bg-slate-400"; // Implements the checkerboard pattern
    return className + " " + defaultColorClass;
  }

  function getHighlightingClass(selectionState: selectionStateType) {
    const className =
      "size-10 border-2 border-transparent inline-block box-border hover:border-indigo-500";

    let colorsClass;
    switch (selectionState) {
      case "green":
        colorsClass = "bg-opacity-80 bg-green-300";
        break;
      case "unselected":
        colorsClass = "bg-transparent";
        break;
      case "yellow":
        colorsClass = "bg-opacity-80 bg-yellow-200";
        break;
      case "red":
        colorsClass = "bg-opacity-80 bg-red-200";
        break;
    }
    return className + " " + colorsClass;
  }

  const className = getClassName(idx);
  return (
    <button className={className} onClick={onClick}>
      <div className={getHighlightingClass(selectionState)}>
        <span>{piece && FancyPiece[piece]}</span>
      </div>
    </button>
  );
}

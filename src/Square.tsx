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
    const className =
      "chess size-10 rounded-none text-black text-4xl min-w-10 box-border ";
    const defaultColorClass =
      (idx + Math.trunc(idx / 8)) % 2 === 0
        ? "bg-white border-white"
        : "bg-slate-400 border-slate-400"; // Implements the checkerboard pattern
    return className + " " + defaultColorClass;
  }

  function getHighlightingClass(selectionState: selectionStateType) {
    const className =
      "border-opacity-0 size-10 hover:border-2 border-indigo-500 hover:border-opacity-100 inline-block";

    let colorsClass;
    switch (selectionState) {
      case "green":
        colorsClass = "bg-opacity-80 bg-green-300";
        break;
      case "unselected":
        colorsClass = "bg-opacity-0";
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
        <span className="inline-block">{piece && FancyPiece[piece]}</span>
      </div>
    </button>
  );
}

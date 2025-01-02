import { PieceType, FancyPiece } from "./utilities";

export type selectionStateType =
  | "selected"
  | "unselected"
  | "highlighted"
  | "capturable";

export default function Square({
  piece,
  idx,
  selectionState,
  onClick,
}: {
  piece: PieceType | undefined;
  idx: number;
  selectionState: selectionStateType;
  onClick: any;
}) {
  const className = getClassName(idx);
  return (
    <button className={className} onClick={onClick}>
      <div className={getHighlightingClass(selectionState)}>
        <span className="inline-block">{piece && FancyPiece[piece]}</span>
      </div>
    </button>
  );
}

function getClassName(idx: number) {
  const className = "chess size-10 rounded-none text-black text-4xl";
  const defaultColorClass =
    (idx + Math.trunc(idx / 8)) % 2 === 0 ? "bg-white" : "bg-slate-400"; // Implements the checkerboard pattern
  return className + " " + defaultColorClass;
}

function getHighlightingClass(selectionState: selectionStateType) {
  const className = "size-10 border-indigo-500 hover:border-2";
  let colorsClass;
  switch (selectionState) {
    case "selected":
      colorsClass = "bg-opacity-50 bg-green-300";
      break;
    case "unselected":
      colorsClass = "bg-opacity-0";
      break;
    case "highlighted":
      colorsClass = "bg-opacity-50 bg-yellow-200";
      break;
    case "capturable":
      colorsClass = "bg-opacity-50 bg-red-200";
      break;
  }
  return className + " " + colorsClass;
}

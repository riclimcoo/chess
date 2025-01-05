import { playerColor, PieceType } from "./model/utilities";
import Square from "./Square";

export function PromoDialog({ color }: { color: playerColor }) {
  const pieces =
    color === "white" ? ["Q", "N", "R", "B"] : ["q", "n", "r", "b"];
  return (
    <div className="shadow-md rounded-md overflow-hidden">
      {pieces.map((p) => {
        return <Square key={p} piece={p as PieceType} onClick={() => "a"} />;
      })}
    </div>
  );
}

import { CtxType } from "./App";
import { PieceType, rank } from "./model/utilities";
import Square from "./Square";

export function PromoDialog({
  ctx,
  onClick,
}: {
  ctx: CtxType;
  onClick: (p: rank) => void;
}) {
  const pieces: Array<PieceType> = (
    ctx.board.activePlayer === "white"
      ? ["Q", "N", "R", "B"]
      : ["q", "n", "r", "b"]
  ) as Array<PieceType>;
  return (
    <div className="shadow-md rounded-md overflow-hidden">
      {pieces.map((p) => {
        return (
          <Square
            key={p}
            piece={p}
            onClick={() => onClick(p.toLowerCase() as rank)}
          />
        );
      })}
    </div>
  );
}

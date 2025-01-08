import { Piece } from "./Piece";
import { disp, Position } from "./Position";
import {
  DIAG,
  flipColor,
  isNumericChar,
  isPieceChar,
  KNIGHT_LS,
  ORTHO,
  PieceType,
  playerColor,
  quot,
  rank,
  STAR,
} from "./utilities";

export type GameState =
  | "WHITE WON"
  | "BLACK WON"
  | "DRAW"
  | "ONGOING"
  | "STALEMATE";

export type MoveType = "regular" | "promotion" | "capture";

type DryBoard = { prev: DryBoard };

export default class BoardModel {
  board: Array<Piece | undefined>;
  enPassantPos: Position | undefined;
  private enPassantColor: playerColor | undefined;
  activePlayer: playerColor;
  castlingRights: {
    white: {
      queenSide: boolean;
      kingSide: boolean;
    };
    black: {
      queenSide: boolean;
      kingSide: boolean;
    };
  };
  prev: BoardModel | undefined;

  constructor() {
    this.board = Array(64);
    this.activePlayer = "white";
    this.castlingRights = {
      white: {
        queenSide: true,
        kingSide: true,
      },
      black: {
        queenSide: true,
        kingSide: true,
      },
    };
    this.prev = undefined;
  }

  static defaultSetup() {
    const boardModel = new BoardModel();
    boardModel.readFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    return boardModel;
  }

  readFen(fen: string) {
    this.board = Array(64);
    const arr = fen.split("");
    let i = 0;
    let j = 0;
    let ch = arr.shift();
    while (ch) {
      if (isNumericChar(ch)) {
        i += Number(ch);
      } else if (isPieceChar(ch)) {
        this.board[i + j * 8] = new Piece(ch as PieceType);
        i += 1;
      } else if (ch === "/") {
        i = 0;
        j += 1;
      }
      ch = arr.shift();
    }
  }

  get fen() {
    let fen = "";
    let emptySpaces = 0;
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        const piece = this.at(i + 8 * j);
        if (piece) {
          if (emptySpaces > 0) {
            fen += emptySpaces.toString();
            emptySpaces = 0;
          }
          fen += piece.type;
        } else {
          emptySpaces += 1;
        }
      }
      if (emptySpaces > 0) {
        fen += emptySpaces.toString();
        emptySpaces = 0;
      }
      if (j !== 7) {
        fen += "/";
      }
    }
    return fen;
  }

  get state(): GameState {
    if (this.repetitionCount >= 3) {
      return "DRAW";
    }
    if (!this.hasValidMoves(this.activePlayer)) {
      if (this.underCheck(this.activePlayer)) {
        return this.activePlayer === "black" ? "WHITE WON" : "BLACK WON";
      } else {
        return "STALEMATE";
      }
    }
    return "ONGOING";
  }

  private hasValidMoves(color: playerColor) {
    for (let i = 0; i < 64; i++) {
      if (this.board[i]?.color === color && this.validSquares(i).length > 0) {
        return true;
      }
    }
    return false;
  }

  get flat() {
    return this.board.map((p) => (p ? p.type : undefined));
  }

  get inactivePlayer() {
    return this.activePlayer === "white" ? "black" : "white";
  }

  at(idx: number) {
    return this.board[idx];
  }

  private atPos(pos: Position) {
    return this.board[pos.x + pos.y * 8];
  }

  private seek(pos: Position, disp: disp) {
    let candidatePos = pos.add(disp);
    const candidateArr = [];
    const piece = this.atPos(pos);
    if (piece === undefined) {
      return [];
    }
    const myColor = piece.color;
    const theirColor = piece.color === "white" ? "black" : "white";
    while (
      candidatePos.isValid &&
      this.atPos(candidatePos)?.color !== myColor
    ) {
      candidateArr.push(candidatePos);
      if (this.atPos(candidatePos)?.color === theirColor) {
        break;
      }
      candidatePos = candidatePos.add(disp);
    }
    return candidateArr.map((p) => p.toIdx);
  }

  private seekFromDispArr(pos: Position, disps: Array<disp>) {
    return disps.map((disp) => this.seek(pos, disp as disp)).flat();
  }

  private sweepFromDispArr(pos: Position, dispArr: Array<disp>) {
    const piece = this.atPos(pos);
    if (piece === undefined) {
      return [];
    }
    const myColor = piece.color;
    return dispArr
      .map((disp) => pos.add(disp))
      .filter((p) => p.isValid)
      .map((p) => p.toIdx)
      .filter((p) => {
        const piece = this.at(p);
        return piece === undefined || piece.color !== myColor;
      });
  }

  _place(piece: Piece | undefined, dest_idx: number) {
    this.board[dest_idx] = piece;
  }

  get copy() {
    const copy = new BoardModel();
    copy.board = this.board.slice();
    copy.enPassantPos = this.enPassantPos;
    copy.castlingRights = {
      white: {
        queenSide: this.castlingRights.white.queenSide,
        kingSide: this.castlingRights.white.kingSide,
      },
      black: {
        queenSide: this.castlingRights.black.kingSide,
        kingSide: this.castlingRights.black.queenSide,
      },
    };
    copy.activePlayer = this.activePlayer;
    copy.prev = this;
    return copy;
  }

  move(mover_idx: number, dest_idx: number) {
    const piece = this.at(mover_idx);
    if (piece === undefined) {
      return;
    }
    // enpassant
    else if (
      piece.rank === "p" &&
      this.enPassantPos &&
      dest_idx === this.enPassantPos.toIdx
    ) {
      const forwardDir = piece.color === "white" ? -1 : 1;
      this._place(undefined, this.enPassantPos.add([0, -forwardDir]).toIdx);
    }
    // castle
    const didCastle =
      piece.rank === "k" && Math.abs((mover_idx % 8) - (dest_idx % 8)) > 1;
    if (didCastle) {
      const side = dest_idx - mover_idx > 0 ? "kingSide" : "queenSide";
      const dir = side === "kingSide" ? 1 : -1;
      const rookIdx = new Position(
        side === "queenSide" ? 0 : 7,
        piece.color === "black" ? 0 : 7
      ).toIdx;
      const rookDest = Position.fromIdx(dest_idx).add([-dir, 0]).toIdx;
      this.move(rookIdx, rookDest);
    }
    this._place(piece, dest_idx);
    this._place(undefined, mover_idx);
  }

  isPromotion(mover_idx: number, dest_idx: number) {
    const lastRow = this.at(mover_idx)?.color === "white" ? 0 : 7;
    if (this.at(mover_idx)?.rank === "p" && quot(dest_idx, 8) === lastRow) {
      return true;
    } else {
      return false;
    }
  }

  play(mover_idx: number, dest_idx: number, promoRank: rank = "q") {
    if (
      !this.isValidMove(mover_idx, dest_idx) &&
      this.at(mover_idx)?.color === this.activePlayer
    ) {
      BoardModel.notify("That's not a valid move.");
      return this;
    } else if (!(this.at(mover_idx)?.color === this.activePlayer)) {
      BoardModel.notify("It's not your turn");
      return this;
    } else if (this.at(dest_idx)?.rank === "k") {
      BoardModel.notify("You cannot capture the King");
      return this;
    } else {
      return this.copy._play(mover_idx, dest_idx, promoRank);
    }
  }

  private _play(mover_idx: number, dest_idx: number, promoRank: rank = "q") {
    const piece = this.at(mover_idx);
    const pos = Position.fromIdx(mover_idx);
    if (piece === undefined) {
      BoardModel.notify("Trying to move an empty piece");
      return this;
    } else if (piece.color !== this.activePlayer) {
      BoardModel.notify("It's not your turn.");
      return this;
    }

    // promotion
    const lastRow = piece.color === "white" ? 0 : 7;
    if (piece.rank === "p" && quot(dest_idx, 8) === lastRow) {
      const promoPiece = (
        piece.color === "white" ? promoRank.toUpperCase() : promoRank
      ) as PieceType;
      this._place(new Piece(promoPiece), dest_idx);
      this._place(undefined, mover_idx);
    }
    // move
    else {
      this.move(mover_idx, dest_idx);
    }
    // move must go before en passant memo

    // en passant memo
    {
      const startingRow = piece.color === "white" ? 6 : 1;
      const forwardDir = piece.color === "white" ? -1 : 1;
      const posInFront = pos.add([0, forwardDir]);
      const posIn2Front = pos.add([0, 2 * forwardDir]);
      if (
        piece.rank === "p" &&
        pos.y === startingRow &&
        dest_idx === posIn2Front.toIdx
      ) {
        this.enPassantPos = posInFront;
        this.enPassantColor = piece.color;
      } else {
        this.enPassantPos = undefined;
        this.enPassantColor = undefined;
      }
    }

    // castle memo
    if (piece.rank === "k") {
      this.castlingRights[piece.color].kingSide = false;
      this.castlingRights[piece.color].queenSide = false;
    }
    if (
      piece.rank === "r" &&
      mover_idx === (piece.color === "black" ? 0 : 7) * 8
    ) {
      this.castlingRights[piece.color].queenSide = false;
    }
    if (
      piece.rank === "r" &&
      mover_idx === 7 + (piece.color === "black" ? 0 : 7) * 8
    ) {
      this.castlingRights[piece.color].kingSide = false;
    }

    this.activePlayer = this.inactivePlayer;
    return this;
  }

  equal(that: BoardModel) {
    for (let i = 0; i < 64; i++) {
      if (this.board[i]?.type !== that.board[i]?.type) {
        return false;
      }
    }
    if (
      this.enPassantPos?.x !== that.enPassantPos?.x ||
      this.enPassantPos?.y !== that.enPassantPos?.y
    ) {
      return false;
    }
    return true;
  }

  get repetitionCount() {
    let curr: BoardModel | undefined = this;
    let repCount = 0;
    while (curr) {
      if (curr.equal(this)) {
        repCount += 1;
      }
      curr = curr.prev;
    }
    return repCount;
  }

  controlledSquares(piece: Piece, posIdx: number) {
    const pos = Position.fromIdx(posIdx);
    const forwardDir = piece.color === "white" ? -1 : 1;
    const PAWN_V = [
      [1, forwardDir],
      [-1, forwardDir],
    ] as Array<disp>;

    switch (piece.rank) {
      case "p":
        return this.sweepFromDispArr(pos, PAWN_V);

      case "n":
        return this.sweepFromDispArr(pos, KNIGHT_LS);

      case "k":
        return this.sweepFromDispArr(pos, STAR);

      case "r":
        return this.seekFromDispArr(pos, ORTHO);

      case "b":
        return this.seekFromDispArr(pos, DIAG);

      case "q":
        return this.seekFromDispArr(pos, STAR);
    }
  }

  validSquares(idx: number) {
    const activePiece = this.at(idx);
    if (activePiece === undefined) {
      return [];
    }
    const myColor = activePiece.color;
    const pos = Position.fromIdx(idx);

    let validSquares;
    switch (activePiece.rank) {
      case "p":
        validSquares = this.pawnValidSquares(idx);
        break;
      case "k":
        // castle logic
        validSquares = this.controlledSquares(activePiece, idx);
        if (this.canCastle(myColor, "queenSide")) {
          validSquares.push(pos.add([-2, 0]).toIdx);
        }
        if (this.canCastle(myColor, "kingSide")) {
          validSquares.push(pos.add([2, 0]).toIdx);
        }
        break;
      default:
        // controlled squares are the same as valid squares for most pieces
        validSquares = this.controlledSquares(activePiece, idx);
        break;
    }

    // Filter out the moves that cause checks
    validSquares = validSquares.filter(
      (destIdx) => !this.causesCheck(idx, destIdx, myColor)
    );

    return validSquares;
  }

  isValidMove(moverIdx: number, destIdx: number) {
    return this.validSquares(moverIdx).includes(destIdx);
  }

  causesCheck(moverIdx: number, destIdx: number, color: playerColor) {
    const tempGame = this.copy;
    tempGame.move(moverIdx, destIdx);
    return tempGame.underCheck(color);
  }

  private pawnValidSquares(idx: number) {
    const activePiece = this.at(idx);
    if (activePiece === undefined || activePiece.rank !== "p") {
      throw new Error("That's not a pawn.");
    }
    const pos = Position.fromIdx(idx);
    const theirColor = activePiece.color === "white" ? "black" : "white";
    const forwardDir = activePiece.color === "white" ? -1 : 1;
    const startingRow = activePiece.color === "white" ? 6 : 1;
    const posInFront = pos.add([0, forwardDir]);
    const posInFront2 = posInFront.add([0, forwardDir]);
    const pawnCapturePos = [
      [1, forwardDir],
      [-1, forwardDir],
    ]
      .map((disp) => pos.add(disp as disp))
      .filter(
        (p) =>
          p.isValid &&
          (this.atPos(p)?.color === theirColor || // capture enemy
            (p.eq(this.enPassantPos) &&
              this.atPos(p) === undefined &&
              this.enPassantColor !== activePiece.color)) // en passant
      );

    let arr: Array<Position> = [];
    if (this.atPos(posInFront) === undefined) {
      arr.push(posInFront);
      if (pos.y === startingRow && this.atPos(posInFront2) === undefined) {
        arr.push(posInFront2);
      }
    }
    arr = arr.concat(pawnCapturePos);
    // arr = arr.filter((pos) => this.atPos(pos)?.color !== myColor);
    return arr.map((pos) => pos.toIdx);
  }

  findKingIdx(color: playerColor) {
    for (let i = 0; i < 64; i++) {
      const piece = this.at(i);
      if (piece && piece.color === color && piece.rank === "k") {
        return i;
      }
    }
    throw new Error("No king found");
  }

  underCheck(color: playerColor) {
    return !this.safe(this.findKingIdx(color), color);
  }

  safe(idx: number, color: playerColor) {
    for (let i = 0; i < 64; i++) {
      const piece = this.at(i);
      if (
        piece &&
        piece.color === flipColor(color) &&
        this.controlledSquares(piece, i).includes(idx)
      ) {
        return false;
      }
    }
    return true;
  }

  canCastle(color: playerColor, side: "queenSide" | "kingSide") {
    if (this.castlingRights[color][side] === false) {
      return false;
    }

    const kingIdx = this.findKingIdx(color);
    const pos = Position.fromIdx(kingIdx);
    const disps: Array<disp> =
      side === "queenSide"
        ? [
            [-3, 0],
            [-2, 0],
            [-1, 0],
          ]
        : [
            [1, 0],
            [2, 0],
          ];
    return disps
      .map((disp) => pos.add(disp).toIdx)
      .every((p) => this.at(p) === undefined && this.safe(p, color));
  }

  static fromJson(json: string | null) {
    if (json === null) return null;
    return this.hydrate(JSON.parse(json));
  }

  private static hydrate(dryBoard: DryBoard | undefined) {
    if (dryBoard === undefined || dryBoard === null) {
      return undefined;
    }
    let newObj = new BoardModel();
    console.log("Creating new");
    console.log(newObj);
    const hydratedObj = { ...newObj, ...dryBoard } as BoardModel;
    Object.setPrototypeOf(hydratedObj, this.prototype);
    hydratedObj.prev = this.hydrate(dryBoard.prev);
    hydratedObj.board = hydratedObj.board.map((p) =>
      p === undefined || p === null ? undefined : new Piece(p.type)
    );
    console.log("hydrating");
    console.log(hydratedObj);
    return hydratedObj;
  }

  static notify(msg: string) {
    console.error(msg);
  }
}

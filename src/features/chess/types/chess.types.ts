export type PieceColor = 'w' | 'b';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type PromotionPieceType = 'q' | 'r' | 'b' | 'n';

export type FileChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type RankChar = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Square = `${FileChar}${RankChar}`;

export interface BoardPiece {
  /** Unique persistent physical piece ID across the match */
  id: string;
  /** Current piece identity (determines how it moves) */
  type: PieceType;
  /** Original piece identity at the start of the match */
  originalType: PieceType;
  /** Owner color */
  color: PieceColor;
  /** Current board square */
  square: Square;
  /** Number of times this physical piece has swapped its identity */
  swapCount: number;
}

export interface SwapEvent {
  /** Whether an exchange took place on this move */
  occurred: boolean;
  /** Square of the piece that just moved */
  movedSquare: Square;
  /** Square of the friendly partner piece that swapped with it (null if no swap) */
  partnerSquare: Square | null;
  /** Identity of the moved piece BEFORE the swap (after promotion, if any) */
  movedPieceBefore: PieceType;
  /** Identity of the moved piece AFTER the swap */
  movedPieceAfter: PieceType;
  /** Identity of the partner piece BEFORE the swap */
  partnerPieceBefore: PieceType | null;
  /** Identity of the partner piece AFTER the swap */
  partnerPieceAfter: PieceType | null;
  /** Color of the player whose pieces swapped */
  color: PieceColor;
  /** Reason if no swap occurred */
  noSwapReason?: 'king-moved' | 'no-eligible-partner';
  /** Playful Spanish headline notification */
  headline: string;
  /** Detailed truthful description of the exchange */
  description: string;
}

export interface CapturedPieceRecord {
  id: string;
  /** Identity of the piece at the exact moment it was captured */
  type: PieceType;
  /** Original identity of the physical piece */
  originalType: PieceType;
  /** Color of the captured piece */
  color: PieceColor;
  /** Square where it was captured */
  capturedOn: Square;
  /** Turn number when captured */
  moveNumber: number;
}

export interface MoveRecord {
  /** Sequential ply index (1-based) */
  ply: number;
  /** Full move number (1, 2, 3...) */
  moveNumber: number;
  /** Player who made the move */
  color: PieceColor;
  /** Origin square */
  from: Square;
  /** Destination square */
  to: Square;
  /** Piece identity that made the move */
  pieceMoved: PieceType;
  /** Standard Algebraic Notation before the swap */
  san: string;
  /** Captured piece type, if any */
  captured?: PieceType;
  /** Promotion piece type, if promoted */
  promotion?: PromotionPieceType;
  /** Swap event triggered by this move */
  swap: SwapEvent;
  /** Resulting FEN after both move and swap */
  fenAfter: string;
  /** Whether the resulting position after the swap puts the opponent in check */
   resultedInCheck: boolean;
  /** Whether the resulting position after the swap is checkmate */
  resultedInCheckmate: boolean;
}

export type MatchOutcomeType =
  | 'active'
  | 'check'
  | 'checkmate'
  | 'stalemate'
  | 'draw-insufficient'
  | 'draw-fifty-move'
  | 'draw-repetition'
  | 'resignation';

export interface MatchStatus {
  outcome: MatchOutcomeType;
  isGameOver: boolean;
  inCheck: boolean;
  checkedKingSquare: Square | null;
  winner: PieceColor | 'draw' | null;
  statusMessage: string;
}

export interface CastlingTracking {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

export interface GameStateSnapshot {
  /** Authoritative FEN after the latest completed turn (including swap) */
  fen: string;
  /** Active player to move next */
  turn: PieceColor;
  /** 64-square map of physical pieces with their current identities and metadata */
  pieces: Partial<Record<Square, BoardPiece>>;
  /** Castling availability tracking */
  castling: CastlingTracking;
  /** Captured pieces grouped by the color of the captured piece */
  capturedPieces: {
    w: CapturedPieceRecord[];
    b: CapturedPieceRecord[];
  };
  /** Chronological move history */
  moveHistory: MoveRecord[];
  /** Latest swap event for UI animation and notification */
  lastSwap: SwapEvent | null;
  /** Last move squares for highlighting */
  lastMove: { from: Square; to: Square } | null;
  /** Current match status */
  status: MatchStatus;
  /** Position FEN occurrence counts for threefold repetition detection */
  positionCounts: Record<string, number>;
}

export interface LegalMoveOption {
  from: Square;
  to: Square;
  san: string;
  isCapture: boolean;
  isPromotion: boolean;
  isEnPassant: boolean;
  isCastling: boolean;
  /** Deterministic preview of which square will swap if this move is played */
  predictedSwapPartner: Square | null;
}

export interface LocalPreferences {
  autoRotateBoard: boolean;
  boardOrientation: PieceColor;
  showSwapPreview: boolean;
  showCoordinates: boolean;
  whitePlayerName: string;
  blackPlayerName: string;
}

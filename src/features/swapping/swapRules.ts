import type {
  BoardPiece,
  FileChar,
  PieceColor,
  PieceType,
  RankChar,
  Square,
} from '../chess/types/chess.types';

export const FILES: readonly FileChar[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS: readonly RankChar[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const PIECE_NAMES_ES: Record<PieceType, string> = {
  p: 'Peón',
  n: 'Caballo',
  b: 'Alfil',
  r: 'Torre',
  q: 'Dama',
  k: 'Rey',
};

export const PIECE_WITH_ARTICLE_ES: Record<PieceType, string> = {
  p: 'un peón',
  n: 'un caballo',
  b: 'un alfil',
  r: 'una torre',
  q: 'una dama',
  k: 'un rey',
};

export const PIECE_YOUR_ES: Record<PieceType, string> = {
  p: 'Tu peón',
  n: 'Tu caballo',
  b: 'Tu alfil',
  r: 'Tu torre',
  q: 'Tu dama',
  k: 'Tu rey',
};

export const PIECE_VALUES: Record<PieceType, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

/**
 * Converts an algebraic square (e.g. "e4") into 0-based { fileIndex, rankIndex }.
 */
export function squareToCoords(square: Square): { fileIndex: number; rankIndex: number } {
  const fileIndex = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankIndex = square.charCodeAt(1) - '1'.charCodeAt(0);
  return { fileIndex, rankIndex };
}

/**
 * Returns true if the square is on Rank 1 or Rank 8 (where pawns cannot legally exist).
 */
export function isPromotionOrBackRank(square: Square): boolean {
  const rank = square[1];
  return rank === '1' || rank === '8';
}

/**
 * Manhattan distance between two squares on the 8x8 board: |dx| + |dy|.
 */
export function getManhattanDistance(sqA: Square, sqB: Square): number {
  const a = squareToCoords(sqA);
  const b = squareToCoords(sqB);
  return Math.abs(a.fileIndex - b.fileIndex) + Math.abs(a.rankIndex - b.rankIndex);
}

/**
 * Canonical 0..63 index ordered by rank ascending ('1'..'8'), then file ascending ('a'..'h').
 * Guarantees a strict total ordering over all 64 squares for deterministic tie-breaking.
 */
export function getCanonicalSquareOrder(square: Square): number {
  const { fileIndex, rankIndex } = squareToCoords(square);
  return rankIndex * 8 + fileIndex;
}

/**
 * Evaluates all variant rules to determine if `candidate` can swap identities
 * with the piece that just moved to `movedSquare`.
 *
 * Variant Rules enforced:
 * - Must belong to the same player (`color === moverColor`).
 * - Must not be the moved piece itself (`candidate.square !== movedSquare`).
 * - Neither the moved piece nor the candidate can be a King (`type !== 'k'`).
 * - Must have a DIFFERENT piece identity (`candidate.type !== movedPieceType`) so an exchange occurs.
 * - Pawns must NEVER end up on rank 1 or rank 8:
 *   - If `movedPieceType === 'p'`, `candidate.square` cannot be on rank 1 or 8.
 *   - If `candidate.type === 'p'`, `movedSquare` cannot be on rank 1 or 8.
 */
export function isEligibleSwapPartner(
  movedSquare: Square,
  movedPieceType: PieceType,
  candidate: BoardPiece,
  moverColor: PieceColor
): boolean {
  // Rule 6: Kings never participate in identity exchanges
  if (movedPieceType === 'k' || candidate.type === 'k') {
    return false;
  }

  // Must belong to the same player
  if (candidate.color !== moverColor) {
    return false;
  }

  // Cannot swap with itself
  if (candidate.square === movedSquare) {
    return false;
  }

  // Must have a different identity so the swap actually changes both pieces
  if (candidate.type === movedPieceType) {
    return false;
  }

  // Rule 8: Pawns must never end up on an invalid rank (rank 1 or rank 8)
  if (movedPieceType === 'p' && isPromotionOrBackRank(candidate.square)) {
    return false;
  }

  if (candidate.type === 'p' && isPromotionOrBackRank(movedSquare)) {
    return false;
  }

  return true;
}

/**
 * Deterministic comparator for selecting the unique exchange partner among eligible candidates:
 * 1. Smallest Manhattan distance (`|df| + |dr|`) from `movedSquare`.
 * 2. Tie-breaker: Canonical square order (rank 1 -> 8, file a -> h).
 */
export function compareSwapCandidates(
  movedSquare: Square,
  a: BoardPiece,
  b: BoardPiece
): number {
  const distA = getManhattanDistance(movedSquare, a.square);
  const distB = getManhattanDistance(movedSquare, b.square);
  if (distA !== distB) {
    return distA - distB;
  }
  return getCanonicalSquareOrder(a.square) - getCanonicalSquareOrder(b.square);
}

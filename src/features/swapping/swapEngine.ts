import type {
  BoardPiece,
  CastlingTracking,
  FileChar,
  PieceColor,
  PieceType,
  RankChar,
  Square,
  SwapEvent,
} from '../chess/types/chess.types';
import { buildSwapNotification } from './swapNotifications';
import {
  compareSwapCandidates,
  FILES,
  isEligibleSwapPartner,
  RANKS,
} from './swapRules';

/**
 * Deterministically selects the single exchange partner for the piece that just moved to `movedSquare`.
 * Never uses randomness. Returns `null` if no eligible partner exists.
 */
export function selectDeterministicSwapPartner(
  pieces: Partial<Record<Square, BoardPiece>>,
  movedSquare: Square,
  movedPieceType: PieceType,
  moverColor: PieceColor
): BoardPiece | null {
  if (movedPieceType === 'k') {
    return null;
  }

  const eligibleCandidates: BoardPiece[] = [];

  for (const piece of Object.values(pieces)) {
    if (!piece) continue;
    if (isEligibleSwapPartner(movedSquare, movedPieceType, piece, moverColor)) {
      eligibleCandidates.push(piece);
    }
  }

  if (eligibleCandidates.length === 0) {
    return null;
  }

  eligibleCandidates.sort((a, b) => compareSwapCandidates(movedSquare, a, b));
  return eligibleCandidates[0];
}

/**
 * Executes the deterministic piece-identity exchange after a legal move has been applied on `pieces`.
 *
 * - Physical pieces stay on their respective squares (`id`, `originalType`, `square`, `color` remain on the square).
 * - Their `type` (identity & movement capability) is exchanged, and `swapCount` increments by 1.
 * - Kings never swap.
 * - Pawns never end up on rank 1 or rank 8.
 */
export function executePieceSwap(
  pieces: Partial<Record<Square, BoardPiece>>,
  movedSquare: Square,
  moverColor: PieceColor,
  plyNumber = 1
): {
  updatedPieces: Partial<Record<Square, BoardPiece>>;
  swapEvent: SwapEvent;
} {
  const movedPiece = pieces[movedSquare];
  if (!movedPiece) {
    throw new Error(`No piece found at movedSquare "${movedSquare}" during swap execution.`);
  }

  if (movedPiece.type === 'k') {
    const notification = buildSwapNotification({
      occurred: false,
      movedSquare,
      partnerSquare: null,
      movedPieceBefore: 'k',
      movedPieceAfter: 'k',
      partnerPieceBefore: null,
      partnerPieceAfter: null,
      noSwapReason: 'king-moved',
      plyNumber,
    });

    return {
      updatedPieces: { ...pieces },
      swapEvent: {
        occurred: false,
        movedSquare,
        partnerSquare: null,
        movedPieceBefore: 'k',
        movedPieceAfter: 'k',
        partnerPieceBefore: null,
        partnerPieceAfter: null,
        color: moverColor,
        noSwapReason: 'king-moved',
        headline: notification.headline,
        description: notification.description,
      },
    };
  }

  const partner = selectDeterministicSwapPartner(
    pieces,
    movedSquare,
    movedPiece.type,
    moverColor
  );

  if (!partner) {
    const notification = buildSwapNotification({
      occurred: false,
      movedSquare,
      partnerSquare: null,
      movedPieceBefore: movedPiece.type,
      movedPieceAfter: movedPiece.type,
      partnerPieceBefore: null,
      partnerPieceAfter: null,
      noSwapReason: 'no-eligible-partner',
      plyNumber,
    });

    return {
      updatedPieces: { ...pieces },
      swapEvent: {
        occurred: false,
        movedSquare,
        partnerSquare: null,
        movedPieceBefore: movedPiece.type,
        movedPieceAfter: movedPiece.type,
        partnerPieceBefore: null,
        partnerPieceAfter: null,
        color: moverColor,
        noSwapReason: 'no-eligible-partner',
        headline: notification.headline,
        description: notification.description,
      },
    };
  }

  const movedPieceBefore = movedPiece.type;
  const partnerPieceBefore = partner.type;
  const movedPieceAfter = partnerPieceBefore;
  const partnerPieceAfter = movedPieceBefore;

  const updatedPieces: Partial<Record<Square, BoardPiece>> = {
    ...pieces,
    [movedSquare]: {
      ...movedPiece,
      type: movedPieceAfter,
      swapCount: movedPiece.swapCount + 1,
    },
    [partner.square]: {
      ...partner,
      type: partnerPieceAfter,
      swapCount: partner.swapCount + 1,
    },
  };

  const notification = buildSwapNotification({
    occurred: true,
    movedSquare,
    partnerSquare: partner.square,
    movedPieceBefore,
    movedPieceAfter,
    partnerPieceBefore,
    partnerPieceAfter,
    plyNumber,
  });

  return {
    updatedPieces,
    swapEvent: {
      occurred: true,
      movedSquare,
      partnerSquare: partner.square,
      movedPieceBefore,
      movedPieceAfter,
      partnerPieceBefore,
      partnerPieceAfter,
      color: moverColor,
      headline: notification.headline,
      description: notification.description,
    },
  };
}

/**
 * Serializes the 64-square `pieces` map into the 8-rank FEN piece placement field.
 */
export function serializePiecesToFenPlacement(
  pieces: Partial<Record<Square, BoardPiece>>
): string {
  const rankStrings: string[] = [];

  for (let r = RANKS.length - 1; r >= 0; r--) {
    const rank: RankChar = RANKS[r];
    let row = '';
    let emptyRun = 0;

    for (let f = 0; f < FILES.length; f++) {
      const file: FileChar = FILES[f];
      const square: Square = `${file}${rank}`;
      const piece = pieces[square];

      if (!piece) {
        emptyRun++;
      } else {
        if (emptyRun > 0) {
          row += String(emptyRun);
          emptyRun = 0;
        }
        const symbol =
          piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
        row += symbol;
      }
    }

    if (emptyRun > 0) {
      row += String(emptyRun);
    }

    rankStrings.push(row);
  }

  return rankStrings.join('/');
}

/**
 * Computes the FEN castling field ('KQkq' or '-') by intersecting tracked castling rights
 * with whether the King and corner Rooks currently hold their required identities on their home squares.
 */
export function computeValidCastlingFenField(
  pieces: Partial<Record<Square, BoardPiece>>,
  tracking: CastlingTracking
): string {
  let result = '';

  const wKingOk = pieces.e1?.color === 'w' && pieces.e1?.type === 'k';
  if (wKingOk) {
    if (tracking.wK && pieces.h1?.color === 'w' && pieces.h1?.type === 'r') {
      result += 'K';
    }
    if (tracking.wQ && pieces.a1?.color === 'w' && pieces.a1?.type === 'r') {
      result += 'Q';
    }
  }

  const bKingOk = pieces.e8?.color === 'b' && pieces.e8?.type === 'k';
  if (bKingOk) {
    if (tracking.bK && pieces.h8?.color === 'b' && pieces.h8?.type === 'r') {
      result += 'k';
    }
    if (tracking.bQ && pieces.a8?.color === 'b' && pieces.a8?.type === 'r') {
      result += 'q';
    }
  }

  return result || '-';
}

/**
 * Computes a valid FEN en-passant target square after the swap.
 * If the double-pushed pawn swapped its identity into a non-pawn, en-passant is cleared to '-'
 * because there is no longer a pawn on the 4th/5th rank to capture en passant.
 */
export function computeValidEnPassantFenField(
  pieces: Partial<Record<Square, BoardPiece>>,
  candidateEpSquare: string,
  nextTurn: PieceColor
): string {
  if (!candidateEpSquare || candidateEpSquare === '-') {
    return '-';
  }

  const file = candidateEpSquare[0] as FileChar;
  const epRank = candidateEpSquare[1];

  // If nextTurn is Black ('b'), White just pushed a pawn to rank 4 (epSquare is on rank 3)
  if (nextTurn === 'b' && epRank === '3') {
    const pushedPawnSquare: Square = `${file}4`;
    const piece = pieces[pushedPawnSquare];
    if (piece && piece.color === 'w' && piece.type === 'p') {
      return candidateEpSquare;
    }
    return '-';
  }

  // If nextTurn is White ('w'), Black just pushed a pawn to rank 5 (epSquare is on rank 6)
  if (nextTurn === 'w' && epRank === '6') {
    const pushedPawnSquare: Square = `${file}5`;
    const piece = pieces[pushedPawnSquare];
    if (piece && piece.color === 'b' && piece.type === 'p') {
      return candidateEpSquare;
    }
    return '-';
  }

  return '-';
}

/**
 * Builds the complete, valid 6-field FEN string after a move + swap operation.
 */
export function buildPostSwapFen(params: {
  pieces: Partial<Record<Square, BoardPiece>>;
  nextTurn: PieceColor;
  castlingTracking: CastlingTracking;
  candidateEpSquare: string;
  halfMoveClock: number;
  fullMoveNumber: number;
}): string {
  const {
    pieces,
    nextTurn,
    castlingTracking,
    candidateEpSquare,
    halfMoveClock,
    fullMoveNumber,
  } = params;

  const placement = serializePiecesToFenPlacement(pieces);
  const castlingField = computeValidCastlingFenField(pieces, castlingTracking);
  const epField = computeValidEnPassantFenField(pieces, candidateEpSquare, nextTurn);

  return `${placement} ${nextTurn} ${castlingField} ${epField} ${halfMoveClock} ${fullMoveNumber}`;
}

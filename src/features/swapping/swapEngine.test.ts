import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../chess/engine/chessGameEngine';
import {
  executePieceSwap,
  selectDeterministicSwapPartner,
} from './swapEngine';
import { isEligibleSwapPartner } from './swapRules';
import type { BoardPiece, Square } from '../chess/types/chess.types';

describe('swapEngine & swapRules — Deterministic Identity Exchange', () => {
  it('selects the closest eligible friendly piece deterministically using Manhattan distance and canonical tie-breaking', () => {
    const state = createInitialGameState();
    // Simulate White moving pawn e2 -> e4
    const pieces = { ...state.pieces };
    const e2Pawn = pieces.e2!;
    delete pieces.e2;
    pieces.e4 = { ...e2Pawn, square: 'e4' };

    // From e4, White's non-pawn, non-king pieces are on rank 1 (a1, b1, c1, d1, f1, g1, h1).
    // Wait: since e4 is a PAWN ('p'), Rule 8 says a pawn CANNOT swap with any piece on rank 1 or 8!
    const partnerForPawnAtStart = selectDeterministicSwapPartner(pieces, 'e4', 'p', 'w');
    expect(partnerForPawnAtStart).toBeNull();

    // Now simulate White moving Knight g1 -> f3
    const piecesKnightMove = { ...state.pieces };
    const g1Knight = piecesKnightMove.g1!;
    delete piecesKnightMove.g1;
    piecesKnightMove.f3 = { ...g1Knight, square: 'f3' };

    // From f3 (file f, rank 3), closest friendly non-Knight, non-King piece:
    // Pawn on f2 has Manhattan distance |5-5| + |2-1| = 1!
    const partnerForKnight = selectDeterministicSwapPartner(
      piecesKnightMove,
      'f3',
      'n',
      'w'
    );
    expect(partnerForKnight).not.toBeNull();
    expect(partnerForKnight?.square).toBe('f2');
    expect(partnerForKnight?.type).toBe('p');
  });

  it('never uses randomness: repeated calls on identical board states always return the exact same partner', () => {
    const state = createInitialGameState();
    const pieces = { ...state.pieces };
    const b1Knight = pieces.b1!;
    delete pieces.b1;
    pieces.c3 = { ...b1Knight, square: 'c3' };

    const results = Array.from({ length: 25 }, () =>
      selectDeterministicSwapPartner(pieces, 'c3', 'n', 'w')?.square
    );
    const uniqueSquares = new Set(results);
    expect(uniqueSquares.size).toBe(1);
    expect(results[0]).toBe('c2');
  });

  it('uses canonical square order (rank 1->8, file a->h) when Manhattan distances are tied', () => {
    const customPieces: Partial<Record<Square, BoardPiece>> = {
      e1: { id: 'w-k-e1', type: 'k', originalType: 'k', color: 'w', square: 'e1', swapCount: 0 },
      d4: { id: 'w-n-d4', type: 'n', originalType: 'n', color: 'w', square: 'd4', swapCount: 0 },
      // Two friendly pieces at exact Manhattan distance 2 from d4:
      // d2 (distance 2, rank 2) and b4 (distance 2, rank 4) and f4 (distance 2, rank 4)
      d2: { id: 'w-b-d2', type: 'b', originalType: 'b', color: 'w', square: 'd2', swapCount: 0 },
      b4: { id: 'w-r-b4', type: 'r', originalType: 'r', color: 'w', square: 'b4', swapCount: 0 },
      f4: { id: 'w-q-f4', type: 'q', originalType: 'q', color: 'w', square: 'f4', swapCount: 0 },
    };

    const chosen = selectDeterministicSwapPartner(customPieces, 'd4', 'n', 'w');
    // d2 has lower rank (rank 2 vs rank 4), so canonical order picks d2 first
    expect(chosen?.square).toBe('d2');

    // If only b4 and f4 exist on rank 4, b4 (file b) comes before f4 (file f)
    delete customPieces.d2;
    const chosenSameRank = selectDeterministicSwapPartner(customPieces, 'd4', 'n', 'w');
    expect(chosenSameRank?.square).toBe('b4');
  });

  it('never allows the King to participate in an identity exchange (Rule 6)', () => {
    const customPieces: Partial<Record<Square, BoardPiece>> = {
      e2: { id: 'w-k-e2', type: 'k', originalType: 'k', color: 'w', square: 'e2', swapCount: 0 },
      d2: { id: 'w-q-d2', type: 'q', originalType: 'q', color: 'w', square: 'd2', swapCount: 0 },
    };

    // Moving the King never swaps
    const kingMoveSwap = executePieceSwap(customPieces, 'e2', 'w');
    expect(kingMoveSwap.swapEvent.occurred).toBe(false);
    expect(kingMoveSwap.swapEvent.noSwapReason).toBe('king-moved');
    expect(kingMoveSwap.updatedPieces.e2?.type).toBe('k');
    expect(kingMoveSwap.updatedPieces.d2?.type).toBe('q');

    // Moving the Queen when only the King is friendly does not swap with the King
    const queenMoveSwap = executePieceSwap(customPieces, 'd2', 'w');
    expect(queenMoveSwap.swapEvent.occurred).toBe(false);
    expect(queenMoveSwap.swapEvent.noSwapReason).toBe('no-eligible-partner');
    expect(queenMoveSwap.updatedPieces.e2?.type).toBe('k');
    expect(queenMoveSwap.updatedPieces.d2?.type).toBe('q');
  });

  it('never places a Pawn on Rank 1 or Rank 8 during a swap (Rule 8)', () => {
    const customPieces: Partial<Record<Square, BoardPiece>> = {
      e1: { id: 'w-k-e1', type: 'k', originalType: 'k', color: 'w', square: 'e1', swapCount: 0 },
      // A friendly Rook on a1 (Rank 1)
      a1: { id: 'w-r-a1', type: 'r', originalType: 'r', color: 'w', square: 'a1', swapCount: 0 },
      // A friendly Pawn on a4 (Rank 4)
      a4: { id: 'w-p-a4', type: 'p', originalType: 'p', color: 'w', square: 'a4', swapCount: 0 },
    };

    // Case A: Pawn moved to a4 cannot swap with Rook on a1 because a1 is on rank 1
    expect(isEligibleSwapPartner('a4', 'p', customPieces.a1!, 'w')).toBe(false);
    const pawnSwap = executePieceSwap(customPieces, 'a4', 'w');
    expect(pawnSwap.swapEvent.occurred).toBe(false);

    // Case B: Rook moved to a1 (or a8) cannot swap with Pawn on a4 because a1 is on rank 1
    expect(isEligibleSwapPartner('a1', 'r', customPieces.a4!, 'w')).toBe(false);
    const rookSwap = executePieceSwap(customPieces, 'a1', 'w');
    expect(rookSwap.swapEvent.occurred).toBe(false);
  });

  it('preserves physical piece count and multiset of piece types after an exchange (Rule 7)', () => {
    const customPieces: Partial<Record<Square, BoardPiece>> = {
      e1: { id: 'w-k-e1', type: 'k', originalType: 'k', color: 'w', square: 'e1', swapCount: 0 },
      c4: { id: 'w-b-c4', type: 'b', originalType: 'b', color: 'w', square: 'c4', swapCount: 0 },
      d2: { id: 'w-p-d2', type: 'p', originalType: 'p', color: 'w', square: 'd2', swapCount: 0 },
    };

    const { updatedPieces, swapEvent } = executePieceSwap(customPieces, 'c4', 'w');
    expect(swapEvent.occurred).toBe(true);
    expect(swapEvent.movedSquare).toBe('c4');
    expect(swapEvent.partnerSquare).toBe('d2');

    // Physical IDs stay on their squares, identities flip
    expect(updatedPieces.c4?.id).toBe('w-b-c4');
    expect(updatedPieces.c4?.type).toBe('p');
    expect(updatedPieces.d2?.id).toBe('w-p-d2');
    expect(updatedPieces.d2?.type).toBe('b');
  });
});

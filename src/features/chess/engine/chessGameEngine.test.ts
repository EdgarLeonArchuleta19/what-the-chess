import { describe, expect, it } from 'vitest';
import {
  applyMoveAndSwap,
  createInitialGameState,
  getLegalMovesForSquare,
  resignMatch,
} from './chessGameEngine';

describe('chessGameEngine — Full Move + Swap Integration', () => {
  it('initializes standard chess starting position with 32 pieces and White to move', () => {
    const state = createInitialGameState();
    expect(state.turn).toBe('w');
    expect(Object.keys(state.pieces)).toHaveLength(32);
    expect(state.status.outcome).toBe('active');
    expect(state.status.isGameOver).toBe(false);
  });

  it('validates legal moves, rejects illegal moves, and alternates turns correctly', () => {
    const state0 = createInitialGameState();

    // Illegal move: e2 -> e5
    const illegalResult = applyMoveAndSwap(state0, { from: 'e2', to: 'e5' });
    expect(illegalResult.ok).toBe(false);

    // Wrong turn: Black piece on e7 when it is White's turn
    const wrongTurnResult = applyMoveAndSwap(state0, { from: 'e7', to: 'e5' });
    expect(wrongTurnResult.ok).toBe(false);

    // Legal move: Knight g1 -> f3
    const move1 = applyMoveAndSwap(state0, { from: 'g1', to: 'f3' });
    expect(move1.ok).toBe(true);
    if (!move1.ok) return;

    const state1 = move1.nextState;
    expect(state1.turn).toBe('b');
    expect(state1.moveHistory).toHaveLength(1);
    // Knight on f3 swapped with Pawn on f2!
    expect(state1.lastSwap?.occurred).toBe(true);
    expect(state1.lastSwap?.movedSquare).toBe('f3');
    expect(state1.lastSwap?.partnerSquare).toBe('f2');
    expect(state1.pieces.f3?.type).toBe('p');
    expect(state1.pieces.f2?.type).toBe('n');

    // Now on White's next turn, f2 has a Knight and can jump like a Knight!
    const move2 = applyMoveAndSwap(state1, { from: 'b8', to: 'c6' });
    expect(move2.ok).toBe(true);
    if (!move2.ok) return;

    const state2 = move2.nextState;
    const f2LegalMoves = getLegalMovesForSquare(state2, 'f2');
    const f2Targets = f2LegalMoves.map((m) => m.to);
    // A Knight on f2 can jump to h3, g4, e4!
    expect(f2Targets).toContain('h3');
    expect(f2Targets).toContain('g4');
    expect(f2Targets).toContain('e4');
  });

  it('resolves captures properly and records captured pieces', () => {
    // Custom position where White Rook on e4 can capture Black Knight on e5 and swap with White Bishop on d4
    const fen = '4k3/8/8/4n3/3BR3/8/8/4K3 w - - 0 1';
    const state0 = createInitialGameState(fen);

    const res = applyMoveAndSwap(state0, { from: 'e4', to: 'e5' });
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const state1 = res.nextState;
    expect(state1.capturedPieces.b).toHaveLength(1);
    expect(state1.capturedPieces.b[0].type).toBe('n');
    expect(state1.capturedPieces.b[0].capturedOn).toBe('e5');

    // After capturing on e5, White's Rook on e5 swapped with White's Bishop on d4
    expect(state1.pieces.e5?.type).toBe('b');
    expect(state1.pieces.d4?.type).toBe('r');
  });

  it('handles pawn promotion followed by deterministic swap without placing a pawn on rank 8', () => {
    // White pawn on a7, White Knight on c6, White Pawn on b2, Kings on e1 and h8
    const fen = '7k/P7/2N5/8/8/8/1P6/4K3 w - - 0 1';
    const state0 = createInitialGameState(fen);

    const res = applyMoveAndSwap(state0, { from: 'a7', to: 'a8', promotion: 'q' });
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const state1 = res.nextState;
    // a8 is on rank 8, so the promoted Queen on a8 CANNOT swap with the Pawn on b2;
    // it MUST swap with the Knight on c6!
    expect(state1.lastSwap?.occurred).toBe(true);
    expect(state1.lastSwap?.partnerSquare).toBe('c6');
    expect(state1.pieces.a8?.type).toBe('n');
    expect(state1.pieces.c6?.type).toBe('q');
  });

  it('handles castling (King move) without swapping the King', () => {
    const fen = 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1';
    const state0 = createInitialGameState(fen);

    const res = applyMoveAndSwap(state0, { from: 'e1', to: 'g1' });
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const state1 = res.nextState;
    expect(state1.lastSwap?.occurred).toBe(false);
    expect(state1.lastSwap?.noSwapReason).toBe('king-moved');
    expect(state1.pieces.g1?.type).toBe('k');
    expect(state1.pieces.f1?.type).toBe('r');
  });

  it('evaluates check and checkmate AFTER the piece swap occurs', () => {
    // Black King on e8, White Queen on e2, White Pawn on d3, White King on a1.
    // If White moves Pawn d3 -> d4, it swaps with White Queen on e2!
    // Then d4 has a Queen and e2 has a Pawn -> wait, let's make e2 -> e3 or place Queen on b5 and move Pawn e3 -> e4 so e4 becomes Queen giving direct check to Black King on e8!
    const fen = '4k3/8/8/1Q6/8/4P3/8/K7 w - - 0 1';
    const state0 = createInitialGameState(fen);

    // Move White Pawn e3 -> e4. Before swap, e4 is a Pawn (no check on e8).
    // After swap with Queen on b5, e4 becomes a Queen and attacks Black King on e8!
    const res = applyMoveAndSwap(state0, { from: 'e3', to: 'e4' });
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const state1 = res.nextState;
    expect(state1.pieces.e4?.type).toBe('q');
    expect(state1.pieces.b5?.type).toBe('p');
    expect(state1.status.inCheck).toBe(true);
    expect(state1.status.outcome).toBe('check');
    expect(state1.status.checkedKingSquare).toBe('e8');
    expect(state1.moveHistory[0].san).toBe('e4+');
  });

  it('detects stalemate and draw by insufficient material', () => {
    // Undefended White Rook on e7: Black King on e8 captures e7 leaving K vs K (insufficient material)
    const fen = '4k3/4R3/8/8/8/8/8/K7 b - - 0 1';
    const state0 = createInitialGameState(fen);

    // Black King captures White Rook on e7 -> only two Kings remain
    const res = applyMoveAndSwap(state0, { from: 'e8', to: 'e7' });
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    expect(res.nextState.status.isGameOver).toBe(true);
    expect(res.nextState.status.outcome).toBe('draw-insufficient');
    expect(res.nextState.status.winner).toBe('draw');

    // Also test stalemate after move + swap
    const stalemateFen = '7k/5K2/8/6Q1/8/8/8/8 w - - 0 1';
    const stale0 = createInitialGameState(stalemateFen);
    // White Queen g5 -> g6 (no eligible swap partner since only King is friendly) leaves Black King on h8 stalemated
    const staleRes = applyMoveAndSwap(stale0, { from: 'g5', to: 'g6' });
    expect(staleRes.ok).toBe(true);
    if (!staleRes.ok) return;
    expect(staleRes.nextState.status.isGameOver).toBe(true);
    expect(staleRes.nextState.status.outcome).toBe('stalemate');
    expect(staleRes.nextState.status.winner).toBe('draw');
  });

  it('supports player resignation cleanly', () => {
    const state0 = createInitialGameState();
    const resigned = resignMatch(state0, 'w');
    expect(resigned.status.isGameOver).toBe(true);
    expect(resigned.status.outcome).toBe('resignation');
    expect(resigned.status.winner).toBe('b');
  });
});

import { Chess } from 'chess.js';
import type {
  BoardPiece,
  CapturedPieceRecord,
  CastlingTracking,
  GameStateSnapshot,
  LegalMoveOption,
  MatchStatus,
  MoveRecord,
  PieceColor,
  PieceType,
  PromotionPieceType,
  RankChar,
  Square,
} from '../types/chess.types';
import {
  buildPostSwapFen,
  executePieceSwap,
  selectDeterministicSwapPartner,
} from '../../swapping/swapEngine';
import { enrichSwapEventWithCheckStatus } from '../../swapping/swapNotifications';
import { FILES, RANKS } from '../../swapping/swapRules';

export const STANDARD_START_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Extracts normalized position key (first 4 FEN fields) for threefold repetition tracking.
 */
export function getPositionKey(fen: string): string {
  return fen.split(' ').slice(0, 4).join(' ');
}

/**
 * Finds the square of the King for a given color.
 */
export function findKingSquare(
  pieces: Partial<Record<Square, BoardPiece>>,
  color: PieceColor
): Square | null {
  for (const piece of Object.values(pieces)) {
    if (piece && piece.color === color && piece.type === 'k') {
      return piece.square;
    }
  }
  return null;
}

/**
 * Evaluates check, checkmate, stalemate, and draw conditions on the post-swap board state.
 */
export function evaluateMatchStatus(
  chess: Chess,
  pieces: Partial<Record<Square, BoardPiece>>,
  positionCounts: Record<string, number>
): MatchStatus {
  const activeTurn = chess.turn() as PieceColor;
  const inCheck = chess.inCheck();
  const checkedKingSquare = inCheck ? findKingSquare(pieces, activeTurn) : null;
  const activeColorName = activeTurn === 'w' ? 'Blancas' : 'Negras';
  const opponentColor: PieceColor = activeTurn === 'w' ? 'b' : 'w';
  const opponentColorName = opponentColor === 'w' ? 'Blancas' : 'Negras';

  if (chess.isCheckmate()) {
    return {
      outcome: 'checkmate',
      isGameOver: true,
      inCheck: true,
      checkedKingSquare,
      winner: opponentColor,
      statusMessage: `¡Jaque mate! Ganan las ${opponentColorName}.`,
    };
  }

  if (chess.isStalemate()) {
    return {
      outcome: 'stalemate',
      isGameOver: true,
      inCheck: false,
      checkedKingSquare: null,
      winner: 'draw',
      statusMessage: 'Tablas por rey ahogado (Stalemate).',
    };
  }

  if (chess.isInsufficientMaterial()) {
    return {
      outcome: 'draw-insufficient',
      isGameOver: true,
      inCheck: false,
      checkedKingSquare: null,
      winner: 'draw',
      statusMessage: 'Tablas por material insuficiente.',
    };
  }

  const fenParts = chess.fen().split(' ');
  const halfMoveClock = Number(fenParts[4] ?? 0);
  if (halfMoveClock >= 100) {
    return {
      outcome: 'draw-fifty-move',
      isGameOver: true,
      inCheck: false,
      checkedKingSquare: null,
      winner: 'draw',
      statusMessage: 'Tablas por la regla de los 50 movimientos.',
    };
  }

  const posKey = getPositionKey(chess.fen());
  if ((positionCounts[posKey] ?? 0) >= 3) {
    return {
      outcome: 'draw-repetition',
      isGameOver: true,
      inCheck: false,
      checkedKingSquare: null,
      winner: 'draw',
      statusMessage: 'Tablas por triple repetición de posición.',
    };
  }

  if (inCheck) {
    return {
      outcome: 'check',
      isGameOver: false,
      inCheck: true,
      checkedKingSquare,
      winner: null,
      statusMessage: `¡Jaque a las ${activeColorName}!`,
    };
  }

  return {
    outcome: 'active',
    isGameOver: false,
    inCheck: false,
    checkedKingSquare: null,
    winner: null,
    statusMessage: `Turno de las ${activeColorName}`,
  };
}

/**
 * Creates a fresh GameStateSnapshot from any valid FEN (defaults to standard chess starting position).
 */
export function createInitialGameState(initialFen: string = STANDARD_START_FEN): GameStateSnapshot {
  const chess = new Chess(initialFen);
  const board = chess.board();
  const pieces: Partial<Record<Square, BoardPiece>> = {};

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const cell = board[r][f];
      if (cell) {
        const square = cell.square as Square;
        pieces[square] = {
          id: `${cell.color}-${cell.type}-${square}`,
          type: cell.type as PieceType,
          originalType: cell.type as PieceType,
          color: cell.color as PieceColor,
          square,
          swapCount: 0,
        };
      }
    }
  }

  const castlingField = initialFen.split(' ')[2] ?? '-';
  const castling: CastlingTracking = {
    wK: castlingField.includes('K'),
    wQ: castlingField.includes('Q'),
    bK: castlingField.includes('k'),
    bQ: castlingField.includes('q'),
  };

  const posKey = getPositionKey(chess.fen());
  const positionCounts: Record<string, number> = { [posKey]: 1 };

  return {
    fen: chess.fen(),
    turn: chess.turn() as PieceColor,
    pieces,
    castling,
    capturedPieces: {
      w: [],
      b: [],
    },
    moveHistory: [],
    lastSwap: null,
    lastMove: null,
    status: evaluateMatchStatus(chess, pieces, positionCounts),
    positionCounts,
  };
}

/**
 * Simulates moving a piece on the board map (before swap) so we can preview its deterministic swap partner.
 */
function simulatePreSwapBoard(
  pieces: Partial<Record<Square, BoardPiece>>,
  from: Square,
  to: Square,
  flags: string,
  promotion?: PromotionPieceType
): Partial<Record<Square, BoardPiece>> {
  const nextPieces: Partial<Record<Square, BoardPiece>> = { ...pieces };
  const movingPiece = nextPieces[from];
  if (!movingPiece) return nextPieces;

  delete nextPieces[from];

  // En passant capture removes the enemy pawn behind `to`
  if (flags.includes('e')) {
    const epCaptureSq = `${to[0]}${from[1]}` as Square;
    delete nextPieces[epCaptureSq];
  }

  // Castling also repositions the friendly rook
  if (flags.includes('k')) {
    const rank = from[1] as RankChar;
    const rookFrom = `h${rank}` as Square;
    const rookTo = `f${rank}` as Square;
    const rook = nextPieces[rookFrom];
    if (rook) {
      delete nextPieces[rookFrom];
      nextPieces[rookTo] = { ...rook, square: rookTo };
    }
  } else if (flags.includes('q')) {
    const rank = from[1] as RankChar;
    const rookFrom = `a${rank}` as Square;
    const rookTo = `d${rank}` as Square;
    const rook = nextPieces[rookFrom];
    if (rook) {
      delete nextPieces[rookFrom];
      nextPieces[rookTo] = { ...rook, square: rookTo };
    }
  }

  const effectiveType: PieceType = promotion ?? movingPiece.type;
  nextPieces[to] = {
    ...movingPiece,
    square: to,
    type: effectiveType,
  };

  return nextPieces;
}

/**
 * Returns all legal moves for the piece on `square`, including deterministic swap partner preview.
 */
export function getLegalMovesForSquare(
  state: GameStateSnapshot,
  square: Square
): LegalMoveOption[] {
  if (state.status.isGameOver) {
    return [];
  }

  const piece = state.pieces[square];
  if (!piece || piece.color !== state.turn) {
    return [];
  }

  const chess = new Chess(state.fen);
  const rawMoves = chess.moves({ square, verbose: true });

  const byTargetSquare = new Map<Square, LegalMoveOption>();

  for (const m of rawMoves) {
    const to = m.to as Square;
    if (byTargetSquare.has(to)) {
      continue;
    }

    const isPromotion = Boolean(m.promotion) || m.flags.includes('p');
    const isCapture = m.flags.includes('c') || m.flags.includes('e');
    const isEnPassant = m.flags.includes('e');
    const isCastling = m.flags.includes('k') || m.flags.includes('q');

    const simulatedBoard = simulatePreSwapBoard(
      state.pieces,
      square,
      to,
      m.flags,
      isPromotion ? 'q' : undefined
    );
    const effectiveType: PieceType = isPromotion ? 'q' : piece.type;
    const partner = selectDeterministicSwapPartner(
      simulatedBoard,
      to,
      effectiveType,
      state.turn
    );

    byTargetSquare.set(to, {
      from: square,
      to,
      san: m.san,
      isCapture,
      isPromotion,
      isEnPassant,
      isCastling,
      predictedSwapPartner: partner ? partner.square : null,
    });
  }

  return Array.from(byTargetSquare.values());
}

/**
 * Checks whether a move from `from` to `to` requires pawn promotion selection.
 */
export function isPromotionMove(
  state: GameStateSnapshot,
  from: Square,
  to: Square
): boolean {
  const legalMoves = getLegalMovesForSquare(state, from);
  const matching = legalMoves.find((m) => m.to === to);
  return Boolean(matching?.isPromotion);
}

/**
 * Normalizes SAN check/checkmate suffix (`+` / `#`) to match the post-swap board evaluation.
 */
function normalizeSanWithPostSwapCheck(
  rawSan: string,
  inCheck: boolean,
  isCheckmate: boolean
): string {
  const baseSan = rawSan.replace(/[+#]+$/, '');
  if (isCheckmate) return `${baseSan}#`;
  if (inCheck) return `${baseSan}+`;
  return baseSan;
}

/**
 * Validates and applies a standard chess move followed immediately by the deterministic
 * piece-identity exchange, returning the new GameStateSnapshot.
 */
export function applyMoveAndSwap(
  state: GameStateSnapshot,
  moveInput: {
    from: Square;
    to: Square;
    promotion?: PromotionPieceType;
  }
): { ok: true; nextState: GameStateSnapshot } | { ok: false; error: string } {
  if (state.status.isGameOver) {
    return {
      ok: false,
      error: 'La partida ya finalizó. Inicia una nueva partida para seguir jugando.',
    };
  }

  const movingPiece = state.pieces[moveInput.from];
  if (!movingPiece) {
    return {
      ok: false,
      error: 'No hay ninguna pieza en la casilla seleccionada.',
    };
  }

  if (movingPiece.color !== state.turn) {
    return {
      ok: false,
      error: `Es el turno de las ${state.turn === 'w' ? 'Blancas' : 'Negras'}.`,
    };
  }

  const chess = new Chess(state.fen);

  // Detect if promotion is needed
  const needsPromotion =
    movingPiece.type === 'p' && (moveInput.to[1] === '8' || moveInput.to[1] === '1');
  const promotionChoice: PromotionPieceType | undefined = needsPromotion
    ? (moveInput.promotion ?? 'q')
    : undefined;

  let executedMove;
  try {
    executedMove = chess.move({
      from: moveInput.from,
      to: moveInput.to,
      promotion: promotionChoice,
    });
  } catch {
    return {
      ok: false,
      error: `Movimiento inválido: ${moveInput.from} → ${moveInput.to} no es legal para esta pieza.`,
    };
  }

  if (!executedMove) {
    return {
      ok: false,
      error: `Movimiento inválido: ${moveInput.from} → ${moveInput.to}.`,
    };
  }

  const plyNumber = state.moveHistory.length + 1;
  const moveNumber = Math.ceil(plyNumber / 2);

  // 1. Update captured pieces
  const nextCaptured: { w: CapturedPieceRecord[]; b: CapturedPieceRecord[] } = {
    w: [...state.capturedPieces.w],
    b: [...state.capturedPieces.b],
  };

  if (executedMove.captured) {
    const isEp = executedMove.flags.includes('e');
    const captureSquare: Square = isEp
      ? (`${moveInput.to[0]}${moveInput.from[1]}` as Square)
      : moveInput.to;
    const capturedBoardPiece = state.pieces[captureSquare];
    const capturedColor: PieceColor = state.turn === 'w' ? 'b' : 'w';

    nextCaptured[capturedColor].push({
      id: capturedBoardPiece?.id ?? `${capturedColor}-${executedMove.captured}-${plyNumber}`,
      type: (capturedBoardPiece?.type ?? executedMove.captured) as PieceType,
      originalType: (capturedBoardPiece?.originalType ?? executedMove.captured) as PieceType,
      color: capturedColor,
      capturedOn: captureSquare,
      moveNumber,
    });
  }

  // 2. Apply physical move on our piece map
  const postMovePieces = simulatePreSwapBoard(
    state.pieces,
    moveInput.from,
    moveInput.to,
    executedMove.flags,
    promotionChoice
  );

  // 3. Update castling tracking based on king or corner movement/capture
  const nextCastling: CastlingTracking = { ...state.castling };
  if (moveInput.from === 'e1') {
    nextCastling.wK = false;
    nextCastling.wQ = false;
  }
  if (moveInput.from === 'e8') {
    nextCastling.bK = false;
    nextCastling.bQ = false;
  }
  if (moveInput.from === 'h1' || moveInput.to === 'h1') nextCastling.wK = false;
  if (moveInput.from === 'a1' || moveInput.to === 'a1') nextCastling.wQ = false;
  if (moveInput.from === 'h8' || moveInput.to === 'h8') nextCastling.bK = false;
  if (moveInput.from === 'a8' || moveInput.to === 'a8') nextCastling.bQ = false;

  // 4. Execute deterministic piece identity swap
  const { updatedPieces, swapEvent: rawSwapEvent } = executePieceSwap(
    postMovePieces,
    moveInput.to,
    state.turn,
    plyNumber
  );

  // 5. Build post-swap FEN and validate with chess.js
  const postMoveFenParts = chess.fen().split(' ');
  const nextTurn = (postMoveFenParts[1] as PieceColor) ?? (state.turn === 'w' ? 'b' : 'w');
  const candidateEpSquare = postMoveFenParts[3] ?? '-';
  const halfMoveClock = Number(postMoveFenParts[4] ?? 0);
  const fullMoveNumber = Number(postMoveFenParts[5] ?? 1);

  let postSwapFen = buildPostSwapFen({
    pieces: updatedPieces,
    nextTurn,
    castlingTracking: nextCastling,
    candidateEpSquare,
    halfMoveClock,
    fullMoveNumber,
  });

  let postSwapChess: Chess;
  try {
    postSwapChess = new Chess(postSwapFen);
  } catch {
    // Fallback without en-passant target square if chess.js strict validation rejects ep after swap
    postSwapFen = buildPostSwapFen({
      pieces: updatedPieces,
      nextTurn,
      castlingTracking: nextCastling,
      candidateEpSquare: '-',
      halfMoveClock,
      fullMoveNumber,
    });
    postSwapChess = new Chess(postSwapFen);
  }

  const authoritativeFen = postSwapChess.fen();
  const posKey = getPositionKey(authoritativeFen);
  const nextPositionCounts: Record<string, number> = {
    ...state.positionCounts,
    [posKey]: (state.positionCounts[posKey] ?? 0) + 1,
  };

  // 6. Evaluate check, checkmate, stalemate, and draw AFTER the swap
  const nextStatus = evaluateMatchStatus(postSwapChess, updatedPieces, nextPositionCounts);

  const enrichedSwapEvent = enrichSwapEventWithCheckStatus(
    rawSwapEvent,
    nextStatus.inCheck,
    nextStatus.outcome === 'checkmate',
    plyNumber
  );

  const finalSan = normalizeSanWithPostSwapCheck(
    executedMove.san,
    nextStatus.inCheck,
    nextStatus.outcome === 'checkmate'
  );

  const moveRecord: MoveRecord = {
    ply: plyNumber,
    moveNumber,
    color: state.turn,
    from: moveInput.from,
    to: moveInput.to,
    pieceMoved: movingPiece.type,
    san: finalSan,
    captured: executedMove.captured as PieceType | undefined,
    promotion: promotionChoice,
    swap: enrichedSwapEvent,
    fenAfter: authoritativeFen,
    resultedInCheck: nextStatus.inCheck,
    resultedInCheckmate: nextStatus.outcome === 'checkmate',
  };

  return {
    ok: true,
    nextState: {
      fen: authoritativeFen,
      turn: nextTurn,
      pieces: updatedPieces,
      castling: nextCastling,
      capturedPieces: nextCaptured,
      moveHistory: [...state.moveHistory, moveRecord],
      lastSwap: enrichedSwapEvent,
      lastMove: { from: moveInput.from, to: moveInput.to },
      status: nextStatus,
      positionCounts: nextPositionCounts,
    },
  };
}

/**
 * Resigns the match on behalf of `resigningColor`.
 */
export function resignMatch(
  state: GameStateSnapshot,
  resigningColor: PieceColor
): GameStateSnapshot {
  if (state.status.isGameOver) {
    return state;
  }

  const winner: PieceColor = resigningColor === 'w' ? 'b' : 'w';
  const resigningName = resigningColor === 'w' ? 'Blancas' : 'Negras';
  const winnerName = winner === 'w' ? 'Blancas' : 'Negras';

  return {
    ...state,
    status: {
      outcome: 'resignation',
      isGameOver: true,
      inCheck: state.status.inCheck,
      checkedKingSquare: state.status.checkedKingSquare,
      winner,
      statusMessage: `Las ${resigningName} se rindieron. ¡Ganan las ${winnerName}!`,
    },
  };
}

/**
 * Helper to list all 64 squares in board display order according to orientation.
 */
export function getOrderedBoardSquares(orientation: PieceColor): Square[] {
  const ranks = orientation === 'w' ? [...RANKS].reverse() : [...RANKS];
  const files = orientation === 'w' ? [...FILES] : [...FILES].reverse();

  const squares: Square[] = [];
  for (const rank of ranks) {
    for (const file of files) {
      squares.push(`${file}${rank}` as Square);
    }
  }
  return squares;
}

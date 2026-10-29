import type { PieceType, Square, SwapEvent } from '../chess/types/chess.types';
import { PIECE_NAMES_ES, PIECE_WITH_ARTICLE_ES, PIECE_YOUR_ES } from './swapRules';

const PLAYFUL_SWAP_HEADLINES: readonly string[] = [
  '¡¿Qué acaba de pasar?!',
  'Intercambio completado.',
  'El tablero está cambiando.',
  '¡Identidades cruzadas!',
  '¡Nada es lo que parece!',
];

/**
 * Generates a deterministic, accurate notification describing the actual swap result.
 */
export function buildSwapNotification(params: {
  occurred: boolean;
  movedSquare: Square;
  partnerSquare: Square | null;
  movedPieceBefore: PieceType;
  movedPieceAfter: PieceType;
  partnerPieceBefore: PieceType | null;
  partnerPieceAfter: PieceType | null;
  noSwapReason?: 'king-moved' | 'no-eligible-partner';
  plyNumber?: number;
  inCheck?: boolean;
  isCheckmate?: boolean;
}): { headline: string; description: string } {
  const {
    occurred,
    movedSquare,
    partnerSquare,
    movedPieceBefore,
    movedPieceAfter,
    partnerPieceBefore,
    partnerPieceAfter,
    noSwapReason,
    plyNumber = 1,
    inCheck = false,
    isCheckmate = false,
  } = params;

  if (!occurred || !partnerSquare || !partnerPieceBefore || !partnerPieceAfter) {
    if (noSwapReason === 'king-moved') {
      return {
        headline: isCheckmate
          ? '¡Jaque mate definitivo!'
          : inCheck
            ? 'Jaque. Esto se puso feo.'
            : 'El Rey conserva su corona.',
        description: `El Rey se movió a ${movedSquare}. Los reyes nunca intercambian su identidad.`,
      };
    }

    return {
      headline: isCheckmate
        ? '¡Jaque mate definitivo!'
        : inCheck
          ? 'Jaque. Esto se puso feo.'
          : 'Movimiento sin intercambio.',
      description: `${PIECE_NAMES_ES[movedPieceBefore]} en ${movedSquare} mantiene su identidad (no hay otra pieza aliada elegible para intercambiar).`,
    };
  }

  // Exact playful transformation line: e.g. "¡Tu caballo ahora es un alfil!"
  const transformationLine = `¡${PIECE_YOUR_ES[movedPieceBefore]} ahora es ${PIECE_WITH_ARTICLE_ES[movedPieceAfter]}!`;

  if (isCheckmate) {
    return {
      headline: '¡Jaque mate tras el intercambio!',
      description: `${transformationLine} (${movedSquare} ⇄ ${partnerSquare}: ${PIECE_NAMES_ES[movedPieceBefore]} y ${PIECE_NAMES_ES[partnerPieceBefore]} cambiaron de identidad).`,
    };
  }

  if (inCheck) {
    return {
      headline: 'Jaque. Esto se puso feo.',
      description: `${transformationLine} En ${movedSquare} ahora hay ${PIECE_WITH_ARTICLE_ES[movedPieceAfter]} y en ${partnerSquare} ahora hay ${PIECE_WITH_ARTICLE_ES[partnerPieceAfter]}.`,
    };
  }

  // Alternate deterministically between the direct transformation headline and the classic playful headlines
  const headlineIndex = plyNumber % (PLAYFUL_SWAP_HEADLINES.length + 2);
  const headline =
    headlineIndex < 2
      ? transformationLine
      : PLAYFUL_SWAP_HEADLINES[(headlineIndex - 2) % PLAYFUL_SWAP_HEADLINES.length];

  const description =
    headline === transformationLine
      ? `Intercambio en ${movedSquare} ⇄ ${partnerSquare}: ${PIECE_NAMES_ES[movedPieceBefore]} (${movedSquare}) pasó a ser ${PIECE_NAMES_ES[movedPieceAfter]}, y ${PIECE_NAMES_ES[partnerPieceBefore]} (${partnerSquare}) ahora es ${PIECE_NAMES_ES[partnerPieceAfter]}.`
      : `${transformationLine} (${movedSquare} ⇄ ${partnerSquare}: ${PIECE_NAMES_ES[partnerPieceBefore]} en ${partnerSquare} pasó a ser ${PIECE_NAMES_ES[partnerPieceAfter]}).`;

  return { headline, description };
}

/**
 * Updates an existing SwapEvent with post-check / checkmate context once the resulting board is evaluated.
 */
export function enrichSwapEventWithCheckStatus(
  swapEvent: SwapEvent,
  inCheck: boolean,
  isCheckmate: boolean,
  plyNumber: number
): SwapEvent {
  if (!inCheck && !isCheckmate) {
    return swapEvent;
  }
  const { headline, description } = buildSwapNotification({
    occurred: swapEvent.occurred,
    movedSquare: swapEvent.movedSquare,
    partnerSquare: swapEvent.partnerSquare,
    movedPieceBefore: swapEvent.movedPieceBefore,
    movedPieceAfter: swapEvent.movedPieceAfter,
    partnerPieceBefore: swapEvent.partnerPieceBefore,
    partnerPieceAfter: swapEvent.partnerPieceAfter,
    noSwapReason: swapEvent.noSwapReason,
    plyNumber,
    inCheck,
    isCheckmate,
  });

  return {
    ...swapEvent,
    headline,
    description,
  };
}

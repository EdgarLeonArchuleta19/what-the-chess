import React, { useState } from 'react';
import type {
  BoardPiece,
  LegalMoveOption,
  PieceColor,
  Square,
  SwapEvent,
} from '../types/chess.types';
import { getOrderedBoardSquares } from '../engine/chessGameEngine';
import { PIECE_NAMES_ES, squareToCoords } from '../../swapping/swapRules';
import { ChessPieceSvg } from '../../../components/chess/ChessPieceSvg';

interface ChessBoardProps {
  pieces: Partial<Record<Square, BoardPiece>>;
  orientation: PieceColor;
  selectedSquare: Square | null;
  legalMoves: LegalMoveOption[];
  lastMove: { from: Square; to: Square } | null;
  lastSwap: SwapEvent | null;
  checkedKingSquare: Square | null;
  showCoordinates: boolean;
  showSwapPreview: boolean;
  onSquareClick: (square: Square) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  pieces,
  orientation,
  selectedSquare,
  legalMoves,
  lastMove,
  lastSwap,
  checkedKingSquare,
  showCoordinates,
  showSwapPreview,
  onSquareClick,
}) => {
  const [hoveredTargetSquare, setHoveredTargetSquare] = useState<Square | null>(null);

  const orderedSquares = getOrderedBoardSquares(orientation);

  const legalMoveMap = new Map<Square, LegalMoveOption>();
  for (const m of legalMoves) {
    legalMoveMap.set(m.to, m);
  }

  // Determine if a friendly piece is the predicted swap partner for the hovered legal move (or first legal move)
  const activePreviewMove =
    (hoveredTargetSquare && legalMoveMap.get(hoveredTargetSquare)) ||
    (legalMoves.length === 1 ? legalMoves[0] : null);

  const previewPartnerSquare: Square | null =
    showSwapPreview && activePreviewMove ? activePreviewMove.predictedSwapPartner : null;

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto select-none">
      {/* Outer Frame */}
      <div className="w-full h-full p-2 sm:p-3 rounded-2xl bg-[#1A1F24] border-2 border-slate-700/80 shadow-[0_18px_50px_rgba(0,0,0,0.65)]">
        <div
          className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-slate-800"
          role="grid"
          aria-label="Tablero de ajedrez What The Chess?!"
        >
          {orderedSquares.map((square) => {
            const { fileIndex, rankIndex } = squareToCoords(square);
            const isLight = (fileIndex + rankIndex) % 2 === 1;
            const piece = pieces[square];
            const isSelected = selectedSquare === square;
            const legalMove = legalMoveMap.get(square);
            const isLastMoveSquare =
              lastMove?.from === square || lastMove?.to === square;
            const isCheckedKing = checkedKingSquare === square;

            const isSwappedMoved =
              lastSwap?.occurred && lastSwap.movedSquare === square;
            const isSwappedPartner =
              lastSwap?.occurred && lastSwap.partnerSquare === square;
            const isSwappedSquare = Boolean(isSwappedMoved || isSwappedPartner);

            const isPreviewPartner = previewPartnerSquare === square;

            // Show rank label on left edge column, file label on bottom edge row
            const isLeftEdge =
              (orientation === 'w' && fileIndex === 0) ||
              (orientation === 'b' && fileIndex === 7);
            const isBottomEdge =
              (orientation === 'w' && rankIndex === 0) ||
              (orientation === 'b' && rankIndex === 7);

            const baseBg = isLight ? 'bg-[#EEEAD6]' : 'bg-[#2F3847]';
            const coordColor = isLight ? 'text-[#2F3847]/80' : 'text-[#EEEAD6]/75';

            const pieceLabel = piece
              ? `, ${PIECE_NAMES_ES[piece.type]} ${piece.color === 'w' ? 'Blanco' : 'Negro'}${
                  piece.originalType !== piece.type
                    ? ` (antes ${PIECE_NAMES_ES[piece.originalType]})`
                    : ''
                }`
              : '';

            const moveLabel = legalMove
              ? legalMove.isCapture
                ? ', captura disponible'
                : ', movimiento legal disponible'
              : '';

            return (
              <button
                key={square}
                type="button"
                data-testid={`square-${square}`}
                aria-label={`Casilla ${square}${pieceLabel}${moveLabel}`}
                onClick={() => onSquareClick(square)}
                onMouseEnter={() => {
                  if (legalMove) setHoveredTargetSquare(square);
                }}
                onMouseLeave={() => {
                  if (hoveredTargetSquare === square) setHoveredTargetSquare(null);
                }}
                className={`relative flex items-center justify-center w-full h-full focus:outline-none transition-colors duration-150 ${baseBg}`}
              >
                {/* Last Move tint */}
                {isLastMoveSquare && !isSelected && (
                  <span className="absolute inset-0 bg-[#B8FF3B]/30 pointer-events-none" />
                )}

                {/* Selected Square highlight */}
                {isSelected && (
                  <span className="absolute inset-0 bg-[#B8FF3B]/55 ring-2 ring-inset ring-[#080B11] pointer-events-none" />
                )}

                {/* Checked King danger overlay */}
                {isCheckedKing && (
                  <span className="absolute inset-0 bg-red-600/65 ring-2 ring-inset ring-red-400 animate-pulse pointer-events-none" />
                )}

                {/* Recent Swap emphasis border */}
                {isSwappedSquare && (
                  <span
                    key={`${square}-${lastSwap?.movedPieceAfter}-${lastSwap?.partnerPieceAfter}`}
                    className="absolute inset-0.5 rounded-md ring-2 ring-[#B8FF3B] bg-[#B8FF3B]/20 animate-swap-pulse pointer-events-none"
                  />
                )}

                {/* Predicted Swap Partner dashed highlight on hover */}
                {isPreviewPartner && (
                  <span className="absolute inset-0.5 rounded-md ring-2 ring-dashed ring-[#B8FF3B] bg-[#B8FF3B]/25 pointer-events-none" />
                )}

                {/* Rank coordinate (1-8) */}
                {showCoordinates && isLeftEdge && (
                  <span
                    className={`absolute top-0.5 left-1 font-mono text-[9px] sm:text-[10px] font-bold leading-none pointer-events-none ${coordColor}`}
                  >
                    {square[1]}
                  </span>
                )}

                {/* File coordinate (a-h) */}
                {showCoordinates && isBottomEdge && (
                  <span
                    className={`absolute bottom-0.5 right-1 font-mono text-[9px] sm:text-[10px] font-bold leading-none pointer-events-none ${coordColor}`}
                  >
                    {square[0]}
                  </span>
                )}

                {/* Swap badge on squares that just exchanged identities */}
                {isSwappedSquare && (
                  <span
                    title="Esta pieza acaba de intercambiar su identidad"
                    className="absolute top-0.5 right-0.5 z-20 px-1 py-0.2 rounded bg-[#080B11]/90 text-[#B8FF3B] font-mono text-[9px] font-black leading-tight border border-[#B8FF3B]/60 pointer-events-none"
                  >
                    ⇄
                  </span>
                )}

                {/* Preview badge when hovering a destination square */}
                {isPreviewPartner && (
                  <span className="absolute -top-0.5 right-0.5 z-20 px-1 rounded bg-[#B8FF3B] text-[#080B11] font-mono text-[9px] font-black leading-tight shadow pointer-events-none">
                    ⇄ SOCIO
                  </span>
                )}

                {/* Chess Piece SVG */}
                {piece && (
                  <div
                    key={`${piece.id}-${piece.type}-${piece.swapCount}`}
                    className={`relative z-10 w-[82%] h-[82%] flex items-center justify-center ${
                      isSwappedSquare ? 'animate-piece-pop' : ''
                    }`}
                  >
                    <ChessPieceSvg
                      type={piece.type}
                      color={piece.color}
                      className="w-full h-full"
                      isSwappedRecently={isSwappedSquare}
                    />
                  </div>
                )}

                {/* Legal Move indicator (dot for empty square, corner ring for capture) */}
                {legalMove && !piece && (
                  <span className="relative z-20 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#080B11]/60 ring-2 ring-[#B8FF3B] pointer-events-none" />
                )}

                {legalMove && piece && (
                  <span className="absolute inset-1 z-20 rounded-full ring-4 ring-red-500/85 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

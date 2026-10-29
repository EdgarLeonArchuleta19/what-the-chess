import React from 'react';
import type {
  PieceColor,
  PromotionPieceType,
  Square,
} from '../types/chess.types';
import { ChessPieceSvg } from '../../../components/chess/ChessPieceSvg';
import { PIECE_NAMES_ES } from '../../swapping/swapRules';

interface PromotionDialogProps {
  isOpen: boolean;
  color: PieceColor;
  targetSquare: Square | null;
  onSelect: (piece: PromotionPieceType) => void;
  onCancel: () => void;
}

const PROMOTION_OPTIONS: PromotionPieceType[] = ['q', 'r', 'b', 'n'];

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  isOpen,
  color,
  targetSquare,
  onSelect,
  onCancel,
}) => {
  if (!isOpen || !targetSquare) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promotion-dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#222A36] border-2 border-[#B8FF3B] p-6 shadow-2xl">
        <h3
          id="promotion-dialog-title"
          className="font-display font-black text-xl text-[#F8FAFC] text-center"
        >
          ¡Coronación en {targetSquare.toUpperCase()}!
        </h3>
        <p className="mt-1.5 text-xs text-center text-[#94A3B8]">
          Elige la nueva identidad para tu peón. Inmediatamente después de coronar, intercambiará
          su identidad con la pieza aliada elegible más cercana.
        </p>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {PROMOTION_OPTIONS.map((pieceType) => (
            <button
              key={pieceType}
              type="button"
              onClick={() => onSelect(pieceType)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] border border-slate-700 hover:border-[#B8FF3B] transition-all group"
            >
              <ChessPieceSvg
                type={pieceType}
                color={color}
                className="w-12 h-12 group-hover:scale-110 transition-transform"
              />
              <span className="mt-2 text-xs font-bold text-[#F8FAFC] group-hover:text-[#B8FF3B]">
                {PIECE_NAMES_ES[pieceType]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#1A1F24] hover:bg-slate-800 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700"
          >
            Cancelar movimiento
          </button>
        </div>
      </div>
    </div>
  );
};

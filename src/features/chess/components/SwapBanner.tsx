import React from 'react';
import { AlertCircle, ArrowLeftRight, Sparkles } from 'lucide-react';
import type { SwapEvent } from '../types/chess.types';
import { PIECE_NAMES_ES } from '../../swapping/swapRules';

interface SwapBannerProps {
  lastSwap: SwapEvent | null;
  invalidMoveError: string | null;
  onDismissError: () => void;
}

export const SwapBanner: React.FC<SwapBannerProps> = ({
  lastSwap,
  invalidMoveError,
  onDismissError,
}) => {
  if (invalidMoveError) {
    return (
      <div
        role="alert"
        onClick={onDismissError}
        className="w-full rounded-2xl bg-red-500/15 border border-red-500/50 px-4 py-3 flex items-center justify-between gap-3 animate-shake cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-red-300">
              Movimiento no permitido
            </p>
            <p className="text-xs text-red-200/90">{invalidMoveError}</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-red-300/70 shrink-0">Cerrar</span>
      </div>
    );
  }

  if (!lastSwap) {
    return (
      <div className="w-full rounded-2xl bg-[#222A36] border border-slate-700/70 px-4 py-3 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#B8FF3B]/15 text-[#B8FF3B] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-sm text-[#F8FAFC]">
            ¡Listos para el caos táctico!
          </p>
          <p className="text-xs text-[#94A3B8] truncate">
            Realiza el primer movimiento para desatar el intercambio determinista de identidades.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="w-full rounded-2xl bg-[#222A36] border border-[#B8FF3B]/45 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_20px_rgba(184,255,59,0.08)]"
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-[#B8FF3B] text-[#080B11] shrink-0">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-extrabold text-sm sm:text-base text-[#B8FF3B] leading-snug">
            {lastSwap.headline}
          </p>
          <p className="text-xs text-slate-200 leading-relaxed">{lastSwap.description}</p>
        </div>
      </div>

      {lastSwap.occurred &&
        lastSwap.partnerSquare &&
        lastSwap.partnerPieceBefore &&
        lastSwap.partnerPieceAfter && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1F24] border border-slate-700 text-xs font-mono shrink-0 self-start sm:self-center">
            <span className="text-[#F8FAFC] font-bold">
              {lastSwap.movedSquare.toUpperCase()} ({PIECE_NAMES_ES[lastSwap.movedPieceAfter]})
            </span>
            <span className="text-[#B8FF3B] font-black">⇄</span>
            <span className="text-[#F8FAFC] font-bold">
              {lastSwap.partnerSquare.toUpperCase()} ({PIECE_NAMES_ES[lastSwap.partnerPieceAfter]})
            </span>
          </div>
        )}
    </div>
  );
};

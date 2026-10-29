import React from 'react';
import { ArrowLeftRight, History } from 'lucide-react';
import type { MoveRecord } from '../chess/types/chess.types';
import { PIECE_NAMES_ES } from '../swapping/swapRules';

interface MoveHistoryPanelProps {
  moves: MoveRecord[];
}

export const MoveHistoryPanel: React.FC<MoveHistoryPanelProps> = ({ moves }) => {
  return (
    <div className="rounded-2xl bg-[#222A36] border border-slate-700/70 flex flex-col h-64 sm:h-72 overflow-hidden">
      <div className="px-4 py-3 bg-[#1A1F24] border-b border-slate-700/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#B8FF3B]" />
          <h3 className="font-display font-bold text-sm text-[#F8FAFC]">
            Historial de Jugadas e Intercambios
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-[#222A36] text-[11px] font-mono text-[#94A3B8]">
          {moves.length} {moves.length === 1 ? 'jugada' : 'jugadas'}
        </span>
      </div>

      {moves.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ArrowLeftRight className="w-7 h-7 text-slate-600 mb-2" />
          <p className="text-xs text-[#94A3B8]">
            Aún no hay movimientos registrados. ¡Mueve una pieza blanca para iniciar la partida!
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {moves.map((record) => {
            const isWhite = record.color === 'w';
            const swap = record.swap;

            return (
              <div
                key={record.ply}
                className="px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs hover:bg-[#1A1F24]/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-[#94A3B8] w-7 shrink-0">
                    {record.moveNumber}.{isWhite ? '' : '..'}
                  </span>
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 border ${
                      isWhite
                        ? 'bg-[#F8FAFC] border-slate-400'
                        : 'bg-[#080B11] border-slate-500'
                    }`}
                    title={isWhite ? 'Blancas' : 'Negras'}
                  />
                  <span className="font-mono font-bold text-[#F8FAFC] text-sm">
                    {record.san}
                  </span>
                  <span className="text-[11px] text-[#94A3B8] truncate">
                    ({record.from} → {record.to})
                  </span>
                </div>

                {swap.occurred &&
                swap.partnerSquare &&
                swap.partnerPieceBefore &&
                swap.partnerPieceAfter ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1A1F24] border border-[#B8FF3B]/30 text-[11px] font-mono text-[#B8FF3B] shrink-0">
                    <span>
                      {PIECE_NAMES_ES[swap.movedPieceBefore].slice(0, 3)}
                    </span>
                    <span>⇄</span>
                    <span>
                      {PIECE_NAMES_ES[swap.partnerPieceBefore].slice(0, 3)} (
                      {swap.partnerSquare})
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    Sin ⇄
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

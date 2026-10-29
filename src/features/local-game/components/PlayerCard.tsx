import React from 'react';
import { Flame, Shield } from 'lucide-react';
import type {
  CapturedPieceRecord,
  PieceColor,
} from '../../chess/types/chess.types';
import { ChessPieceSvg } from '../../../components/chess/ChessPieceSvg';
import { PIECE_VALUES } from '../../swapping/swapRules';

interface PlayerCardProps {
  color: PieceColor;
  name: string;
  isActiveTurn: boolean;
  isInCheck: boolean;
  isWinner: boolean;
  /** Enemy pieces captured by this player */
  capturedByPlayer: CapturedPieceRecord[];
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  color,
  name,
  isActiveTurn,
  isInCheck,
  isWinner,
  capturedByPlayer,
}) => {
  const isWhite = color === 'w';

  const totalCapturedPoints = capturedByPlayer.reduce(
    (sum, item) => sum + PIECE_VALUES[item.type],
    0
  );

  return (
    <div
      className={`rounded-2xl px-4 py-3 border transition-all ${
        isActiveTurn
          ? 'bg-[#222A36] border-[#B8FF3B] shadow-[0_0_24px_rgba(184,255,59,0.12)]'
          : 'bg-[#1A1F24] border-slate-800/90'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Player Color Avatar */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              isWhite
                ? 'bg-[#EEEAD6] text-[#080B11] border-white'
                : 'bg-[#080B11] text-[#F8FAFC] border-slate-600'
            }`}
          >
            <ChessPieceSvg type="n" color={color} className="w-7 h-7" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#F8FAFC] truncate">
                {name}
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-[#080B11]/60 text-[10px] font-mono text-[#94A3B8] uppercase">
                {isWhite ? 'Blancas' : 'Negras'}
              </span>
            </div>

            {/* Captured Pieces row */}
            <div className="mt-1 flex items-center flex-wrap gap-0.5 min-h-[20px]">
              {capturedByPlayer.length === 0 ? (
                <span className="text-[11px] text-slate-500">Sin capturas aún</span>
              ) : (
                <>
                  {capturedByPlayer.map((cap) => (
                    <div
                      key={cap.id}
                      className="w-5 h-5 -ml-1 first:ml-0"
                      title={`Capturada en ${cap.capturedOn} (Jugada ${cap.moveNumber})`}
                    >
                      <ChessPieceSvg
                        type={cap.type}
                        color={cap.color}
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                  {totalCapturedPoints > 0 && (
                    <span className="ml-1.5 text-[11px] font-mono font-bold text-[#B8FF3B]">
                      +{totalCapturedPoints}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 shrink-0">
          {isInCheck && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-display font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              ¡JAQUE!
            </span>
          )}

          {isWinner && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#B8FF3B] text-[#080B11] text-xs font-display font-black">
              ¡GANADOR!
            </span>
          )}

          {isActiveTurn && !isWinner && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#B8FF3B]/15 border border-[#B8FF3B]/40 text-[#B8FF3B] text-xs font-display font-bold">
              <span className="w-2 h-2 rounded-full bg-[#B8FF3B] animate-ping" />
              Tu turno
            </span>
          )}

          {!isActiveTurn && !isWinner && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#080B11]/60 text-[#94A3B8] text-xs font-medium">
              <Shield className="w-3.5 h-3.5" />
              Esperando
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

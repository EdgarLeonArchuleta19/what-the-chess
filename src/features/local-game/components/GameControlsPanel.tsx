import React from 'react';
import {
  BookOpen,
  Eye,
  Flag,
  Home,
  Redo2,
  RefreshCw,
  RotateCcw,
  Undo2,
} from 'lucide-react';
import type { LocalPreferences } from '../../chess/types/chess.types';

interface GameControlsPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  isGameOver: boolean;
  preferences: LocalPreferences;
  onUndo: () => void;
  onRedo: () => void;
  onRotateBoard: () => void;
  onToggleAutoRotate: () => void;
  onToggleSwapPreview: () => void;
  onRequestRestart: () => void;
  onRequestResign: () => void;
  onOpenRules: () => void;
  onRequestMainMenu: () => void;
}

export const GameControlsPanel: React.FC<GameControlsPanelProps> = ({
  canUndo,
  canRedo,
  isGameOver,
  preferences,
  onUndo,
  onRedo,
  onRotateBoard,
  onToggleAutoRotate,
  onToggleSwapPreview,
  onRequestRestart,
  onRequestResign,
  onOpenRules,
  onRequestMainMenu,
}) => {
  return (
    <div className="rounded-2xl bg-[#222A36] border border-slate-700/70 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-[#F8FAFC]">
          Controles de la Partida
        </h3>
        <span className="text-[11px] font-mono text-[#B8FF3B]">2 Jugadores Local</span>
      </div>

      {/* Primary Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] disabled:opacity-40 disabled:pointer-events-none border border-slate-700/80 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Undo2 className="w-4 h-4 text-[#B8FF3B]" />
          <span>Deshacer</span>
        </button>

        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] disabled:opacity-40 disabled:pointer-events-none border border-slate-700/80 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Redo2 className="w-4 h-4 text-[#B8FF3B]" />
          <span>Rehacer</span>
        </button>

        <button
          type="button"
          onClick={onRotateBoard}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] border border-slate-700/80 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-[#B8FF3B]" />
          <span>Girar tablero</span>
        </button>

        <button
          type="button"
          onClick={onRequestRestart}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] border border-slate-700/80 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Reiniciar</span>
        </button>

        <button
          type="button"
          onClick={onRequestResign}
          disabled={isGameOver}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-red-500/20 disabled:opacity-40 disabled:pointer-events-none border border-slate-700/80 hover:border-red-500/40 text-xs font-semibold text-red-300 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Flag className="w-4 h-4 text-red-400" />
          <span>Rendirse</span>
        </button>

        <button
          type="button"
          onClick={onOpenRules}
          className="px-3 py-2 rounded-xl bg-[#1A1F24] hover:bg-[#2B3544] border border-slate-700/80 text-xs font-semibold text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-[#B8FF3B]" />
          <span>Reglas</span>
        </button>
      </div>

      {/* Preferences Toggles */}
      <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={onToggleAutoRotate}
          aria-pressed={preferences.autoRotateBoard}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors ${
            preferences.autoRotateBoard
              ? 'bg-[#B8FF3B]/15 border-[#B8FF3B]/50 text-[#B8FF3B]'
              : 'bg-[#1A1F24] border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Auto-girar por turno: {preferences.autoRotateBoard ? 'Sí' : 'No'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleSwapPreview}
          aria-pressed={preferences.showSwapPreview}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors ${
            preferences.showSwapPreview
              ? 'bg-[#B8FF3B]/15 border-[#B8FF3B]/50 text-[#B8FF3B]'
              : 'bg-[#1A1F24] border-slate-700 text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Prever socio ⇄: {preferences.showSwapPreview ? 'Sí' : 'No'}</span>
        </button>
      </div>

      {/* Return to Main Menu */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onRequestMainMenu}
          className="w-full px-3 py-2 rounded-xl bg-[#14181F] hover:bg-[#1A1F24] border border-slate-800 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] flex items-center justify-center gap-1.5 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Volver al menú principal</span>
        </button>
      </div>
    </div>
  );
};

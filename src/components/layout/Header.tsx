import React from 'react';
import { BookOpen, Eye, Gamepad2, Home } from 'lucide-react';
import { Wordmark } from '../chess/Wordmark';

interface HeaderProps {
  currentView: 'menu' | 'game';
  onNavigateMenu: () => void;
  onStartGame: () => void;
  onOpenRules: () => void;
  onOpenEasterEgg: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateMenu,
  onStartGame,
  onOpenRules,
  onOpenEasterEgg,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#080B11]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Wordmark */}
        <button
          type="button"
          onClick={onNavigateMenu}
          className="text-left focus:outline-none group"
          aria-label="Ir al menú principal de What The Chess?!"
        >
          <Wordmark size="sm" />
        </button>

        {/* Right Controls + Secret CETis 107 Weird Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView === 'game' ? (
            <button
              type="button"
              onClick={onNavigateMenu}
              className="px-3 py-1.5 rounded-xl bg-[#1A1F24] hover:bg-[#222A36] border border-slate-700/80 text-xs sm:text-sm font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-4 h-4 text-[#94A3B8]" />
              <span className="hidden sm:inline">Menú</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartGame}
              className="px-3.5 py-1.5 rounded-xl bg-[#B8FF3B] hover:bg-[#CBFF66] text-[#080B11] font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Jugar local</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRules}
            className="px-3 py-1.5 rounded-xl bg-[#1A1F24] hover:bg-[#222A36] border border-slate-700/80 text-xs sm:text-sm font-semibold text-[#F8FAFC] flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#B8FF3B]" />
            <span>Reglas</span>
          </button>

          {/* Mysterious / Quirky Top Icon for the CETis 107 / Rochin Easter Egg */}
          <button
            type="button"
            onClick={onOpenEasterEgg}
            title="¿Qué es este símbolo misterioso? (Reliquia 107)"
            aria-label="Icono misterioso CETis 107"
            className="relative group p-2 rounded-xl bg-[#1A1F24] hover:bg-[#222A36] border border-dashed border-[#B8FF3B]/50 hover:border-[#B8FF3B] text-[#B8FF3B] transition-all hover:scale-105"
          >
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[10px] font-black tracking-tighter bg-[#B8FF3B]/15 px-1 rounded">
                107?
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

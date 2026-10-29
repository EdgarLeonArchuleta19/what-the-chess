import React from 'react';

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Wordmark: React.FC<WordmarkProps> = ({ size = 'lg' }) => {
  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2 select-none">
        <span className="font-display font-black tracking-tight text-lg sm:text-xl text-[#F8FAFC]">
          WHAT THE{' '}
          <span className="text-[#B8FF3B] underline decoration-[#B8FF3B]/50 decoration-wavy underline-offset-4">
            CHESS?!
          </span>
        </span>
      </div>
    );
  }

  if (size === 'md') {
    return (
      <div className="inline-flex flex-col items-start select-none">
        <div className="flex items-center gap-2">
          <span className="font-display font-black tracking-tight text-2xl sm:text-3xl text-[#F8FAFC]">
            WHAT THE
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#B8FF3B] text-[#080B11] font-display font-black text-2xl sm:text-3xl -rotate-2 shadow-sm">
            CHESS?!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center select-none">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-[#222A36] border border-[#B8FF3B]/30 text-[#B8FF3B] text-xs font-mono uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-[#B8FF3B] animate-pulse" />
        Variante de Ajedrez Caótico Determinista
      </div>
      <h1 className="font-display font-black tracking-tight text-4xl sm:text-6xl md:text-7xl text-center leading-none">
        <span className="text-[#F8FAFC]">WHAT THE </span>
        <span className="inline-block px-3 py-1 mt-1 sm:mt-0 rounded-2xl bg-[#B8FF3B] text-[#080B11] -rotate-2 shadow-[0_6px_0_0_rgba(184,255,59,0.28)]">
          CHESS?!
        </span>
      </h1>
    </div>
  );
};

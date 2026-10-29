import React from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Cpu,
  Gamepad2,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { ConfusedKnightMascot } from '../../../components/chess/ConfusedKnightMascot';
import { Wordmark } from '../../../components/chess/Wordmark';
import { ChessPieceSvg } from '../../../components/chess/ChessPieceSvg';

interface MainMenuScreenProps {
  onStartLocalGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenRules: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onStartLocalGame,
  onOpenHowToPlay,
  onOpenRules,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-[#1A1F24] border border-slate-800/90 p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Identity & CTAs */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            <Wordmark size="lg" />

            <div className="space-y-1.5">
              <p className="font-display font-extrabold text-xl sm:text-2xl text-[#F8FAFC]">
                &ldquo;Ajedrez... pero nada es lo que parece.&rdquo;
              </p>
              <p className="font-mono text-xs sm:text-sm text-[#B8FF3B] tracking-wide uppercase">
                Every move changes the game.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl leading-relaxed">
              Una variante competitiva y caótica para dos jugadores en el mismo dispositivo. Cada
              vez que realizas un movimiento legal de ajedrez, la pieza que moviste{' '}
              <strong className="text-[#F8FAFC]">
                intercambia de forma determinista su identidad
              </strong>{' '}
              con otra de tus piezas en el tablero.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onStartLocalGame}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#B8FF3B] hover:bg-[#CBFF66] text-[#080B11] font-display font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_6px_0_0_rgba(184,255,59,0.28)] hover:translate-y-[-1px] active:translate-y-[1px] transition-all"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Jugar local</span>
              </button>

              <button
                type="button"
                onClick={onOpenHowToPlay}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#222A36] hover:bg-[#2B3544] text-[#F8FAFC] font-display font-bold text-sm sm:text-base border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-[#B8FF3B]" />
                <span>Cómo jugar</span>
              </button>
            </div>

            {/* Quick Feature Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-[#94A3B8]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222A36] border border-slate-700/70">
                <Users className="w-3.5 h-3.5 text-[#B8FF3B]" />2 Jugadores en 1 Dispositivo
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222A36] border border-slate-700/70">
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#B8FF3B]" />
                100% Determinista (Sin Azar)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222A36] border border-slate-700/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8FF3B]" />
                Funciona Offline
              </span>
            </div>
          </div>

          {/* Right Column: Mascot & Interactive Swap Showcase Card */}
          <div className="w-full max-w-sm rounded-2xl bg-[#222A36] border border-slate-700/80 p-6 flex flex-col items-center text-center space-y-5 shadow-xl">
            <ConfusedKnightMascot className="w-36 h-36 sm:w-40 sm:h-40" />

            <div className="w-full rounded-xl bg-[#1A1F24] border border-slate-800 p-3.5 space-y-2">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-lg bg-[#EEEAD6] flex items-center justify-center">
                    <ChessPieceSvg type="n" color="w" className="w-8 h-8" />
                  </div>
                  <span className="mt-1 font-mono text-[10px] text-[#94A3B8]">
                    Caballo en f3
                  </span>
                </div>

                <div className="flex flex-col items-center text-[#B8FF3B]">
                  <ArrowLeftRight className="w-6 h-6 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold">¡SWAP!</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-lg bg-[#2F3847] flex items-center justify-center">
                    <ChessPieceSvg type="p" color="w" className="w-8 h-8" />
                  </div>
                  <span className="mt-1 font-mono text-[10px] text-[#94A3B8]">
                    Peón en f2
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                &ldquo;¡Tu caballo ahora es un peón y tu peón en f2 ahora salta como caballo!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reglas Section */}
      <section aria-labelledby="reglas-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#B8FF3B]">
              Mecánica Central
            </span>
            <h2
              id="reglas-heading"
              className="font-display font-black text-2xl sm:text-3xl text-[#F8FAFC]"
            >
              Reglas del Juego
            </h2>
          </div>
          <button
            type="button"
            onClick={onOpenRules}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#222A36] hover:bg-[#2B3544] border border-slate-700 text-xs font-bold text-[#B8FF3B] flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ver reglamento detallado</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-[#1A1F24] border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF3B]/15 text-[#B8FF3B] flex items-center justify-center font-mono font-black text-sm border border-[#B8FF3B]/30">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
              Movimiento Estándar + Intercambio
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Cada turno inicia con un movimiento legal de ajedrez (incluyendo capturas, enroque o
              coronación). Al aterrizar en la casilla destino, tu pieza intercambia su identidad con
              la pieza aliada elegible más cercana (distancia Manhattan).
            </p>
          </div>

          <div className="rounded-2xl bg-[#1A1F24] border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF3B]/15 text-[#B8FF3B] flex items-center justify-center font-mono font-black text-sm border border-[#B8FF3B]/30">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
              El Rey y los Peones tienen Leyes
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              El <strong>Rey jamás intercambia su identidad</strong>. Además, ningún Peón puede
              terminar en la fila 1 ni en la fila 8 como resultado de un intercambio, garantizando
              posiciones 100% válidas en todo momento.
            </p>
          </div>

          <div className="rounded-2xl bg-[#1A1F24] border border-slate-800 p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF3B]/15 text-[#B8FF3B] flex items-center justify-center font-mono font-black text-sm border border-[#B8FF3B]/30">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-[#F8FAFC]">
              Jaque y Mate Post-Intercambio
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              El jaque, jaque mate, rey ahogado y tablas se evalúan <strong>después</strong> de
              completar el intercambio. Planea un paso adelante: la pieza que dejas atrás adquiere
              el poder de la pieza que moviste.
            </p>
          </div>
        </div>
      </section>

      {/* Acerca del juego Section */}
      <section
        aria-labelledby="acerca-heading"
        className="rounded-3xl bg-[#1A1F24] border border-slate-800 p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#B8FF3B] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Acerca del juego
            </div>
            <h2
              id="acerca-heading"
              className="font-display font-black text-2xl text-[#F8FAFC]"
            >
              Diseñado para partidas locales llenas de sorpresas
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              <strong>What The Chess?!</strong> nació como una reinvención indie del ajedrez
              clásico: elimina la memorización mecánica de aperturas y obliga a ambos jugadores a
              recalcular la geometría del tablero en cada turno, sin depender jamás de dados ni
              aleatoriedad. Funciona completamente en tu navegador sin conexión a internet ni
              servidores externos.
            </p>
          </div>

          <div className="rounded-2xl bg-[#222A36] border border-slate-700/70 p-5 space-y-3">
            <div className="flex items-center gap-2.5 text-sm font-display font-bold text-[#F8FAFC]">
              <Cpu className="w-4 h-4 text-[#B8FF3B]" />
              <span>Arquitectura Modular</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Construido con React 19, TypeScript estricto, Tailwind CSS y un motor determinista
              desacoplado sobre <code>chess.js</code>, listo para partidas locales instantáneas.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-[#B8FF3B]">
              <Layers className="w-3.5 h-3.5" />
              <span>Motor validado con pruebas unitarias Vitest</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

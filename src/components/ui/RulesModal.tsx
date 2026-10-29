import React, { useState } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Crown,
  Flame,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  initialTab?: 'tutorial' | 'rules' | 'special';
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  initialTab = 'tutorial',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tutorial' | 'rules' | 'special'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#1A1F24] border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#222A36] border-b border-slate-700/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B8FF3B]/15 text-[#B8FF3B] border border-[#B8FF3B]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="rules-modal-title"
                className="font-display font-extrabold text-xl text-[#F8FAFC]"
              >
                Cómo Jugar y Reglas Oficiales
              </h2>
              <p className="text-xs text-[#94A3B8]">
                What The Chess?! — Variante de Intercambio Determinista de Identidades
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar reglas"
            className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A1F24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#14181F] px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'tutorial'
                ? 'bg-[#1A1F24] text-[#B8FF3B] border-[#B8FF3B]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] border-transparent'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Guía Rápida y Tutorial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'rules'
                ? 'bg-[#1A1F24] text-[#B8FF3B] border-[#B8FF3B]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] border-transparent'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Mecánica de Intercambio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('special')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'special'
                ? 'bg-[#1A1F24] text-[#B8FF3B] border-[#B8FF3B]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC] border-transparent'
            }`}
          >
            <Crown className="w-4 h-4" />
            Movimientos Especiales y Victoria
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm leading-relaxed text-slate-200">
          {activeTab === 'tutorial' && (
            <>
              <div className="p-4 rounded-xl bg-[#222A36] border border-[#B8FF3B]/30">
                <div className="flex items-center gap-2 text-[#B8FF3B] font-display font-bold text-base mb-1.5">
                  <Sparkles className="w-5 h-5" />
                  ¿Por qué este juego es distinto al ajedrez tradicional?
                </div>
                <p className="text-[#F8FAFC]">
                  En <strong>What The Chess?!</strong>, las piezas se mueven siguiendo las reglas
                  clásicas del ajedrez, pero <strong>al terminar cada movimiento válido</strong>,
                  la pieza que moviste <strong>intercambia su identidad</strong> con otra pieza
                  aliada elegible. Sus posiciones físicas se mantienen, pero sus roles y capacidades
                  de movimiento se cruzan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#B8FF3B]/15 text-[#B8FF3B] font-mono text-xs font-bold mb-2">
                    PASO 1
                  </span>
                  <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-1">
                    Mueve como en Ajedrez
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Selecciona una pieza de tu color. Verás resaltadas sus casillas legales
                    según su identidad actual (Peón, Caballo, Alfil, Torre, Dama o Rey).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#B8FF3B]/15 text-[#B8FF3B] font-mono text-xs font-bold mb-2">
                    PASO 2
                  </span>
                  <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-1">
                    ¡Intercambio Determinista!
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Tras mover (y capturar si aplica), tu pieza intercambia su identidad con la
                    pieza aliada elegible más cercana de distinto tipo.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#B8FF3B]/15 text-[#B8FF3B] font-mono text-xs font-bold mb-2">
                    PASO 3
                  </span>
                  <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-1">
                    Jaque Post-Intercambio
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    El jaque, jaque mate y ahogado se evalúan <strong>después</strong> de que el
                    intercambio ocurre. ¡Un peón que se transforma en Dama o Torre puede dar jaque
                    instantáneo!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#14181F] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#B8FF3B] font-semibold">
                  <Users className="w-4 h-4" />
                  <span>Consejo para tu primera partida (2 jugadores en el mismo dispositivo)</span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Cuando selecciones una pieza en el tablero, observa el indicador{' '}
                  <span className="text-[#B8FF3B] font-semibold">⇄ Socio de intercambio</span>: el
                  tablero te anticipa de forma 100% transparente con cuál pieza aliada intercambiarás
                  identidades según la casilla de destino. Puedes activar la rotación automática del
                  tablero entre turnos o girarlo con un clic.
                </p>
              </div>
            </>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                <h3 className="font-display font-bold text-base text-[#B8FF3B] mb-2">
                  Reglas Exactas del Intercambio de Identidades
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-200">
                  <li>
                    <strong>Mismo jugador:</strong> Solo intercambias con otra pieza de tu propio
                    color que ya esté en el tablero.
                  </li>
                  <li>
                    <strong>Tipo distinto:</strong> El socio debe tener una identidad diferente a la
                    pieza que se acaba de mover (por ejemplo, un Caballo nunca intercambia con otro
                    Caballo).
                  </li>
                  <li>
                    <strong>El Rey es intocable:</strong> El Rey <strong>nunca</strong> participa en
                    intercambios de identidad, ni al moverse ni como socio.
                  </li>
                  <li>
                    <strong>Restricción de filas para Peones:</strong> Ningún Peón puede terminar en
                    la fila 1 ni en la fila 8 tras un intercambio. Por tanto:
                    <ul className="list-disc list-inside ml-5 mt-1 text-[#94A3B8]">
                      <li>
                        Si mueves un Peón (a las filas 2–7), no puede intercambiar con una pieza
                        aliada situada en la fila 1 o 8.
                      </li>
                      <li>
                        Si mueves cualquier pieza hacia la fila 1 o 8, no puede intercambiar con un
                        Peón aliado.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Selección 100% Determinista (Cero Azar):</strong> Entre todas las piezas
                    aliadas elegibles, se selecciona la que tenga la{' '}
                    <strong>menor distancia Manhattan</strong> (<code>|Δcolumna| + |Δfila|</code>) a
                    la casilla de destino. En caso de empate en distancia, se desempata por orden
                    canónico de casilla (fila <code>1 → 8</code>, columna <code>a → h</code>).
                  </li>
                  <li>
                    <strong>Sin socio elegible:</strong> Si no existe ninguna pieza aliada que cumpla
                    las condiciones, el movimiento sigue siendo válido y no ocurre intercambio.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[#14181F] border border-slate-800 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#B8FF3B] shrink-0 mt-0.5" />
                <div className="text-xs text-[#94A3B8]">
                  <strong className="text-[#F8FAFC]">Conservación de materia:</strong> Jamás se
                  crean ni duplican piezas. El conjunto total de identidades de tus piezas en el
                  tablero permanece intacto; únicamente permutan entre dos casillas aliadas.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'special' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <h4 className="font-display font-bold text-[#B8FF3B] mb-1">
                    Capturas y Coronación
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Las capturas se resuelven primero de forma normal (la pieza enemiga sale del
                    tablero con la identidad que tenía en ese instante). Si un Peón alcanza la última
                    fila (8 o 1), primero corona (Dama, Torre, Alfil o Caballo) y luego la pieza
                    recién coronada realiza su intercambio determinista con una pieza aliada que no
                    sea Peón.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <h4 className="font-display font-bold text-[#B8FF3B] mb-1">
                    Enroque (Castling)
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    El enroque es un movimiento del Rey. Como el Rey nunca intercambia identidad, al
                    enrocar corto (<code>O-O</code>) o largo (<code>O-O-O</code>) el Rey y la Torre
                    se posicionan normalmente sin disparar intercambio. Para enrocar, la esquina debe
                    conservar una pieza con identidad de Torre que no se haya movido.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <h4 className="font-display font-bold text-[#B8FF3B] mb-1">
                    Captura al Paso (En Passant)
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Si un Peón avanza dos casillas y tras la jugada aún conserva su identidad de
                    Peón (porque no hubo socio elegible), puede ser capturado al paso en el turno
                    inmediato. Si al avanzar dos casillas se transforma en otra pieza, deja de ser un
                    peón vulnerable al paso.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#222A36] border border-slate-700/70">
                  <h4 className="font-display font-bold text-[#B8FF3B] mb-1 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    Jaque, Jaque Mate y Tablas
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Todos los estados de jaque, jaque mate, rey ahogado, insuficiencia de material,
                    regla de 50 movimientos y triple repetición se evalúan sobre el tablero resultante
                    <strong> después del intercambio</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#222A36] border-t border-slate-700/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <HelpCircle className="w-4 h-4 text-[#B8FF3B]" />
            <span>Todo el motor corre 100% local sin conexión a servidores externos.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#B8FF3B] hover:bg-[#CBFF66] text-[#080B11] font-display font-bold text-sm transition-colors"
          >
            ¡Entendido, a jugar!
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Code2,
  ExternalLink,
  Eye,
  Heart,
  KeyRound,
  Lock,
  Sparkles,
  Terminal,
  Unlock,
  X,
} from 'lucide-react';
import { ORIGINAL_2019_HTML_SOURCE } from '../../lib/originalMiPaginaSource';
import { loadEasterEggUnlocked, saveEasterEggUnlocked } from '../../lib/storage';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Normalizes user answer to check if they answered "rochin"
 * (accepts "rochin", "rochín", "profe rochin", "profesor rochin", etc., case-insensitively).
 */
export function isRochinAnswerCorrect(input: string): boolean {
  const normalized = input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return (
    normalized === 'rochin' ||
    normalized === 'profe rochin' ||
    normalized === 'profesor rochin' ||
    normalized.includes('rochin')
  );
}

export const EasterEggModal: React.FC<EasterEggModalProps> = ({ isOpen, onClose }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => loadEasterEggUnlocked());
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'framed' | 'source'>('framed');

  if (!isOpen) return null;

  const miPaginaUrl = `${import.meta.env.BASE_URL}mipagina/index.html`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRochinAnswerCorrect(answer)) {
      setIsUnlocked(true);
      saveEasterEggUnlocked(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Respuesta incorrecta... Pista: Una leyenda del CETis 107.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
    >
      {!isUnlocked ? (
        /* Challenge Prompt: "¿Cuál es el mejor profesor del CETis 107?" */
        <div className="w-full max-w-md rounded-2xl bg-[#1A1F24] border-2 border-[#B8FF3B]/50 p-6 shadow-[0_0_50px_rgba(184,255,59,0.18)]">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF3B]/15 text-[#B8FF3B] text-xs font-mono font-bold">
              <Lock className="w-3.5 h-3.5" />
              ARCHIVO CLASIFICADO · CETis 107
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222A36]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2
            id="easter-egg-title"
            className="font-display font-black text-2xl text-[#F8FAFC] leading-tight"
          >
            ¿Cuál es el mejor profesor del CETis 107??
          </h2>
          <p className="mt-2 text-xs text-[#94A3B8]">
            Responde correctamente para desbloquear la cápsula del tiempo original de este
            repositorio (25 de febrero de 2019).
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="cetis-answer-input" className="sr-only">
                Respuesta secreta
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="cetis-answer-input"
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Escribe el apellido del profe..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080B11] border border-slate-700 focus:border-[#B8FF3B] focus:outline-none text-[#F8FAFC] font-mono text-sm"
                />
              </div>
              {errorMsg && (
                <p className="mt-2 text-xs text-red-400 font-medium">{errorMsg}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#222A36] hover:bg-slate-700 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#B8FF3B] hover:bg-[#CBFF66] text-[#080B11] font-display font-black text-sm transition-colors flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Desbloquear
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Unlocked Museum Frame displaying the untouched 2019 `mipagina/index.html` */
        <div className="w-full max-w-6xl h-[90vh] flex flex-col rounded-2xl bg-[#14181F] border-2 border-[#B8FF3B]/60 shadow-[0_0_60px_rgba(184,255,59,0.2)] overflow-hidden">
          {/* Top Museum Plaque Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#222A36] border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#B8FF3B] text-[#080B11]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="easter-egg-title"
                    className="font-display font-black text-base sm:text-lg text-[#F8FAFC]"
                  >
                    CÁPSULA DEL TIEMPO (2019) — &ldquo;EDGARDO / AJEDREZ&rdquo;
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-mono">
                    <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                    Código 100% Original Intacto
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Mi primera página web hecha en el CETis 107 hace ~7 años (25 Feb 2019 · Profe
                  Rochin). Conservada en <code className="text-[#B8FF3B]">mipagina/index.html</code>{' '}
                  sin mover ni alterar una sola línea.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('framed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'framed'
                    ? 'bg-[#B8FF3B] text-[#080B11]'
                    : 'bg-[#1A1F24] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Cuadro Interactivo
              </button>

              <button
                type="button"
                onClick={() => setViewMode('source')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'source'
                    ? 'bg-[#B8FF3B] text-[#080B11]'
                    : 'bg-[#1A1F24] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Código HTML Original (2019)
              </button>

              <a
                href={miPaginaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir Vista Original
              </a>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar cápsula del tiempo"
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A1F24]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Museum Frame Body */}
          <div className="flex-1 bg-[#080B11] p-3 sm:p-5 overflow-hidden flex flex-col">
            {viewMode === 'framed' ? (
              <div className="flex-1 flex flex-col rounded-xl overflow-hidden border-4 border-amber-500/40 shadow-inner bg-[#B40404]">
                {/* Retro Browser Address Bar */}
                <div className="px-3 py-1.5 bg-[#1A1F24] border-b border-slate-700 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-[#F8FAFC]">
                      file:///CETis107/2019/mipagina/index.html — &lt;title&gt;EDGARDO&lt;/title&gt;
                    </span>
                  </div>
                  <span className="text-[#B8FF3B]">bgcolor=&quot;#B40404&quot;</span>
                </div>

                <iframe
                  src={miPaginaUrl}
                  title="EDGARDO - Primera página web de Ajedrez (2019)"
                  className="w-full flex-1 bg-[#B40404]"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-[#0D1117]">
                <div className="px-4 py-2 bg-[#161B22] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                  <span className="flex items-center gap-2 text-[#B8FF3B]">
                    <Terminal className="w-3.5 h-3.5" />
                    mipagina/index.html (Commit faa561ba · 25 Feb 2019 · 133 líneas intactas)
                  </span>
                  <span>HTML Puro</span>
                </div>
                <pre className="flex-1 p-4 overflow-auto text-xs font-mono text-slate-200 leading-relaxed">
                  <code>{ORIGINAL_2019_HTML_SOURCE}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

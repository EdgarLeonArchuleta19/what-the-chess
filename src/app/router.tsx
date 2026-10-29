import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { EasterEggModal } from '../components/ui/EasterEggModal';
import { RulesModal } from '../components/ui/RulesModal';
import { LocalGameScreen } from '../features/local-game/components/LocalGameScreen';
import { MainMenuScreen } from '../features/local-game/components/MainMenuScreen';

export type AppRoute = 'menu' | 'game';

export const AppRouter: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>('menu');
  const [rulesModalState, setRulesModalState] = useState<{
    isOpen: boolean;
    tab: 'tutorial' | 'rules' | 'special';
  }>({
    isOpen: false,
    tab: 'tutorial',
  });
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-[#F8FAFC]">
      <Header
        currentView={route}
        onNavigateMenu={() => setRoute('menu')}
        onStartGame={() => setRoute('game')}
        onOpenRules={() => setRulesModalState({ isOpen: true, tab: 'rules' })}
        onOpenEasterEgg={() => setIsEasterEggOpen(true)}
      />

      <main className="flex-1">
        {route === 'menu' ? (
          <MainMenuScreen
            onStartLocalGame={() => setRoute('game')}
            onOpenHowToPlay={() =>
              setRulesModalState({ isOpen: true, tab: 'tutorial' })
            }
            onOpenRules={() => setRulesModalState({ isOpen: true, tab: 'rules' })}
          />
        ) : (
          <LocalGameScreen
            onReturnToMainMenu={() => setRoute('menu')}
            onOpenRules={() => setRulesModalState({ isOpen: true, tab: 'rules' })}
          />
        )}
      </main>

      <footer className="py-5 px-4 border-t border-slate-800/80 text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-display font-bold text-[#F8FAFC]">
            What The Chess?!{' '}
            <span className="font-normal text-[#94A3B8]">
              — Ajedrez... pero nada es lo que parece.
            </span>
          </p>
          <p className="font-mono text-[11px]">
            Multijugador Local · Motor Determinista Offline
          </p>
        </div>
      </footer>

      <RulesModal
        isOpen={rulesModalState.isOpen}
        initialTab={rulesModalState.tab}
        onClose={() =>
          setRulesModalState((prev) => ({ ...prev, isOpen: false }))
        }
      />

      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />
    </div>
  );
};

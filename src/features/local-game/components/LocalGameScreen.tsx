import React, { useState } from 'react';
import { Award, RotateCcw, ShieldAlert } from 'lucide-react';
import { ChessBoard } from '../../chess/components/ChessBoard';
import { PromotionDialog } from '../../chess/components/PromotionDialog';
import { SwapBanner } from '../../chess/components/SwapBanner';
import { MoveHistoryPanel } from '../../history/MoveHistoryPanel';
import { PlayerCard } from './PlayerCard';
import { GameControlsPanel } from './GameControlsPanel';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useLocalGame } from '../hooks/useLocalGame';

interface LocalGameScreenProps {
  onReturnToMainMenu: () => void;
  onOpenRules: () => void;
}

export const LocalGameScreen: React.FC<LocalGameScreenProps> = ({
  onReturnToMainMenu,
  onOpenRules,
}) => {
  const {
    gameState,
    selectedSquare,
    legalMovesForSelected,
    pendingPromotion,
    invalidMoveError,
    preferences,
    canUndo,
    canRedo,
    handleSquareClick,
    handleSelectPromotion,
    handleCancelPromotion,
    handleUndo,
    handleRedo,
    handleRestartMatch,
    handleResignMatch,
    handleRotateBoard,
    handleToggleAutoRotate,
    handleToggleSwapPreview,
    dismissError,
  } = useLocalGame();

  const [confirmDialog, setConfirmDialog] = useState<
    'restart' | 'resign' | 'menu' | null
  >(null);

  const topPlayerColor = preferences.boardOrientation === 'w' ? 'b' : 'w';
  const bottomPlayerColor = preferences.boardOrientation === 'w' ? 'w' : 'b';

  const getPlayerProps = (color: 'w' | 'b') => {
    const isWhite = color === 'w';
    const enemyColor = isWhite ? 'b' : 'w';
    return {
      color,
      name: isWhite ? preferences.whitePlayerName : preferences.blackPlayerName,
      isActiveTurn: !gameState.status.isGameOver && gameState.turn === color,
      isInCheck: gameState.status.inCheck && gameState.turn === color,
      isWinner: gameState.status.winner === color,
      capturedByPlayer: gameState.capturedPieces[enemyColor],
    };
  };

  const handleRequestMenu = () => {
    if (gameState.moveHistory.length > 0 && !gameState.status.isGameOver) {
      setConfirmDialog('menu');
    } else {
      onReturnToMainMenu();
    }
  };

  const handleRequestRestart = () => {
    if (gameState.moveHistory.length > 0) {
      setConfirmDialog('restart');
    } else {
      handleRestartMatch();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Column: Board + Player Bars + Swap Notification */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-3.5">
          {/* Top Player Card */}
          <PlayerCard {...getPlayerProps(topPlayerColor)} />

          {/* Main 8x8 Chessboard */}
          <ChessBoard
            pieces={gameState.pieces}
            orientation={preferences.boardOrientation}
            selectedSquare={selectedSquare}
            legalMoves={legalMovesForSelected}
            lastMove={gameState.lastMove}
            lastSwap={gameState.lastSwap}
            checkedKingSquare={gameState.status.checkedKingSquare}
            showCoordinates={preferences.showCoordinates}
            showSwapPreview={preferences.showSwapPreview}
            onSquareClick={handleSquareClick}
          />

          {/* Bottom Player Card */}
          <PlayerCard {...getPlayerProps(bottomPlayerColor)} />
        </div>

        {/* Right Column: Status Banner, Swap Notification, Move History & Controls */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-4">
          {/* Match Status Header Card */}
          <div
            className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${
              gameState.status.isGameOver
                ? 'bg-[#B8FF3B]/15 border-[#B8FF3B]'
                : gameState.status.inCheck
                  ? 'bg-red-500/15 border-red-500/60'
                  : 'bg-[#222A36] border-slate-700/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  gameState.status.isGameOver
                    ? 'bg-[#B8FF3B] text-[#080B11]'
                    : gameState.status.inCheck
                      ? 'bg-red-500 text-white'
                      : 'bg-[#1A1F24] text-[#B8FF3B]'
                }`}
              >
                {gameState.status.isGameOver ? (
                  <Award className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  Estado de la Partida
                </span>
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#F8FAFC]">
                  {gameState.status.statusMessage}
                </h2>
              </div>
            </div>

            {gameState.status.isGameOver && (
              <button
                type="button"
                onClick={handleRestartMatch}
                className="px-3.5 py-2 rounded-xl bg-[#B8FF3B] hover:bg-[#CBFF66] text-[#080B11] font-display font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revancha</span>
              </button>
            )}
          </div>

          {/* Live Swap Notification / Invalid Move Alert */}
          <SwapBanner
            lastSwap={gameState.lastSwap}
            invalidMoveError={invalidMoveError}
            onDismissError={dismissError}
          />

          {/* Move History */}
          <MoveHistoryPanel moves={gameState.moveHistory} />

          {/* Match Controls */}
          <GameControlsPanel
            canUndo={canUndo}
            canRedo={canRedo}
            isGameOver={gameState.status.isGameOver}
            preferences={preferences}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onRotateBoard={handleRotateBoard}
            onToggleAutoRotate={handleToggleAutoRotate}
            onToggleSwapPreview={handleToggleSwapPreview}
            onRequestRestart={handleRequestRestart}
            onRequestResign={() => setConfirmDialog('resign')}
            onOpenRules={onOpenRules}
            onRequestMainMenu={handleRequestMenu}
          />
        </div>
      </div>

      {/* Promotion Picker Modal */}
      <PromotionDialog
        isOpen={Boolean(pendingPromotion)}
        color={gameState.turn}
        targetSquare={pendingPromotion?.to ?? null}
        onSelect={handleSelectPromotion}
        onCancel={handleCancelPromotion}
      />

      {/* Restart Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog === 'restart'}
        title="¿Reiniciar la partida actual?"
        description="Se perderá el progreso actual del tablero y el historial de intercambios. ¿Deseas comenzar una partida nueva desde cero?"
        confirmLabel="Sí, reiniciar partida"
        variant="danger"
        onConfirm={() => {
          setConfirmDialog(null);
          handleRestartMatch();
        }}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* Resign Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog === 'resign'}
        title={`¿Rendirse con las ${gameState.turn === 'w' ? 'Blancas' : 'Negras'}?`}
        description={`Si te rindes ahora, la victoria será otorgada inmediatamente a las ${
          gameState.turn === 'w' ? 'Negras' : 'Blancas'
        }.`}
        confirmLabel="Confirmar rendición"
        variant="danger"
        onConfirm={() => {
          setConfirmDialog(null);
          handleResignMatch();
        }}
        onCancel={() => setConfirmDialog(null)}
      />

      {/* Return to Menu Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog === 'menu'}
        title="¿Salir al menú principal?"
        description="Hay una partida local en curso. Si regresas al menú principal se cerrará la partida actual."
        confirmLabel="Salir al menú"
        variant="accent"
        onConfirm={() => {
          setConfirmDialog(null);
          onReturnToMainMenu();
        }}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
};

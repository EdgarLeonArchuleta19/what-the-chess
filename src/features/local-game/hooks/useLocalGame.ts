import { useCallback, useMemo, useState } from 'react';
import type {
  GameStateSnapshot,
  LegalMoveOption,
  LocalPreferences,
  PieceColor,
  PromotionPieceType,
  Square,
} from '../../chess/types/chess.types';
import {
  applyMoveAndSwap,
  createInitialGameState,
  getLegalMovesForSquare,
  isPromotionMove,
  resignMatch,
} from '../../chess/engine/chessGameEngine';
import { loadPreferences, savePreferences } from '../../../lib/storage';

export function useLocalGame() {
  const [gameState, setGameState] = useState<GameStateSnapshot>(() =>
    createInitialGameState()
  );
  const [undoStack, setUndoStack] = useState<GameStateSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<GameStateSnapshot[]>([]);

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [invalidMoveError, setInvalidMoveError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState<LocalPreferences>(() =>
    loadPreferences()
  );

  const updatePreferences = useCallback(
    (updater: (prev: LocalPreferences) => LocalPreferences) => {
      setPreferences((prev) => {
        const next = updater(prev);
        savePreferences(next);
        return next;
      });
    },
    []
  );

  const legalMovesForSelected: LegalMoveOption[] = useMemo(() => {
    if (!selectedSquare) return [];
    return getLegalMovesForSquare(gameState, selectedSquare);
  }, [gameState, selectedSquare]);

  const commitMove = useCallback(
    (from: Square, to: Square, promotion?: PromotionPieceType) => {
      const result = applyMoveAndSwap(gameState, { from, to, promotion });
      if (!result.ok) {
        setInvalidMoveError(result.error);
        return false;
      }

      setUndoStack((prev) => [...prev, gameState]);
      setRedoStack([]);
      setGameState(result.nextState);
      setSelectedSquare(null);
      setPendingPromotion(null);
      setInvalidMoveError(null);

      // Auto-rotate board if enabled and game is still active
      if (preferences.autoRotateBoard && !result.nextState.status.isGameOver) {
        updatePreferences((prev) => ({
          ...prev,
          boardOrientation: result.nextState.turn,
        }));
      }

      return true;
    },
    [gameState, preferences.autoRotateBoard, updatePreferences]
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (gameState.status.isGameOver) {
        return;
      }

      const clickedPiece = gameState.pieces[square];

      // If no square is currently selected
      if (!selectedSquare) {
        if (!clickedPiece) {
          return;
        }
        if (clickedPiece.color !== gameState.turn) {
          const turnName = gameState.turn === 'w' ? 'Blancas' : 'Negras';
          setInvalidMoveError(
            `Esa pieza pertenece al rival. Es el turno de las ${turnName}.`
          );
          return;
        }
        setSelectedSquare(square);
        setInvalidMoveError(null);
        return;
      }

      // Clicking the already selected square deselects it
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setInvalidMoveError(null);
        return;
      }

      // Clicking another friendly piece switches selection to it
      if (clickedPiece && clickedPiece.color === gameState.turn) {
        setSelectedSquare(square);
        setInvalidMoveError(null);
        return;
      }

      // Check if `square` is a legal destination for `selectedSquare`
      const isLegalTarget = legalMovesForSelected.some((m) => m.to === square);
      if (!isLegalTarget) {
        setInvalidMoveError(
          `Movimiento ilegal: la pieza en ${selectedSquare.toUpperCase()} no puede moverse a ${square.toUpperCase()}.`
        );
        return;
      }

      // Check if the move is a pawn promotion
      if (isPromotionMove(gameState, selectedSquare, square)) {
        setPendingPromotion({ from: selectedSquare, to: square });
        setInvalidMoveError(null);
        return;
      }

      commitMove(selectedSquare, square);
    },
    [
      commitMove,
      gameState,
      legalMovesForSelected,
      selectedSquare,
    ]
  );

  const handleSelectPromotion = useCallback(
    (promotionPiece: PromotionPieceType) => {
      if (!pendingPromotion) return;
      commitMove(pendingPromotion.from, pendingPromotion.to, promotionPiece);
    },
    [commitMove, pendingPromotion]
  );

  const handleCancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [gameState, ...prev]);
    setGameState(previousState);
    setSelectedSquare(null);
    setPendingPromotion(null);
    setInvalidMoveError(null);

    if (preferences.autoRotateBoard) {
      updatePreferences((prev) => ({
        ...prev,
        boardOrientation: previousState.turn,
      }));
    }
  }, [gameState, preferences.autoRotateBoard, undoStack, updatePreferences]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setUndoStack((prev) => [...prev, gameState]);
    setGameState(nextState);
    setSelectedSquare(null);
    setPendingPromotion(null);
    setInvalidMoveError(null);

    if (preferences.autoRotateBoard) {
      updatePreferences((prev) => ({
        ...prev,
        boardOrientation: nextState.turn,
      }));
    }
  }, [gameState, preferences.autoRotateBoard, redoStack, updatePreferences]);

  const handleRestartMatch = useCallback(() => {
    const fresh = createInitialGameState();
    setGameState(fresh);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedSquare(null);
    setPendingPromotion(null);
    setInvalidMoveError(null);

    if (preferences.autoRotateBoard) {
      updatePreferences((prev) => ({
        ...prev,
        boardOrientation: 'w',
      }));
    }
  }, [preferences.autoRotateBoard, updatePreferences]);

  const handleResignMatch = useCallback(() => {
    setUndoStack((prev) => [...prev, gameState]);
    setRedoStack([]);
    setGameState((prev) => resignMatch(prev, prev.turn));
    setSelectedSquare(null);
    setPendingPromotion(null);
    setInvalidMoveError(null);
  }, [gameState]);

  const handleRotateBoard = useCallback(() => {
    updatePreferences((prev) => ({
      ...prev,
      boardOrientation: (prev.boardOrientation === 'w' ? 'b' : 'w') as PieceColor,
    }));
  }, [updatePreferences]);

  const handleToggleAutoRotate = useCallback(() => {
    updatePreferences((prev) => {
      const nextAuto = !prev.autoRotateBoard;
      return {
        ...prev,
        autoRotateBoard: nextAuto,
        boardOrientation: nextAuto ? gameState.turn : prev.boardOrientation,
      };
    });
  }, [gameState.turn, updatePreferences]);

  const handleToggleSwapPreview = useCallback(() => {
    updatePreferences((prev) => ({
      ...prev,
      showSwapPreview: !prev.showSwapPreview,
    }));
  }, [updatePreferences]);

  const dismissError = useCallback(() => {
    setInvalidMoveError(null);
  }, []);

  return {
    gameState,
    selectedSquare,
    legalMovesForSelected,
    pendingPromotion,
    invalidMoveError,
    preferences,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
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
  };
}

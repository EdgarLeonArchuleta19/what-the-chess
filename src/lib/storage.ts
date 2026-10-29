import type { LocalPreferences } from '../features/chess/types/chess.types';

const PREFERENCES_STORAGE_KEY = 'what-the-chess:preferences:v1';
const EASTER_EGG_UNLOCKED_KEY = 'what-the-chess:rochin-unlocked:v1';

export const DEFAULT_PREFERENCES: LocalPreferences = {
  autoRotateBoard: false,
  boardOrientation: 'w',
  showSwapPreview: true,
  showCoordinates: true,
  whitePlayerName: 'Jugador 1 (Blancas)',
  blackPlayerName: 'Jugador 2 (Negras)',
};

export function loadPreferences(): LocalPreferences {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<LocalPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: LocalPreferences): void {
  try {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota or private mode errors — localStorage is strictly optional
  }
}

export function loadEasterEggUnlocked(): boolean {
  try {
    return window.localStorage.getItem(EASTER_EGG_UNLOCKED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveEasterEggUnlocked(unlocked: boolean): void {
  try {
    window.localStorage.setItem(EASTER_EGG_UNLOCKED_KEY, String(unlocked));
  } catch {
    // Ignore storage errors
  }
}

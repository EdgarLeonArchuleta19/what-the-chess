import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../app/App';

describe('What The Chess?! — Full Application & Easter Egg UI Tests', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the main menu with tagline, rules, about section, and starts a local game', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getAllByText(/Ajedrez\.\.\. pero nada es lo que parece\./i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Every move changes the game\./i)).toBeInTheDocument();
    expect(screen.getByText(/Reglas del Juego/i)).toBeInTheDocument();
    expect(screen.getByText(/Acerca del juego/i)).toBeInTheDocument();

    const startButtons = screen.getAllByRole('button', { name: /Jugar local/i });
    await user.click(startButtons[0]);

    // Verify the 8x8 chessboard is rendered
    expect(
      screen.getByRole('grid', { name: /Tablero de ajedrez What The Chess\?!/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('square-e2')).toBeInTheDocument();
    expect(screen.getByTestId('square-g1')).toBeInTheDocument();
  });

  it('plays a move on the board, triggers a swap notification, and supports undo/redo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const startButtons = screen.getAllByRole('button', { name: /Jugar local/i });
    await user.click(startButtons[0]);

    // Click White Knight on g1, then legal target f3
    await user.click(screen.getByTestId('square-g1'));
    await user.click(screen.getByTestId('square-f3'));

    // Move history should now show 1 jugada and turn should be Black's
    expect(screen.getByText(/Turno de las Negras/i)).toBeInTheDocument();
    expect(screen.getByText(/1 jugada/i)).toBeInTheDocument();

    // Undo the move
    const undoBtn = screen.getByRole('button', { name: /Deshacer/i });
    await user.click(undoBtn);
    expect(screen.getByText(/Turno de las Blancas/i)).toBeInTheDocument();
    expect(screen.getByText(/0 jugadas/i)).toBeInTheDocument();

    // Redo the move
    const redoBtn = screen.getByRole('button', { name: /Rehacer/i });
    await user.click(redoBtn);
    expect(screen.getByText(/Turno de las Negras/i)).toBeInTheDocument();
    expect(screen.getByText(/1 jugada/i)).toBeInTheDocument();
  });

  it('unlocks the 2019 CETis 107 Easter Egg when answering "rochin"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const secretButton = screen.getByRole('button', {
      name: /Icono misterioso CETis 107/i,
    });
    await user.click(secretButton);

    expect(
      screen.getByText(/¿Cuál es el mejor profesor del CETis 107\?\?/i)
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Escribe el apellido del profe/i);
    await user.type(input, 'rochin');

    const unlockButton = screen.getByRole('button', { name: /Desbloquear/i });
    await user.click(unlockButton);

    // Should unlock and show the 2019 Time Capsule with iframe and original view link
    expect(
      screen.getByText(/CÁPSULA DEL TIEMPO \(2019\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Abrir Vista Original/i })
    ).toHaveAttribute('href', expect.stringContaining('mipagina/index.html'));
  });
});

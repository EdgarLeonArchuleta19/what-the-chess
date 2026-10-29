# What The Chess?!

> **"Ajedrez... pero nada es lo que parece."**  
> *Every move changes the game.*

**What The Chess?!** es un videojuego web de ajedrez multijugador local para dos jugadores en el mismo dispositivo donde **cada movimiento válido desencadena un intercambio determinista de identidades entre tus propias piezas**.

Construido con **React 19**, **TypeScript (modo estricto)**, **Vite**, **Tailwind CSS**, **chess.js** y validado con **Vitest** + **React Testing Library**. Funciona 100 % en el navegador y completamente offline tras cargar los recursos estáticos.

---

## Características Principales

- **Mecánica de Intercambio Determinista (Cero Azar):** Al completar cualquier movimiento legal de ajedrez, la pieza que acabas de mover intercambia su identidad (y capacidades de movimiento) con la pieza aliada elegible más cercana en el tablero.
- **Multijugador Local para 2 Jugadores:** Alternancia de turnos entre Blancas y Negras en el mismo dispositivo, con rotación manual o automática del tablero, previsualización en vivo del socio de intercambio (`⇄ SOCIO`), historial algebraico completo y bandeja de piezas capturadas.
- **Motor Desacoplado y Seguro:** Integración rigurosa con `chess.js` que garantiza posiciones FEN válidas en todo momento, rastreo de derechos de enroque, captura al paso (*en passant*), coronación, y evaluación de jaque, jaque mate, rey ahogado y tablas **después** de cada intercambio.
- **Deshacer / Rehacer Completo:** Pila de estados inmutables (`GameStateSnapshot`) que restaura con exactitud el tablero, metadatos de cada pieza, capturas e historial.
- **Cápsula del Tiempo (Easter Egg CETis 107 — 2019):** Conserva intacto, sin alterar ni un solo byte, el directorio original `mipagina/` con la primera página web creada por el autor el 25 de febrero de 2019 en el CETis 107.

---

## Reglas de la Variante (Intercambio de Identidades)

1. **Movimiento Legal:** El jugador en turno selecciona una pieza de su color y realiza un movimiento válido según su identidad actual.
2. **Capturas y Coronación:** Las capturas se resuelven normalmente antes del intercambio. Si un peón alcanza la fila `8` o `1`, primero corona (`Dama`, `Torre`, `Alfil` o `Caballo`) y luego participa en el intercambio con su nueva identidad.
3. **Elegibilidad del Socio de Intercambio:**
   - Debe pertenecer al **mismo jugador** (`w` o `b`).
   - Debe ocupar una casilla distinta a la casilla de destino.
   - Debe tener una **identidad distinta** a la de la pieza que se movió (`type !== movedPiece.type`).
   - **Restricción del Rey:** El Rey (`k`) **nunca** participa en intercambios de identidad, ni al moverse (incluyendo el enroque) ni como socio.
   - **Restricción de Filas de Peones:** Ningún Peón (`p`) puede terminar en la fila `1` ni en la fila `8`. Por tanto, un peón en las filas `2–7` no puede intercambiar con una pieza situada en la fila `1` o `8`, y una pieza que aterrice en la fila `1` o `8` no puede intercambiar con un peón.
4. **Selección 100 % Determinista:**
   - Entre todas las piezas aliadas elegibles, se elige aquella con la **menor distancia Manhattan** (`|Δcolumna| + |Δfila|`) respecto a la casilla de destino.
   - En caso de empate en distancia, se desempata por **orden canónico de casilla** (fila `1 → 8`, columna `a → h`).
   - Si no existe ningún socio elegible, el movimiento es válido y no ocurre intercambio.
5. **Evaluación Post-Intercambio:** El jaque (`+`), jaque mate (`#`), rey ahogado (*stalemate*), insuficiencia de material, regla de los 50 movimientos y triple repetición se evalúan sobre el estado final del tablero tras el intercambio.

---

## Cápsula del Tiempo: Easter Egg Original (2019)

Este repositorio alberga también la primera página web escrita por el autor en febrero de 2019 (`mipagina/index.html` y sus recursos multimedia originales).

- **Cómo desbloquearlo en el juego:** Haz clic en el icono misterioso **`107?`** situado en la esquina superior derecha de la barra de navegación y responde a la pregunta:
  > *¿Cuál es el mejor profesor del CETis 107??*  
  > Respuesta: **`rochin`**
- Al desbloquearse, podrás explorar la página original de 2019 enmarcada como pieza de museo interactiva, inspeccionar sus 133 líneas originales de código HTML puro o abrirla directamente en su vista original completa.

---

## Estructura del Proyecto

```text
src/
  app/
    App.tsx                        # Punto de entrada de la aplicación
    router.tsx                     # Navegación local (Menú, Partida, Modales)
  components/
    ui/
      ConfirmModal.tsx             # Diálogos de confirmación para acciones destructivas
      EasterEggModal.tsx           # Reto CETis 107 ("rochin") y visor de mipagina (2019)
      RulesModal.tsx               # Reglamento interactivo y tutorial
    layout/
      Header.tsx                   # Barra superior e icono secreto 107?
    chess/
      ChessPieceSvg.tsx            # Set de piezas vectoriales SVG personalizadas
      ConfusedKnightMascot.tsx     # Ilustración SVG de la mascota Caballo Confundido
      Wordmark.tsx                 # Logotipo tipográfico What The Chess?!
  features/
    chess/
      engine/
        chessGameEngine.ts         # Motor de ajedrez + integración con swapEngine
        chessGameEngine.test.ts    # Pruebas unitarias del motor y casos límite
      components/
        ChessBoard.tsx             # Tablero 8x8 interactivo con previsualización de swap
        PromotionDialog.tsx        # Selector de pieza al coronar peón
        SwapBanner.tsx             # Notificaciones dinámicas de intercambio y alertas
      types/
        chess.types.ts             # Interfaces estrictas de estado, piezas e historial
    swapping/
      swapRules.ts                 # Reglas de elegibilidad, distancias y desempate canónico
      swapEngine.ts                # Selección determinista, permutación y serialización FEN
      swapNotifications.ts         # Generador de mensajes veraces de intercambio
      swapEngine.test.ts           # Pruebas unitarias del motor de intercambio
    local-game/
      components/
        MainMenuScreen.tsx         # Pantalla de inicio, reglas y acerca del juego
        LocalGameScreen.tsx        # Pantalla principal de partida local
        PlayerCard.tsx             # Tarjetas de jugador, turno, jaque y capturas
        GameControlsPanel.tsx      # Controles (girar, deshacer, rehacer, reiniciar, rendirse)
      hooks/
        useLocalGame.ts            # Hook de estado de partida y persistencia opcional
    history/
      MoveHistoryPanel.tsx         # Historial cronológico con notación SAN y etiquetas ⇄
  lib/
    storage.ts                     # Persistencia opcional en localStorage
    originalMiPaginaSource.ts      # Fuente histórico de mipagina/index.html (2019)
  test/
    setup.ts                       # Configuración de Vitest + Testing Library
    App.test.tsx                   # Pruebas de integración de interfaz y Easter Egg
mipagina/                          # Proyecto original intacto del 25 de febrero de 2019
```

---

## Instalación y Uso Local

### Requisitos previos
- **Node.js** 20+ y **npm**

### Comandos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Ejecutar suite de pruebas automatizadas (Vitest)
npm test

# 4. Verificar tipos de TypeScript y generar build de producción
npm run build

# 5. Previsualizar build de producción localmente
npm run preview
```

---

## Despliegue en GitHub Pages

El proyecto está preconfigurado con `base: './'` en `vite.config.ts` y un plugin que empaqueta automáticamente la carpeta histórica `mipagina/` dentro de `dist/mipagina/` sin alterar los archivos originales.

1. En tu repositorio de GitHub, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Al hacer push a la rama `main` (o ejecutar manualmente el workflow `.github/workflows/deploy.yml`), GitHub Actions ejecutará las pruebas, compilará la aplicación y la publicará automáticamente.

---

## Extensión Futura (Multijugador Online)

El estado de la partida (`GameStateSnapshot`) y las funciones puras del motor (`applyMoveAndSwap`, `createInitialGameState`, `resignMatch`) están completamente desacoplados de React. En una versión futura se puede sincronizar `MoveInput` (`{ from, to, promotion }`) o `GameStateSnapshot` entre clientes remotos sin reescribir la lógica del juego ni el motor de intercambios.

---

## Licencia

Distribuido bajo la **Licencia de Uso No Comercial con Atribución Obligatoria (Attribution-NonCommercial License)**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

© 2019–2026 **Edgar Leon Archuleta** ([@EdgarLeonArchuleta19](https://github.com/EdgarLeonArchuleta19)).

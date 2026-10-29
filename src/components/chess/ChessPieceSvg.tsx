import React from 'react';
import type { PieceColor, PieceType } from '../../features/chess/types/chess.types';
import { PIECE_NAMES_ES } from '../../features/swapping/swapRules';

interface ChessPieceSvgProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
  isSwappedRecently?: boolean;
}

export const ChessPieceSvg: React.FC<ChessPieceSvgProps> = ({
  type,
  color,
  className = 'w-10 h-10',
  isSwappedRecently = false,
}) => {
  const isWhite = color === 'w';
  const fillPrimary = isWhite ? '#F8FAFC' : '#141923';
  const fillAccent = isWhite ? '#E2E8F0' : '#263042';
  const strokeColor = isWhite ? '#0F172A' : '#E2E8F0';
  const innerDetailColor = isSwappedRecently
    ? '#B8FF3B'
    : isWhite
      ? '#0F172A'
      : '#B8FF3B';

  const label = `${PIECE_NAMES_ES[type]} ${isWhite ? 'Blanco' : 'Negro'}`;

  return (
    <svg
      viewBox="0 0 45 45"
      className={`select-none pointer-events-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.55)] ${className}`}
      role="img"
      aria-label={label}
    >
      {type === 'p' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22.5 9c-3.6 0-6.5 2.9-6.5 6.5 0 2.4 1.3 4.5 3.2 5.6-3.1 1.6-5.2 4.8-5.2 8.4h17c0-3.6-2.1-6.8-5.2-8.4 1.9-1.1 3.2-3.2 3.2-5.6 0-3.6-2.9-6.5-6.5-6.5z"
            fill={fillPrimary}
          />
          <path
            d="M11.5 37h22c0-3.2-2.6-5.5-6.5-5.5h-9c-3.9 0-6.5 2.3-6.5 5.5z"
            fill={fillAccent}
          />
          <rect x="9.5" y="37" width="26" height="3.5" rx="1.5" fill={fillPrimary} />
          <circle cx="22.5" cy="15.5" r="1.6" fill={innerDetailColor} stroke="none" />
        </g>
      )}

      {type === 'r' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M11 37h23v3.5H11V37zM13 33.5l2-3h15l2 3H13z"
            fill={fillAccent}
          />
          <path
            d="M15 30.5V17h15v13.5H15z"
            fill={fillPrimary}
          />
          <path
            d="M12.5 17h20l-1.5-6.5h-3v2.5h-3v-2.5h-5v2.5h-3v-2.5h-3L12.5 17z"
            fill={fillPrimary}
          />
          <line x1="18" y1="22" x2="27" y2="22" stroke={innerDetailColor} strokeWidth="2" />
        </g>
      )}

      {type === 'n' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
            fill={fillPrimary}
          />
          <path
            d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
            fill={fillPrimary}
          />
          <circle cx="17.5" cy="15.5" r="1.5" fill={innerDetailColor} stroke="none" />
          <rect x="9.5" y="37" width="26" height="3.5" rx="1.5" fill={fillAccent} />
        </g>
      )}

      {type === 'b' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"
            fill={fillAccent}
          />
          <path
            d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"
            fill={fillPrimary}
          />
          <circle cx="22.5" cy="8" r="2.3" fill={fillPrimary} />
          <path
            d="M19.5 18.5h6M22.5 15.5v6"
            stroke={innerDetailColor}
            strokeWidth="2.1"
          />
        </g>
      )}

      {type === 'q' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
            fill={fillPrimary}
          />
          <path
            d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
            fill={fillAccent}
          />
          <circle cx="6" cy="12" r="2" fill={innerDetailColor} />
          <circle cx="14" cy="9" r="2" fill={innerDetailColor} />
          <circle cx="22.5" cy="8" r="2" fill={innerDetailColor} />
          <circle cx="31" cy="9" r="2" fill={innerDetailColor} />
          <circle cx="39" cy="12" r="2" fill={innerDetailColor} />
        </g>
      )}

      {type === 'k' && (
        <g stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" stroke={innerDetailColor} strokeWidth="2.6" />
          <path
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
            fill={fillPrimary}
          />
          <path
            d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7z"
            fill={fillPrimary}
          />
          <path
            d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
            stroke={innerDetailColor}
            strokeWidth="1.6"
          />
        </g>
      )}
    </svg>
  );
};

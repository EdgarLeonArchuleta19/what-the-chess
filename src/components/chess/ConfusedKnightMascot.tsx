import React from 'react';

interface ConfusedKnightMascotProps {
  className?: string;
}

/**
 * Custom SVG Illustration of the "What The Chess?!" Confused Chess-Knight Mascot:
 * Features a stylized knight surrounded by floating question marks, swap arrows, and dizzy eyes.
 */
export const ConfusedKnightMascot: React.FC<ConfusedKnightMascotProps> = ({
  className = 'w-36 h-36',
}) => {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mascota Caballo Confundido de What The Chess?!"
    >
      {/* Background energy halo */}
      <circle
        cx="90"
        cy="94"
        r="68"
        fill="#1A1F24"
        stroke="#B8FF3B"
        strokeWidth="2.5"
        strokeDasharray="8 6"
      />
      <circle cx="90" cy="94" r="56" fill="#222A36" />

      {/* Orbiting swap arrows */}
      <path
        d="M36 62C46 38 72 24 102 28"
        stroke="#B8FF3B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M98 20L107 29L95 34"
        stroke="#B8FF3B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M146 122C136 146 110 160 80 156"
        stroke="#B8FF3B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M84 164L75 155L87 150"
        stroke="#B8FF3B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pedestal base */}
      <rect
        x="48"
        y="134"
        width="84"
        height="14"
        rx="6"
        fill="#B8FF3B"
        stroke="#080B11"
        strokeWidth="3"
      />
      <path
        d="M56 134L62 122H118L124 134H56Z"
        fill="#E2E8F0"
        stroke="#080B11"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Knight Body & Head (tilted playfully in confusion) */}
      <path
        d="M64 122C65 98 86 96 82 76C74 82 63 87 52 84C46 82 44 74 49 67C55 58 67 45 73 39C74 32 72 26 76 23C81 20 88 28 90 32L98 30C102 24 110 21 113 26C115 30 112 36 110 40C126 50 132 74 125 122H64Z"
        fill="#F8FAFC"
        stroke="#080B11"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Electric lime mane highlights */}
      <path
        d="M108 42C118 52 122 68 120 88"
        stroke="#B8FF3B"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Confused / Dizzy Spiral Eye */}
      <circle cx="77" cy="54" r="10" fill="#080B11" />
      <path
        d="M77 54C79 54 80 52 79 50C77 48 74 49 73 52C72 56 75 60 80 59C83 58 85 55 84 51"
        stroke="#B8FF3B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Nostril & quirky wavy mouth */}
      <circle cx="57" cy="73" r="2.5" fill="#080B11" />
      <path
        d="M58 80C64 77 68 82 74 78"
        stroke="#080B11"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Floating Bishop/Queen Ghost Identity Badge above head */}
      <g transform="translate(122, 24) rotate(12)">
        <rect
          x="0"
          y="0"
          width="38"
          height="38"
          rx="10"
          fill="#080B11"
          stroke="#B8FF3B"
          strokeWidth="2.5"
        />
        <text
          x="19"
          y="27"
          textAnchor="middle"
          fill="#B8FF3B"
          fontFamily="Outfit, Space Grotesk, sans-serif"
          fontWeight="900"
          fontSize="22"
        >
          ?!
        </text>
      </g>

      {/* Left floating question mark */}
      <g transform="translate(22, 82) rotate(-16)">
        <rect
          x="0"
          y="0"
          width="28"
          height="28"
          rx="8"
          fill="#222A36"
          stroke="#B8FF3B"
          strokeWidth="2"
        />
        <text
          x="14"
          y="20"
          textAnchor="middle"
          fill="#F8FAFC"
          fontFamily="Outfit, Space Grotesk, sans-serif"
          fontWeight="800"
          fontSize="16"
        >
          ⇄
        </text>
      </g>
    </svg>
  );
};

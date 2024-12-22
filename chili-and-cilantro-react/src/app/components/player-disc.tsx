import { CardType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import React, { useState } from 'react';
import { Hat } from './hat';

export type PatternType = 'dots' | 'swirl' | 'lines';
export const PatternTypes: PatternType[] = ['dots', 'swirl', 'lines'];
export const PatternTypeStrings: string[] = ['Dots', 'Swirl', 'Lines'];
export function patternType(patternTypeString: string): PatternType {
  return PatternTypes[PatternTypeStrings.indexOf(patternTypeString)];
}

interface PlayerDiscProps {
  player: number;
  type: CardType;
  patternType?: PatternType;
  hasBoxShadow?: boolean;
  reveal?: boolean;
  discSize?: number;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  border: string;
}

const PlayerDisc: React.FC<PlayerDiscProps> = ({
  player,
  type,
  patternType = 'dots',
  hasBoxShadow = true,
  reveal = false,
  discSize = 160, // Default disc size
}) => {
  const [isRevealed, setIsRevealed] = useState(reveal);

  // Define theme colors
  const playerThemes: ThemeColors[] = [
    {
      primary: '#1a0f2e',
      secondary: '#D50000',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Chili Red
    {
      primary: '#1a0f2e',
      secondary: '#00C853',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Cilantro Green
    {
      primary: '#1a0f2e',
      secondary: '#ffc107',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Yellow
    {
      primary: '#1a0f2e',
      secondary: '#3f51b5',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Blue
    {
      primary: '#1a0f2e',
      secondary: '#e91e63',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Pink
    {
      primary: '#1a0f2e',
      secondary: '#795548',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Brown
    {
      primary: '#1a0f2e',
      secondary: '#9c27b0',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Purple
    {
      primary: '#1a0f2e',
      secondary: '#009688',
      accent: '#ffd700',
      border: '#b39ddb',
    }, // Teal
  ];

  const iconSrc =
    type === CardType.Chili
      ? 'assets/images/chili.png'
      : 'assets/images/cilantro.png';
  const theme = playerThemes[player - 1] || playerThemes[0];

  const renderBorderDecoration = () => (
    <g className="border-decoration">
      <circle
        cx={discSize / 2}
        cy={discSize / 2}
        r={discSize * 0.42}
        fill="none"
        stroke={theme.border}
        strokeWidth={(discSize / 100) * 3}
      />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g
          key={angle}
          transform={`rotate(${angle}, ${discSize / 2}, ${discSize / 2})`}
        >
          <circle
            cx={discSize / 2}
            cy={(discSize / 100) * 8}
            r={(discSize / 100) * 2}
            fill={theme.accent}
          />
          <path
            d={`M${discSize / 2 - 2},${(discSize / 100) * 8} Q${
              discSize / 2
            },${(discSize / 100) * 6} ${discSize / 2 + 2},${
              (discSize / 100) * 8
            }`}
            fill={theme.accent}
          />
        </g>
      ))}
    </g>
  );

  const renderPattern = () => {
    const dotCount = 50;
    const dotRadius = (discSize / 100) * 2;
    const maxOffset = discSize / 2 - dotRadius;

    switch (patternType) {
      case 'dots':
        return (
          <g className="pattern">
            {[...Array(dotCount)].map((_, i) => {
              const angle = Math.random() * 2 * Math.PI;
              const distance = Math.random() * maxOffset;
              const x = discSize / 2 + distance * Math.cos(angle);
              const y = discSize / 2 + distance * Math.sin(angle);

              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={dotRadius}
                  fill={theme.accent}
                  opacity={Math.random() * 0.5 + 0.3}
                />
              );
            })}
          </g>
        );
      case 'swirl':
        return (
          <g className="pattern">{/* SVG elements for swirl pattern */}</g>
        ); // Implement swirl pattern
      case 'lines':
        return (
          <g className="pattern">{/* SVG elements for lines pattern */}</g>
        ); // Implement lines pattern
      default:
        return null;
    }
  };

  const renderFront = () => {
    const iconSize = discSize / 3;
    return (
      <svg
        viewBox={`0 0 ${discSize} ${discSize}`}
        width={discSize}
        height={discSize}
      >
        <circle
          cx={discSize / 2}
          cy={discSize / 2}
          r={discSize * 0.48}
          fill={theme.primary}
        />
        {renderBorderDecoration()}
        {renderPattern()}
        <Hat
          player={player}
          dropShadowColor={theme.accent}
          fillColor={theme.secondary}
          otherColor={theme.primary}
          size={iconSize}
          x={discSize / 2 - iconSize / 2}
          y={discSize / 2 - iconSize / 2}
        />
      </svg>
    );
  };

  const renderBack = () => {
    const iconSize = discSize / 3;
    return (
      <svg
        viewBox={`0 0 ${discSize} ${discSize}`}
        width={discSize}
        height={discSize}
      >
        <circle
          cx={discSize / 2}
          cy={discSize / 2}
          r={discSize * 0.48}
          fill={theme.secondary}
        />
        {renderBorderDecoration()}
        {renderPattern()}
        <image
          href={iconSrc}
          width={iconSize}
          height={iconSize}
          x={discSize / 2 - iconSize / 2}
          y={discSize / 2 - iconSize / 2}
        />
      </svg>
    );
  };

  return (
    <div
      className={`relative w-[${discSize}px] h-[${discSize}px] cursor-pointer ${
        hasBoxShadow ? 'shadow-md' : ''
      }`}
      onClick={() => setIsRevealed(!isRevealed)}
      style={{ perspective: '1000px' }}
    >
      {/* Flipping container */}
      <div
        className="relative w-full h-full duration-500 rounded-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease-in-out',
          transform: `rotateY(${isRevealed ? 180 : 0}deg)`,
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Conditionally render front face based on isRevealed */}
          {!isRevealed && renderFront()}
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Conditionally render back face based on isRevealed */}
          {isRevealed && renderBack()}
        </div>
      </div>
    </div>
  );
};

export default PlayerDisc;

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

  // Function to render the border decoration
  const renderBorderDecoration = () => {
    const numSkulls = 6;
    const skullRadius = discSize * 0.05;
    const borderInset = discSize * 0.05; // Inset the border by 5% of the disc size

    // Outer circle (slightly inset)
    const outerCircle = (
      <circle
        key="outer-circle"
        cx={discSize / 2}
        cy={discSize / 2}
        r={discSize * 0.48 - borderInset} // Reduce the radius to inset the border
        fill="none"
        stroke={theme.border}
        strokeWidth={(discSize / 100) * 3}
      />
    );

    const skullSvg = (
      <g>
        <circle cx="0" cy="0" r={skullRadius * 0.6} fill={theme.border} />
        <circle
          cx={-skullRadius * 0.4}
          cy={-skullRadius * 0.2}
          r={skullRadius * 0.15}
          fill={theme.primary}
        />
        <circle
          cx={skullRadius * 0.4}
          cy={-skullRadius * 0.2}
          r={skullRadius * 0.15}
          fill={theme.primary}
        />
        <rect
          x={-skullRadius * 0.6}
          y={skullRadius * 0.2}
          width={skullRadius * 1.2}
          height={skullRadius * 0.3}
          fill={theme.border}
        />
      </g>
    );

    const borderElements = [outerCircle];

    for (let i = 0; i < numSkulls; i++) {
      const angle = (i / numSkulls) * 2 * Math.PI;
      const x =
        discSize / 2 +
        (discSize * 0.42 - borderInset) * Math.cos(angle) -
        skullRadius / 2;
      const y =
        discSize / 2 +
        (discSize * 0.42 - borderInset) * Math.sin(angle) -
        skullRadius / 2;
      borderElements.push(
        <g
          key={`skull-${i}`}
          transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`}
        >
          {skullSvg}
        </g>,
      );
    }

    const swirlRadius = discSize * 0.02;
    const swirlPath = `M ${swirlRadius}, 0
                       A ${swirlRadius}, ${swirlRadius} 0 0,1 0, -${swirlRadius}
                       A ${swirlRadius}, ${swirlRadius} 0 0,1 -${swirlRadius}, 0
                       A ${swirlRadius}, ${swirlRadius} 0 0,1 0, ${swirlRadius}
                       A ${swirlRadius}, ${swirlRadius} 0 0,1 ${swirlRadius}, 0`;

    for (let i = 0; i < numSkulls; i++) {
      const angle = ((i + 0.5) / numSkulls) * 2 * Math.PI;
      const x =
        discSize / 2 + (discSize * 0.42 - borderInset) * Math.cos(angle);
      const y =
        discSize / 2 + (discSize * 0.42 - borderInset) * Math.sin(angle);
      borderElements.push(
        <path
          key={`swirl-${i}`}
          d={swirlPath}
          fill="none"
          stroke={theme.border}
          strokeWidth={(discSize / 100) * 1}
          transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI + 90})`}
        />,
      );
    }

    return <g key="border-decoration">{borderElements}</g>;
  };

  // Function to render the pattern
  const renderPattern = () => {
    const dotCount = 50;
    const dotRadius = (discSize / 100) * 2;
    const maxOffset = discSize / 2 - dotRadius;
    const swirlCount = 8;
    const swirlRadius = discSize * 0.08;
    const swirlThickness = (discSize / 100) * 1.5;
    const lineCount = 16;
    const lineLength = discSize * 0.3;
    const lineThickness = (discSize / 100) * 1.5;
    const lineElements = [];
    const swirlElements = [];

    switch (patternType) {
      case 'dots':
        return (
          <g key={'dots'} className="pattern">
            {[...Array(dotCount)].map((_, i) => {
              const angle = Math.random() * 2 * Math.PI;
              const distance = Math.random() * maxOffset;
              const x = discSize / 2 + distance * Math.cos(angle);
              const y = discSize / 2 + distance * Math.sin(angle);

              return (
                <circle
                  key={`dot-${i}`}
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
        for (let i = 0; i < swirlCount; i++) {
          const angle = (i / swirlCount) * 2 * Math.PI;
          const x = discSize / 2 + discSize * 0.3 * Math.cos(angle);
          const y = discSize / 2 + discSize * 0.3 * Math.sin(angle);
          const swirlPath = `M ${x} ${y} 
                             C ${x + swirlRadius * Math.cos(angle + Math.PI / 2)} ${y + swirlRadius * Math.sin(angle + Math.PI / 2)}, 
                               ${x + swirlRadius * 2 * Math.cos(angle)} ${y + swirlRadius * 2 * Math.sin(angle)},
                               ${x + swirlRadius * 3 * Math.cos(angle + Math.PI / 4)} ${y + swirlRadius * 3 * Math.sin(angle + Math.PI / 4)}`;
          swirlElements.push(
            <path
              key={`swirl-pattern-${i}`}
              d={swirlPath}
              fill="none"
              stroke={theme.accent}
              strokeWidth={swirlThickness}
              strokeLinecap="round"
            />,
          );
        }
        return (
          <g key={'swirl'} className="pattern">
            {swirlElements}
          </g>
        );
      case 'lines':
        for (let i = 0; i < lineCount; i++) {
          const angle = (i / lineCount) * 2 * Math.PI;
          const startX = discSize / 2 + discSize * 0.1 * Math.cos(angle);
          const startY = discSize / 2 + discSize * 0.1 * Math.sin(angle);
          const endX = startX + lineLength * Math.cos(angle);
          const endY = startY + lineLength * Math.sin(angle);
          lineElements.push(
            <line
              key={`line-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={theme.accent}
              strokeWidth={lineThickness}
              strokeLinecap="round"
            />,
          );
        }
        return (
          <g key={'lines'} className="pattern">
            {lineElements}
          </g>
        );
      default:
        return null;
    }
  };

  // Function to render the front face
  const renderFront = () => {
    const iconSize = discSize / 3;
    const iconCircleRadius = iconSize * 0.7;

    return (
      <svg
        key={'front'}
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
        {/* Add the background circle for the hat */}
        <circle
          cx={discSize / 2}
          cy={discSize / 2}
          r={iconCircleRadius}
          fill={theme.secondary}
        />
        <Hat
          style={player}
          dropShadowColor={theme.accent}
          fillColor="#fff"
          otherColor={theme.primary}
          size={iconSize}
          x={discSize / 2 - iconSize / 2}
          y={discSize / 2 - iconSize / 2}
        />
      </svg>
    );
  };

  // Function to render the back face
  const renderBack = () => {
    const iconSize = discSize / 3;
    const iconCircleRadius = iconSize * 0.7;

    return (
      <svg
        key={'back'}
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
        {/* Add the background circle for the icon */}
        <circle
          cx={discSize / 2}
          cy={discSize / 2}
          r={iconCircleRadius}
          fill={theme.primary}
        />
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

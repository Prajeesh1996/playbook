import React from 'react';

// Little Colour World custom cute brand & mascot illustrations

export const RainbowLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Little Colour World Rainbow and Star Logo"
  >
    {/* Rainbow Arcs */}
    <path d="M15 75 A 35 35 0 0 1 85 75" stroke="#FF8A65" strokeWidth="8" strokeLinecap="round" />
    <path d="M23 75 A 27 27 0 0 1 77 75" stroke="#FFD93D" strokeWidth="8" strokeLinecap="round" />
    <path d="M31 75 A 19 19 0 0 1 69 75" stroke="#B8F2C8" strokeWidth="8" strokeLinecap="round" />
    <path d="M39 75 A 11 11 0 0 1 61 75" stroke="#6BCBFF" strokeWidth="8" strokeLinecap="round" />
    
    {/* Left Cloud with cute face */}
    <g transform="translate(8, 62)">
      <circle cx="10" cy="10" r="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="18" cy="6" r="11" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <circle cx="26" cy="11" r="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="5" y="10" width="28" height="10" fill="#FFFFFF" />
      {/* Eyes and smile */}
      <circle cx="14" cy="11" r="1.5" fill="#333333" />
      <circle cx="21" cy="11" r="1.5" fill="#333333" />
      <path d="M16 15 Q 17.5 17 19 15" stroke="#333333" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="13" r="1.5" fill="#FFB6C1" opacity="0.8" />
      <circle cx="23" cy="13" r="1.5" fill="#FFB6C1" opacity="0.8" />
    </g>

    {/* Right Smiling Star */}
    <g transform="translate(64, 48)">
      <polygon
        points="14,2 17,10 26,11 19,17 22,25 14,20 6,25 9,17 2,11 11,10"
        fill="#FFD93D"
        stroke="#F59E0B"
        strokeWidth="2"
      />
      <circle cx="11.5" cy="13" r="1.2" fill="#333333" />
      <circle cx="16.5" cy="13" r="1.2" fill="#333333" />
      <path d="M12.5 16 Q 14 17.5 15.5 16" stroke="#333333" strokeWidth="1" strokeLinecap="round" fill="none" />
    </g>

    {/* Cheerful Crayon */}
    <g transform="translate(42, 42) rotate(25)">
      <rect x="0" y="8" width="10" height="24" rx="2" fill="#6BCBFF" stroke="#3B82F6" strokeWidth="1.5" />
      <polygon points="0,8 5,0 10,8" fill="#FFD93D" stroke="#3B82F6" strokeWidth="1.5" />
      <rect x="0" y="16" width="10" height="4" fill="#3B82F6" opacity="0.5" />
    </g>
  </svg>
);

export const SmilingSun: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    {/* Sun Rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1="50"
        y1="14"
        x2="50"
        y2="4"
        stroke="#FFD93D"
        strokeWidth="6"
        strokeLinecap="round"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    {/* Sun Body */}
    <circle cx="50" cy="50" r="30" fill="#FFD93D" stroke="#F59E0B" strokeWidth="3" />
    {/* Cheerful face */}
    <circle cx="40" cy="45" r="3.5" fill="#333333" />
    <circle cx="60" cy="45" r="3.5" fill="#333333" />
    <circle cx="41" cy="43.5" r="1" fill="#FFFFFF" />
    <circle cx="61" cy="43.5" r="1" fill="#FFFFFF" />
    {/* Rosy cheeks */}
    <circle cx="34" cy="53" r="4" fill="#FF8A65" opacity="0.6" />
    <circle cx="66" cy="53" r="4" fill="#FF8A65" opacity="0.6" />
    {/* Big smile */}
    <path d="M42 54 Q 50 64 58 54" stroke="#333333" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

export const FloatingCloud: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 90,
  height = 50,
}) => (
  <svg width={width} height={height} viewBox="0 0 100 60" fill="none" className={className}>
    <path
      d="M20 50 C 10 50 5 40 10 30 C 5 20 20 10 35 15 C 45 5 65 5 75 18 C 88 12 98 25 92 38 C 98 48 88 50 80 50 Z"
      fill="#FFFFFF"
      fillOpacity="0.9"
      stroke="#E2E8F0"
      strokeWidth="2.5"
    />
  </svg>
);

export const CrayonMascot: React.FC<{ color?: string; className?: string; size?: number }> = ({
  color = '#FF8A65',
  className = '',
  size = 48,
}) => (
  <svg width={size} height={size} viewBox="0 0 60 100" fill="none" className={className}>
    {/* Crayon tip */}
    <polygon points="12,30 30,5 48,30" fill={color} stroke="#333333" strokeWidth="3" strokeLinejoin="round" />
    {/* Tip highlight */}
    <polygon points="18,30 30,12 42,30" fill="#FFFFFF" opacity="0.3" />
    {/* Crayon body */}
    <rect x="12" y="30" width="36" height="60" rx="3" fill={color} stroke="#333333" strokeWidth="3" />
    {/* Label wrap */}
    <rect x="12" y="45" width="36" height="30" fill="#FFFFFF" stroke="#333333" strokeWidth="2.5" />
    {/* Wavy line on wrap */}
    <path d="M15 60 Q 22 55 30 60 T 45 60" stroke={color} strokeWidth="2" fill="none" />
    {/* Face */}
    <circle cx="24" cy="53" r="2" fill="#333333" />
    <circle cx="36" cy="53" r="2" fill="#333333" />
    <path d="M26 57 Q 30 60 34 57" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Bottom base */}
    <line x1="12" y1="90" x2="48" y2="90" stroke="#333333" strokeWidth="3" />
  </svg>
);

// Preview line arts for books and printable downloaders
export const LineArtLion: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mane */}
    <circle
      cx="150"
      cy="140"
      r="95"
      fill={isColoured ? '#FFD93D' : '#FFFFFF'}
      stroke="#222222"
      strokeWidth="5"
      strokeDasharray={isColoured ? undefined : 'none'}
    />
    {/* Mane bumps */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x = 150 + Math.cos(rad) * 95;
      const y = 140 + Math.sin(rad) * 95;
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="18"
          fill={isColoured ? '#FFA000' : '#FFFFFF'}
          stroke="#222222"
          strokeWidth="4"
        />
      );
    })}
    {/* Ears */}
    <circle cx="100" cy="80" r="22" fill={isColoured ? '#FFE082' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <circle cx="100" cy="80" r="12" fill={isColoured ? '#FFB6C1' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
    <circle cx="200" cy="80" r="22" fill={isColoured ? '#FFE082' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <circle cx="200" cy="80" r="12" fill={isColoured ? '#FFB6C1' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
    {/* Head */}
    <circle cx="150" cy="140" r="68" fill={isColoured ? '#FFE082' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
    {/* Cheerful Eyes */}
    <circle cx="125" cy="125" r="8" fill={isColoured ? '#222222' : '#222222'} />
    <circle cx="175" cy="125" r="8" fill={isColoured ? '#222222' : '#222222'} />
    <circle cx="127" cy="122" r="3" fill="#FFFFFF" />
    <circle cx="177" cy="122" r="3" fill="#FFFFFF" />
    {/* Rosy Cheeks */}
    <circle cx="110" cy="145" r="8" fill={isColoured ? '#FF8A65' : '#F1F5F9'} stroke="#333333" strokeWidth="2" />
    <circle cx="190" cy="145" r="8" fill={isColoured ? '#FF8A65' : '#F1F5F9'} stroke="#333333" strokeWidth="2" />
    {/* Nose and Muzzle */}
    <polygon points="140,140 160,140 150,152" fill={isColoured ? '#E65100' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <path d="M150 152 L 150 162" stroke="#222222" strokeWidth="4" strokeLinecap="round" />
    <path d="M135 162 Q 150 172 165 162" stroke="#222222" strokeWidth="4" strokeLinecap="round" fill="none" />
    {/* Cute Whiskers */}
    <line x1="90" y1="135" x2="110" y2="138" stroke="#222222" strokeWidth="3" strokeLinecap="round" />
    <line x1="88" y1="145" x2="110" y2="145" stroke="#222222" strokeWidth="3" strokeLinecap="round" />
    <line x1="210" y1="138" x2="190" y2="135" stroke="#222222" strokeWidth="3" strokeLinecap="round" />
    <line x1="212" y1="145" x2="190" y2="145" stroke="#222222" strokeWidth="3" strokeLinecap="round" />
    {/* Paws */}
    <ellipse cx="120" cy="225" rx="25" ry="18" fill={isColoured ? '#FFE082' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <ellipse cx="180" cy="225" rx="25" ry="18" fill={isColoured ? '#FFE082' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <circle cx="112" cy="225" r="4" fill="#222222" />
    <circle cx="122" cy="222" r="4" fill="#222222" />
    <circle cx="132" cy="225" r="4" fill="#222222" />
    <circle cx="172" cy="225" r="4" fill="#222222" />
    <circle cx="182" cy="222" r="4" fill="#222222" />
    <circle cx="192" cy="225" r="4" fill="#222222" />
  </svg>
);

export const LineArtElephant: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big round ears */}
    <path
      d="M50 140 C 30 80 80 50 120 70 C 130 110 110 160 70 170 Z"
      fill={isColoured ? '#90CAF9' : '#FFFFFF'}
      stroke="#222222"
      strokeWidth="5"
    />
    <path
      d="M250 140 C 270 80 220 50 180 70 C 170 110 190 160 230 170 Z"
      fill={isColoured ? '#90CAF9' : '#FFFFFF'}
      stroke="#222222"
      strokeWidth="5"
    />
    {/* Body */}
    <ellipse cx="150" cy="180" rx="65" ry="60" fill={isColoured ? '#BBDEFB' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
    {/* Head */}
    <circle cx="150" cy="120" r="55" fill={isColoured ? '#90CAF9' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
    {/* Cute trunk curling up with water drops */}
    <path
      d="M140 140 Q 140 190 155 190 Q 170 190 170 170 Q 170 155 185 160"
      stroke="#222222"
      strokeWidth="10"
      strokeLinecap="round"
      fill="none"
    />
    {/* Water drops */}
    <circle cx="195" cy="145" r="5" fill={isColoured ? '#6BCBFF' : '#FFFFFF'} stroke="#222222" strokeWidth="2" />
    <circle cx="205" cy="135" r="4" fill={isColoured ? '#6BCBFF' : '#FFFFFF'} stroke="#222222" strokeWidth="2" />
    {/* Eyes */}
    <circle cx="130" cy="110" r="7" fill="#222222" />
    <circle cx="132" cy="108" r="2.5" fill="#FFFFFF" />
    {/* Rosy cheeks */}
    <circle cx="115" cy="125" r="6" fill={isColoured ? '#FFB6C1' : '#F1F5F9'} stroke="#222222" strokeWidth="2" />
    {/* Feet */}
    <rect x="110" y="220" width="30" height="35" rx="8" fill={isColoured ? '#90CAF9' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
    <rect x="160" y="220" width="30" height="35" rx="8" fill={isColoured ? '#90CAF9' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
  </svg>
);

export const LineArtAlphabet: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big Bubble Letter A */}
    <path
      d="M120 40 L60 230 A 15 15 0 0 0 85 240 L105 180 L195 180 L215 240 A 15 15 0 0 0 240 230 L180 40 A 30 30 0 0 0 120 40 Z"
      fill={isColoured ? '#FF8A65' : '#FFFFFF'}
      stroke="#222222"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    {/* Inner triangle with smiling face */}
    <path
      d="M135 130 L165 130 L150 90 Z"
      fill={isColoured ? '#FFE082' : '#FFFFFF'}
      stroke="#222222"
      strokeWidth="4"
    />
    {/* Eyes on the letter A */}
    <circle cx="135" cy="80" r="6" fill="#222222" />
    <circle cx="165" cy="80" r="6" fill="#222222" />
    <circle cx="137" cy="78" r="2" fill="#FFFFFF" />
    <circle cx="167" cy="78" r="2" fill="#FFFFFF" />
    {/* Rosy cheeks */}
    <circle cx="125" cy="92" r="5" fill={isColoured ? '#FFB6C1' : '#F1F5F9'} stroke="#222222" strokeWidth="1.5" />
    <circle cx="175" cy="92" r="5" fill={isColoured ? '#FFB6C1' : '#F1F5F9'} stroke="#222222" strokeWidth="1.5" />
    {/* Cute Apple next to A */}
    <g transform="translate(195, 170)">
      <circle cx="35" cy="40" r="28" fill={isColoured ? '#EF5350' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
      <path d="M35 12 Q 38 2 48 5" stroke="#222222" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="48" cy="12" rx="9" ry="5" fill={isColoured ? '#66BB6A' : '#FFFFFF'} stroke="#222222" strokeWidth="2" transform="rotate(-25 48 12)" />
      {/* Apple eyes */}
      <circle cx="27" cy="38" r="3" fill="#222222" />
      <circle cx="43" cy="38" r="3" fill="#222222" />
      <path d="M31 46 Q 35 50 39 46" stroke="#222222" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
    {/* Trace Guideline Dots */}
    <text x="150" y="278" textAnchor="middle" fill="#555555" fontSize="22" fontWeight="700" fontFamily="sans-serif">
      A is for Apple
    </text>
  </svg>
);

export const LineArtNumbers: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bubble Number 1 */}
    <g transform="translate(40, 20)">
      <path
        d="M60 70 L90 50 L90 200 L50 200 L130 200 L130 200"
        stroke="#222222"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    {/* Cute Teddy Bear holding balloon */}
    <g transform="translate(140, 60)">
      {/* Balloon */}
      <circle cx="85" cy="35" r="28" fill={isColoured ? '#FFD93D' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      <line x1="85" y1="63" x2="60" y2="120" stroke="#222222" strokeWidth="2" strokeDasharray="3 3" />
      {/* Bear body & head */}
      <circle cx="50" cy="150" r="35" fill={isColoured ? '#D7CCC8' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
      <circle cx="50" cy="100" r="28" fill={isColoured ? '#BCAAA4' : '#FFFFFF'} stroke="#222222" strokeWidth="4" />
      {/* Bear ears */}
      <circle cx="30" cy="78" r="10" fill={isColoured ? '#8D6E63' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      <circle cx="70" cy="78" r="10" fill={isColoured ? '#8D6E63' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      {/* Bear face */}
      <circle cx="42" cy="98" r="3" fill="#222222" />
      <circle cx="58" cy="98" r="3" fill="#222222" />
      <ellipse cx="50" cy="108" rx="8" ry="6" fill={isColoured ? '#D7CCC8' : '#FFFFFF'} stroke="#222222" strokeWidth="2" />
      <circle cx="50" cy="105" r="3" fill="#222222" />
    </g>
    <text x="150" y="275" textAnchor="middle" fill="#555555" fontSize="22" fontWeight="700" fontFamily="sans-serif">
      1 Little Bear
    </text>
  </svg>
);

export const LineArtFruits: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sweet Strawberry */}
    <g transform="translate(60, 40)">
      <path
        d="M90 30 C 130 30 150 90 90 160 C 30 90 50 30 90 30 Z"
        fill={isColoured ? '#FF5252' : '#FFFFFF'}
        stroke="#222222"
        strokeWidth="5"
      />
      {/* Crown Leaves */}
      <path d="M70 30 Q 90 10 110 30 Q 90 20 70 30" fill={isColoured ? '#4CAF50' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      <circle cx="75" cy="80" r="4" fill="#222222" />
      <circle cx="105" cy="80" r="4" fill="#222222" />
      <path d="M85 95 Q 90 102 95 95" stroke="#222222" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Seeds */}
      {[
        [65, 60], [115, 60], [70, 110], [110, 110], [90, 130], [80, 70], [100, 70]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={isColoured ? '#FFD93D' : '#333333'} />
      ))}
    </g>
    <text x="150" y="260" textAnchor="middle" fill="#555555" fontSize="20" fontWeight="700" fontFamily="sans-serif">
      Yummy Strawberry
    </text>
  </svg>
);

export const LineArtVehicle: React.FC<{ className?: string; isColoured?: boolean }> = ({ className = '', isColoured = false }) => (
  <svg viewBox="0 0 300 300" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cute smiling car */}
    <g transform="translate(30, 70)">
      {/* Car top */}
      <path
        d="M50 80 C 70 30 170 30 190 80 Z"
        fill={isColoured ? '#6BCBFF' : '#FFFFFF'}
        stroke="#222222"
        strokeWidth="5"
      />
      {/* Window */}
      <path
        d="M65 75 C 80 45 160 45 175 75 Z"
        fill={isColoured ? '#E1F5FE' : '#FFFFFF'}
        stroke="#222222"
        strokeWidth="3.5"
      />
      {/* Car body */}
      <rect x="20" y="80" width="200" height="50" rx="15" fill={isColoured ? '#FF8A65' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
      {/* Headlights as eyes */}
      <circle cx="210" cy="95" r="9" fill={isColoured ? '#FFD93D' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      <circle cx="212" cy="95" r="3" fill="#222222" />
      {/* Smile grille */}
      <path d="M195 112 Q 205 120 215 112" stroke="#222222" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Wheels */}
      <circle cx="65" cy="130" r="22" fill={isColoured ? '#37474F' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
      <circle cx="65" cy="130" r="10" fill={isColoured ? '#B0BEC5' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
      <circle cx="175" cy="130" r="22" fill={isColoured ? '#37474F' : '#FFFFFF'} stroke="#222222" strokeWidth="5" />
      <circle cx="175" cy="130" r="10" fill={isColoured ? '#B0BEC5' : '#FFFFFF'} stroke="#222222" strokeWidth="3" />
    </g>
    <text x="150" y="260" textAnchor="middle" fill="#555555" fontSize="20" fontWeight="700" fontFamily="sans-serif">
      Beep Beep! Little Car
    </text>
  </svg>
);

export const PreviewArtworkPicker: React.FC<{ type: string; isColoured?: boolean; className?: string }> = ({
  type,
  isColoured = false,
  className = '',
}) => {
  switch (type) {
    case 'lion':
      return <LineArtLion className={className} isColoured={isColoured} />;
    case 'elephant':
      return <LineArtElephant className={className} isColoured={isColoured} />;
    case 'alphabet':
      return <LineArtAlphabet className={className} isColoured={isColoured} />;
    case 'numbers':
      return <LineArtNumbers className={className} isColoured={isColoured} />;
    case 'fruits':
      return <LineArtFruits className={className} isColoured={isColoured} />;
    case 'vehicle':
      return <LineArtVehicle className={className} isColoured={isColoured} />;
    default:
      return <LineArtLion className={className} isColoured={isColoured} />;
  }
};

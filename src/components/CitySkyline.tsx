import React from 'react';

interface CitySkylineProps {
  city: 'New York' | 'Los Angeles' | 'Miami' | 'London' | 'Paris' | 'Denver' | 'San Francisco' | 'San Diego' | 'Dallas' | 'Chicago' | 'Philadelphia' | 'Las Vegas' | 'Seattle' | 'Portland' | 'Washington DC' | 'Puerto Rico' | 'Boston' | 'Austin' | 'Phoenix' | 'Atlanta' | 'Nashville' | 'Detroit' | 'Barcelona' | 'Pittsburgh' | 'Cincinnati';
  color?: string;
}

export const CitySkyline: React.FC<CitySkylineProps> = ({ 
  city, 
  color = 'stroke-primary/10' 
}) => {
  // Map cities to gorgeous luxurious, thematic color palettes for the background textures
  const theme = (() => {
    const nyGroup = ['New York', 'Dallas', 'Chicago', 'Philadelphia', 'Boston', 'Phoenix', 'Atlanta', 'Detroit', 'Pittsburgh', 'Cincinnati', 'Washington DC'];
    const laGroup = ['Los Angeles', 'Denver', 'San Francisco', 'San Diego', 'Las Vegas', 'Seattle', 'Portland', 'Austin', 'Nashville'];
    const miamiGroup = ['Miami', 'Puerto Rico'];
    const parisGroup = ['Paris', 'Barcelona'];
    
    if (city === 'London') {
      return {
        accentGlow: 'rgba(197, 160, 89, 0.08)', // sophisticated silver-champagne
        secondaryGlow: 'rgba(120, 110, 90, 0.05)',
        gridOpacity: 'opacity-20',
        waveRotation: 'rotate-3',
        description: 'Obsidian & Platinum Dust Threading'
      };
    }
    if (nyGroup.includes(city)) {
      return {
        accentGlow: 'rgba(217, 119, 6, 0.09)', // classic rich amber
        secondaryGlow: 'rgba(146, 64, 14, 0.04)',
        gridOpacity: 'opacity-30',
        waveRotation: 'rotate-0',
        description: 'Amber Core Architectural Mesh'
      };
    }
    if (laGroup.includes(city)) {
      return {
        accentGlow: 'rgba(245, 158, 11, 0.08)', // warm golden sunset
        secondaryGlow: 'rgba(220, 38, 38, 0.03)',
        gridOpacity: 'opacity-25',
        waveRotation: '-rotate-1',
        description: 'Sunset Copper Contour Wave'
      };
    }
    if (miamiGroup.includes(city)) {
      return {
        accentGlow: 'rgba(251, 146, 60, 0.1)', // coral golden warmth
        secondaryGlow: 'rgba(219, 112, 147, 0.04)',
        gridOpacity: 'opacity-35',
        waveRotation: 'rotate-6',
        description: 'Exotic Coral Velvet Topography'
      };
    }
    if (parisGroup.includes(city)) {
      return {
        accentGlow: 'rgba(251, 191, 36, 0.08)', // royal champagne
        secondaryGlow: 'rgba(236, 72, 153, 0.02)',
        gridOpacity: 'opacity-15',
        waveRotation: 'rotate-12',
        description: 'Romantique Champagne Silk grid'
      };
    }
    return {
      accentGlow: 'rgba(217, 119, 6, 0.08)',
      secondaryGlow: 'rgba(146, 64, 14, 0.03)',
      gridOpacity: 'opacity-25',
      waveRotation: 'rotate-0',
      description: 'Amber Core Architectural Mesh'
    };
  })();

  return (
    <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden select-none transition-all duration-1000 ease-in-out">
      
      {/* 1. Deep Radial Ambient Glows */}
      <div 
        id="bg-ambient-glow-primary"
        className="absolute top-1/4 left-1/3 w-[80vw] h-[80vw] rounded-full blur-[160px] opacity-70 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${theme.accentGlow} 0%, rgba(10,9,8,0) 70%)`,
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div 
        id="bg-ambient-glow-secondary"
        className="absolute bottom-10 right-1/4 w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-60 transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${theme.secondaryGlow} 0%, rgba(10,9,8,0) 70%)`,
          transform: 'translate(20%, 20%)',
        }}
      />

      {/* 2. Full-Screen SVGs for Technical & Organic Textures */}
      <svg
        id="bg-texture-canvas"
        className={`absolute inset-0 w-full h-full ${color}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle repeating designer grid pattern */}
          <pattern 
            id="designerGridPattern" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            {/* Tiny intersection dots */}
            <circle cx="20" cy="20" r="0.8" fill="rgba(217, 119, 6, 0.15)" />
            {/* Extremely thin structural grid lines */}
            <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(217, 119, 6, 0.02)" strokeWidth="0.5" />
            <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(217, 119, 6, 0.02)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Dynamic Architectural Grid background */}
        <rect 
          id="bg-grid-rect"
          width="100%" 
          height="100%" 
          fill="url(#designerGridPattern)" 
          className={`transition-opacity duration-1000 ${theme.gridOpacity}`}
        />

        {/* Modern Topography/Contour Curves */}
        <g 
          id="bg-contour-curves"
          fill="none" 
          stroke="currentColor" 
          className="text-primary/10 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(1.1) ${theme.waveRotation}` }}
        >
          {/* Elegant spline waves cascading down the screen */}
          <path d="M-100,200 C300,50 600,450 1100,150 C1400,20 1700,280 2000,100" strokeWidth="0.8" strokeDasharray="3,9" />
          <path d="M-100,400 C400,250 500,650 1000,350 C1500,50 1600,480 2000,300" strokeWidth="0.6" opacity="0.8" />
          <path d="M-100,600 C200,450 700,850 1200,500 C1600,150 1800,680 2000,500" strokeWidth="0.5" strokeDasharray="4,12" opacity="0.6" />
          <path d="M-100,800 C500,650 800,950 1300,700 C1700,450 1900,880 2000,700" strokeWidth="0.7" opacity="0.4" />
        </g>

        {/* Interactive Constellation Node Array inside the grid */}
        <g id="bg-vector-nodes" fill="none" className="text-secondary/20">
          {/* Subtle connecting mesh joints */}
          <path d="M120,150 L280,110 L450,220 M750,380 L920,290 L1150,420 M300,750 L520,680 L680,810" stroke="rgba(217,119,6,0.06)" strokeWidth="0.5" strokeDasharray="2,4" />
          
          {/* Decorative luxury coordinates indicator */}
          <text x="50" y="80" className="fill-amber-500/20 text-[9px] font-mono tracking-widest">{`LOC: ${city.toUpperCase()}`}</text>
          <text x="50" y="95" className="fill-neutral-500/15 text-[8px] font-mono tracking-widest">{theme.description}</text>

          {/* Core constellation vectors */}
          <circle cx="120" cy="150" r="1.5" className="fill-amber-500/40 animate-pulse" />
          <circle cx="280" cy="110" r="2" className="fill-amber-500/25" />
          <circle cx="450" cy="220" r="1.2" className="fill-neutral-500/40" />

          <circle cx="750" cy="380" r="1.5" className="fill-amber-500/35" />
          <circle cx="920" cy="290" r="2.5" className="fill-amber-500/50 animate-pulse" />
          <circle cx="1150" cy="420" r="1" className="fill-neutral-500/40" />

          <circle cx="300" cy="750" r="2" className="fill-amber-500/30" />
          <circle cx="520" cy="680" r="1.5" className="fill-amber-500/45 animate-pulse" />
          <circle cx="680" cy="810" r="1.2" className="fill-neutral-500/40" />
        </g>
      </svg>
      
      {/* 3. Subtle micro-grain noise overlay for realistic texture depth */}
      <div 
        id="bg-grain-texture"
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default CitySkyline;

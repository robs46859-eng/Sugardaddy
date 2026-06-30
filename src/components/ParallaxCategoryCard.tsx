import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Category } from '../types';
import { useParallax } from '../hooks/useParallax';

interface ParallaxCategoryCardProps {
  cat: Category;
  isSelected: boolean;
  onClick: () => void;
}

export const ParallaxCategoryCard: React.FC<ParallaxCategoryCardProps> = ({ cat, isSelected, onClick }) => {
  const offset = useParallax();

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden select-none flex flex-col justify-between h-[120px] ${
        isSelected 
          ? 'border-primary bg-primary/5 text-white shadow-[0_0_15px_rgba(253,186,116,0.12)]' 
          : 'border-outline-variant bg-surface hover:border-[#9e8e80] text-neutral-300'
      }`}
      style={{ 
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        boxShadow: isSelected 
          ? `0px 0px 15px rgba(253,186,116,0.12), ${-offset.x * 0.5}px ${-offset.y * 0.5}px 10px rgba(0,0,0,0.2)` 
          : `${-offset.x * 0.5}px ${-offset.y * 0.5}px 10px rgba(0,0,0,0.2)`
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono font-bold uppercase text-[#9e7e60]">
          {cat.isCustom ? 'Custom Sector' : 'Verified Career'}
        </span>
        {isSelected && (
          <span className="w-2 h-2 rounded bg-primary animate-pulse" />
        )}
      </div>

      <div className="my-1.5 min-h-[44px]">
        <h4 className="text-xs font-bold text-white uppercase tracking-wide font-mono line-clamp-1">
          {cat.name}
        </h4>
        <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2 mt-0.5">
          {cat.description}
        </p>
      </div>

      <div className="pt-1.5 border-t border-outline-variant/60 flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-primary font-semibold">
        <span>{isSelected ? 'Active Filter' : 'Filter Providers'}</span>
        <ChevronRight className="w-3 h-3 text-neutral-500" />
      </div>
    </div>
  );
};

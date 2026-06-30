import { useState, useEffect } from 'react';
import { parallaxManager, ParallaxOffset } from '../lib/parallaxManager';

export function useParallax() {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const unsubscribe = parallaxManager.subscribe((newOffset) => {
      setOffset(newOffset);
    });
    return unsubscribe;
  }, []);

  return offset;
}

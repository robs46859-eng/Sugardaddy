export type ParallaxOffset = { x: number; y: number };
type Subscriber = (offset: ParallaxOffset) => void;

class ParallaxManager {
  private subscribers: Set<Subscriber> = new Set();
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private isListening = false;
  private animationFrameId: number | null = null;

  // Configuration for parallax sensitivity
  private maxOffset = 15; // Maximum pixel offset in any direction
  private easing = 0.08; // Spring easing factor for fluid motion

  public subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    if (this.subscribers.size === 1) {
      this.start();
    }
    callback({ x: this.currentX, y: this.currentY });
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  private start() {
    if (this.isListening) return;
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.handleOrientation);
      this.isListening = true;
      this.tick();
    }
  }

  private stop() {
    if (!this.isListening) return;
    window.removeEventListener('deviceorientation', this.handleOrientation);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.isListening = false;
  }

  private handleOrientation = (event: DeviceOrientationEvent) => {
    // beta: front-to-back tilt [-180, 180]
    // gamma: left-to-right tilt [-90, 90]
    let beta = event.beta || 0;
    let gamma = event.gamma || 0;

    // Base device holding angle assumed around 45 degrees pitch.
    const normalizedBeta = Math.max(-45, Math.min(45, beta - 45)); 
    const normalizedGamma = Math.max(-45, Math.min(45, gamma));

    // Map to [-maxOffset, maxOffset]
    this.targetY = (normalizedBeta / 45) * this.maxOffset;
    this.targetX = (normalizedGamma / 45) * this.maxOffset;
  };

  private tick = () => {
    // 60hz spring interpolation
    this.currentX += (this.targetX - this.currentX) * this.easing;
    this.currentY += (this.targetY - this.currentY) * this.easing;

    // Only notify if changes are somewhat noticeable to avoid extreme micro-renders
    const offset = { 
      x: Number(this.currentX.toFixed(2)), 
      y: Number(this.currentY.toFixed(2)) 
    };
    
    this.subscribers.forEach(sub => sub(offset));

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        return permissionState === 'granted';
      } catch (err) {
        console.warn('Device orientation permission rejected', err);
        return false;
      }
    }
    return true;
  }
}

export const parallaxManager = new ParallaxManager();

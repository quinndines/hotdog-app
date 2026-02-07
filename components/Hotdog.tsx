import React, { useRef, useState, useEffect } from 'react';
import { Bite } from '../types';

interface HotdogProps {
  bites: Bite[];
  onBite: (x: number, y: number) => void;
  isFinished: boolean;
}

export const Hotdog: React.FC<HotdogProps> = ({ bites, onBite, isFinished }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isFinished || !svgRef.current) return;

    // Trigger wiggle animation
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 200);

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert screen coordinates to SVG viewBox coordinates (0 0 600 300)
    // The viewBox is 600x300.
    const viewBoxWidth = 600;
    const viewBoxHeight = 300;
    
    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;

    onBite(x * scaleX, y * scaleY);
  };

  // Sound effect for biting
  useEffect(() => {
    if (bites.length > 0) {
      // Very simple synthesized crunch sound
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    }
  }, [bites]);

  return (
    <div className={`relative select-none cursor-pointer transition-transform ${isWiggling ? 'wiggle' : ''} hover:scale-105 duration-200`}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 300"
        className="w-full h-auto max-w-2xl drop-shadow-2xl"
        onClick={handleClick}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="biteMask">
            {/* The white rectangle reveals everything initially */}
            <rect x="0" y="0" width="600" height="300" fill="white" />
            {/* Black circles hide parts (create bites) */}
            {bites.map((bite) => (
              <circle
                key={bite.id}
                cx={bite.x}
                cy={bite.y}
                r={bite.r}
                fill="black"
              />
            ))}
          </mask>

          {/* Gradients for juicy look */}
          <linearGradient id="bunGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <linearGradient id="sausageGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          
          <filter id="shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Shadow group (bottom bun shadow) */}
        <ellipse cx="300" cy="220" rx="260" ry="40" fill="rgba(0,0,0,0.2)" />

        {/* The Hotdog Group with Mask Applied */}
        <g mask="url(#biteMask)">
          {/* Bottom Bun */}
          <path
            d="M 50,150 Q 50,250 300,250 T 550,150 L 550,130 L 50,130 Z"
            fill="url(#bunGradient)"
            stroke="#d97706"
            strokeWidth="3"
          />

          {/* Sausage */}
          <rect
            x="40"
            y="110"
            width="520"
            height="80"
            rx="40"
            fill="url(#sausageGradient)"
            stroke="#991b1b"
            strokeWidth="2"
          />
          
          {/* Sausage Shine */}
          <path 
            d="M 80,125 L 520,125" 
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="10" 
            strokeLinecap="round"
          />

          {/* Mustard Wave */}
          <path
            d="M 60,150 Q 90,120 120,150 T 180,150 T 240,150 T 300,150 T 360,150 T 420,150 T 480,150 T 540,150"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="12"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {/* Top Bun (Back half visual trickery to give depth) */}
           {/* Not actually separate top bun for classic hotdog look, but let's add bun sides */}
           <path
            d="M 40,140 Q 30,140 30,160 Q 30,220 60,230"
            fill="url(#bunGradient)"
            opacity="0.8"
           />
           <path
            d="M 560,140 Q 570,140 570,160 Q 570,220 540,230"
            fill="url(#bunGradient)"
            opacity="0.8"
           />
        </g>
        
        {/* Helper text if empty */}
        {isFinished && (
           <text x="300" y="150" textAnchor="middle" fontSize="40" fill="#b45309" fontWeight="bold" opacity="0.5">
             GONE!
           </text>
        )}
      </svg>
    </div>
  );
};

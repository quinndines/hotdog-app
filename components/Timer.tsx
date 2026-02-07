import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  isRunning: boolean;
  startTime: number | null;
  finalTime?: number | null;
}

export const Timer: React.FC<TimerProps> = ({ isRunning, startTime, finalTime }) => {
  const [displayTime, setDisplayTime] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning && startTime) {
      const update = () => {
        setDisplayTime(Date.now() - startTime);
        frameRef.current = requestAnimationFrame(update);
      };
      frameRef.current = requestAnimationFrame(update);
    } else if (finalTime !== undefined && finalTime !== null) {
      setDisplayTime(finalTime);
    } else if (!startTime) {
      setDisplayTime(0);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isRunning, startTime, finalTime]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`
      font-mono text-3xl font-black tracking-widest
      ${isRunning ? 'text-red-600' : 'text-gray-400'}
      bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm border-2 border-amber-200
    `}>
      {formatTime(displayTime)}
    </div>
  );
};

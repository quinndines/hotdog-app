import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hotdog } from './components/Hotdog';
import { Commentary } from './components/Commentary';
import { Timer } from './components/Timer';
import { Leaderboard } from './components/Leaderboard';
import { getHotdogCommentary } from './services/geminiService';
import { getLeaderboard, saveScore } from './utils/storage';
import { Bite, LeaderboardEntry } from './types';

// Constants
const MAX_BITES_ESTIMATE = 25; // Approximate bites to finish

const App: React.FC = () => {
  // Game State
  const [bites, setBites] = useState<Bite[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // Timer State
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number | null>(null);

  // Leaderboard State
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Commentary state
  const [commentary, setCommentary] = useState<string>("Ready to eat? Click the hotdog!");
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);
  const [lastCommentaryPercentage, setLastCommentaryPercentage] = useState(0);

  // Load leaderboard on mount
  useEffect(() => {
    setLeaderboardEntries(getLeaderboard());
  }, []);

  // Handle a new bite
  const handleBite = useCallback((x: number, y: number) => {
    if (isFinished) return;

    // Start timer on first bite
    if (bites.length === 0) {
      setStartTime(Date.now());
    }

    const newBite: Bite = {
      id: Date.now(),
      x,
      y,
      r: 40 + Math.random() * 20, // Random bite size between 40 and 60
    };

    setBites((prev) => {
      const updated = [...prev, newBite];
      const newPercentage = Math.min(100, (updated.length / MAX_BITES_ESTIMATE) * 100);
      
      if (newPercentage >= 100 && !isFinished) {
        // FINISHED!
        const end = Date.now();
        const start = startTime || end; // Fallback if start wasn't set (shouldn't happen)
        const duration = end - start;
        
        setIsFinished(true);
        setPercentage(100);
        setFinalTime(duration);
        
        // Delay showing the leaderboard input slightly for effect
        setTimeout(() => {
          setShowLeaderboard(true);
          setShowNameInput(true);
        }, 1000);
      } else {
        setPercentage(newPercentage);
      }
      
      return updated;
    });
  }, [isFinished, startTime, bites.length]);

  // Effect to trigger commentary
  useEffect(() => {
    const triggerCommentary = async () => {
      // Trigger conditions: 
      // 1. First bite
      // 2. Finished
      // 3. Every ~20% change
      const shouldTrigger = 
        (bites.length === 1 && lastCommentaryPercentage === 0) || 
        isFinished ||
        (percentage > 0 && Math.abs(percentage - lastCommentaryPercentage) >= 20);

      // Avoid double triggering finish if state updates rapidly
      if (shouldTrigger) {
        setLastCommentaryPercentage(percentage);
        setIsLoadingCommentary(true);
        
        // If finished, pass the final time (or calculate it if not set yet in state loop)
        const timeToPass = isFinished && startTime ? (Date.now() - startTime) : undefined;
        
        const text = await getHotdogCommentary(percentage, isFinished, timeToPass);
        setCommentary(text);
        setIsLoadingCommentary(false);
      }
    };

    triggerCommentary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, isFinished, bites.length]);

  const resetGame = () => {
    setBites([]);
    setPercentage(0);
    setIsFinished(false);
    setStartTime(null);
    setFinalTime(null);
    setLastCommentaryPercentage(0);
    setShowLeaderboard(false);
    setShowNameInput(false);
    setCommentary("Another one? You have a bottomless stomach!");
  };

  const handleSaveScore = (name: string) => {
    if (finalTime) {
      const updated = saveScore(name, finalTime);
      setLeaderboardEntries(updated);
      setShowNameInput(false); // Hide input, show list
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-50 via-amber-100 to-amber-200">
      
      {/* Header */}
      <div className="absolute top-8 text-center z-10 w-full flex flex-col items-center">
        <h1 className="text-5xl font-black text-red-600 drop-shadow-md mb-2 tracking-tight">
          HOTDOG <span className="text-yellow-500">EATER</span>
        </h1>
        
        {/* Timer Display */}
        <div className="mt-2 mb-4">
           <Timer 
             isRunning={!!startTime && !isFinished} 
             startTime={startTime} 
             finalTime={finalTime} 
           />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mt-16">
        <Hotdog 
          bites={bites} 
          onBite={handleBite} 
          isFinished={isFinished} 
        />

        {/* Progress Bar */}
        <div className="w-full max-w-md mt-12 bg-white rounded-full h-4 shadow-inner overflow-hidden border border-amber-200">
          <div 
            className="h-full bg-red-500 transition-all duration-300 ease-out flex items-center justify-center"
            style={{ width: `${percentage}%` }}
          >
          </div>
        </div>
        <p className="mt-2 text-sm font-bold text-red-400">{Math.round(percentage)}% EATEN</p>

        {/* Commentary Box */}
        <Commentary text={commentary} loading={isLoadingCommentary} />
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-8 flex gap-4">
        {/* Reset Button (only visible when active but not showing modal) */}
        {(percentage > 0 && !showLeaderboard) && (
          <button
            onClick={resetGame}
            className="px-8 py-3 rounded-full font-bold text-white shadow-lg bg-amber-500 hover:bg-amber-600 opacity-80 hover:opacity-100 transform transition-all duration-300"
          >
            Reset
          </button>
        )}

        {/* Manual Leaderboard Toggle */}
        <button
          onClick={() => {
            setShowLeaderboard(true);
            setShowNameInput(false);
          }}
          className="px-6 py-3 rounded-full font-bold text-amber-900 bg-white border-2 border-amber-200 shadow-md hover:bg-amber-50 transition-colors"
        >
          🏆 Leaderboard
        </button>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard 
          entries={leaderboardEntries}
          currentScore={finalTime}
          showInput={showNameInput && isFinished}
          onSave={handleSaveScore}
          onClose={() => {
             setShowLeaderboard(false);
             if (isFinished) resetGame(); // If they close the finish modal, just reset
          }}
        />
      )}

      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 text-9xl opacity-5 select-none pointer-events-none rotate-12">🌭</div>
      <div className="fixed bottom-20 right-10 text-9xl opacity-5 select-none pointer-events-none -rotate-12">🌭</div>
    </div>
  );
};

export default App;

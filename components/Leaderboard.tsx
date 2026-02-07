import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentScore?: number | null;
  onSave?: (name: string) => void;
  onClose: () => void;
  showInput: boolean; // Whether to show the input form or just the list
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentScore, onSave, onClose, showInput }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(name);
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + 's';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-400 transform transition-all scale-100 animate-[wiggle_0.3s_ease-out]">
        
        {/* Header */}
        <div className="bg-red-500 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,_#fff_10%,_transparent_10%)] bg-[length:10px_10px]"></div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-md relative z-10">
            {showInput ? "Speed Eater!" : "Hall of Fame"}
          </h2>
          {showInput && currentScore && (
            <div className="mt-2 text-yellow-300 font-mono text-4xl font-bold drop-shadow-sm relative z-10">
              {formatTime(currentScore)}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Input Form */}
          {showInput && onSave ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Enter Your Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={15}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hotdog King"
                  className="flex-1 bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                  autoFocus
                />
                <button 
                  type="submit"
                  disabled={!name.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-transform active:scale-95 shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
                >
                  SAVE
                </button>
              </div>
            </form>
          ) : null}

          {/* List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">Top Glizzies</h3>
            {entries.length === 0 ? (
              <p className="text-center text-gray-400 italic py-4">No records yet. Be the first!</p>
            ) : (
              <ul className="space-y-2">
                {entries.map((entry, index) => (
                  <li 
                    key={entry.id} 
                    className={`flex justify-between items-center p-3 rounded-lg ${index < 3 ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`
                        w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                          index === 1 ? 'bg-gray-300 text-gray-800' : 
                          index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-200 text-gray-500'}
                      `}>
                        {index + 1}
                      </span>
                      <span className="font-bold text-gray-700">{entry.name}</span>
                    </div>
                    <span className="font-mono font-bold text-red-500">{formatTime(entry.time)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Close / Play Again */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
             <button onClick={onClose} className="text-gray-500 font-bold hover:text-red-500 transition-colors text-sm uppercase tracking-wider">
               {showInput ? "Skip & Play Again" : "Close"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

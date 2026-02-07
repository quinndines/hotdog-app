import React from 'react';

interface CommentaryProps {
  text: string;
  loading: boolean;
}

export const Commentary: React.FC<CommentaryProps> = ({ text, loading }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-xl max-w-lg w-full text-center border-2 border-red-100 min-h-[120px] flex flex-col justify-center items-center transition-all duration-300">
      <h3 className="text-sm font-bold text-red-400 tracking-widest uppercase mb-2">
        Chef's Analysis
      </h3>
      {loading ? (
        <div className="flex space-x-2 animate-pulse">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      ) : (
        <p className="text-xl text-gray-700 font-medium italic">
          "{text}"
        </p>
      )}
    </div>
  );
};

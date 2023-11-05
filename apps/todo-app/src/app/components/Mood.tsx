import React from 'react';

export const moodEmojis = ['😩', '😔', '😐', '🙂', '😄'];

function Mood({ mood, setMood }: { mood: number; setMood: any }) {
  console.log(mood);
  return (
    <div className="flex items-center space-x-3">
      {moodEmojis.map((emoji, index) => {
        return (
          <button
            className={` text-4xl w-[50px] ${
              index !== mood - 1 ? 'opacity-30' : ''
            }`}
            key={index}
            onClick={() => setMood(index + 1)}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

export default Mood;

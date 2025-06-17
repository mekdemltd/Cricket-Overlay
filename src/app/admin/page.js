'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [playerShow, setPlayerShow] = useState(false);
  const [matchTotal, setMatchTotal] = useState(false);

  // Fetch initial overlay state
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/overlay');
        const data = await res.json();
        setPlayerShow(data.showOverlay);
        setMatchTotal(data.matchTotalOverlay);
      } catch (err) {
        console.error('Failed to fetch overlay state', err);
      }
    };
    fetchState();
  }, []);

  const updateOverlay = async (type) => {
    let newPlayerShow = playerShow;
    let newMatchTotal = matchTotal;

    // Toggle logic
    if (type === 'players') {
      if (newPlayerShow) {
        newPlayerShow = false;
      } else {
        newPlayerShow = true;
      }
      newMatchTotal = false; // Ensure Match Total is hidden when Players Overlay is shown
    } else if (type === 'matchTotal') {
      if (newMatchTotal) {
        newMatchTotal = false;
      } else {
        newMatchTotal = true;
      }
      newPlayerShow = false; // Ensure Players Overlay is hidden when Match Total Overlay is shown
    }

    // Update local state
    setPlayerShow(newPlayerShow);
    setMatchTotal(newMatchTotal);

    // Send updated state to the backend
    try {
      await fetch('/api/overlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showOverlay: newPlayerShow,  // Send the updated state
          matchTotalOverlay: newMatchTotal  // Send the updated state
        }),
      });
    } catch (err) {
      console.error('Failed to update overlay state', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Overlay Admin Panel</h1>

        <button
          onClick={() => updateOverlay('players')}
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-colors duration-300
            ${playerShow ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {playerShow ? 'Hide' : 'Show'} Players Overlay
        </button>

        <button
          onClick={() => updateOverlay('matchTotal')}
          className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-colors duration-300 mt-4
            ${matchTotal ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {matchTotal ? 'Hide' : 'Show'} Match Detail Overlay
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export default function FinalMatchDetailsOverlay({ finalMatchData }) {
  const innings = finalMatchData.innings || [];

  const getDismissalDescription = (batsman) => {
    const { how_out, fielder_name, bowler_name } = batsman;

    if (!how_out) return 'Not Out';
    if(how_out.includes('did not bat')) return 'Did Not Bat';    

    const dismissalMap = {
      ct: 'Caught',
      b: 'Bowled',
      st: 'Stumped',
      lbw: 'LBW',
      'run out': 'Run Out',      
    };

    const match = Object.entries(dismissalMap).find(([key]) =>
      how_out.includes(key)
    );    

    if (!match) return 'Not Out';

    const [key, description] = match;
    let detail = description;

    if (key === 'ct' && fielder_name) {
      detail += ` by ${fielder_name}`;
      if (bowler_name) {
        detail += ` (bowled by ${bowler_name})`;
      }
    } else if (['b', 'st', 'lbw'].includes(key) && bowler_name) {
      detail += ` by ${bowler_name}`;
    }

    return detail;
  };

  const renderBattingDetails = (batsman) => (
    <div
      key={batsman.batsman_id}
      className="flex justify-between items-center py-2 px-3 border-b border-gray-300 text-xs sm:text-sm"
    >
      <div className="flex flex-col">
        <span className="text-black font-medium">
          {batsman.position}. {batsman.batsman_name}
        </span>
        <span className="text-red-800 italic text-xs">
          {getDismissalDescription(batsman)}
        </span>
      </div>
      <div className="text-right text-gray-900">
        <div className="grid grid-cols-4 font-bold gap-2 w-24 sm:w-28">
          <div>{batsman.runs}</div>
          <div>{batsman.balls}</div>
          <div>{batsman.fours}</div>
          <div>{batsman.sixes}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-blue-300 w-full max-w-6xl max-h-screen overflow-y-auto text-black p-3 sm:p-4 text-xs sm:text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {innings.map((inning, index) => (
            <div key={index}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 border-b border-gray-300 pb-2">
                {inning.team_batting_name}
              </h2>

              <div className="space-y-1.5">                
                {/* Header Row */}
                <div className="flex justify-between items-center px-3 pb-1 font-semibold text-gray-800 border-b border-gray-300">
                  <div className="text-left">Batsman</div>
                  <div className="grid grid-cols-4 gap-2 text-right w-24 sm:w-28">
                    <div>R</div>
                    <div>B</div>
                    <div>4s</div>
                    <div>6s</div>
                  </div>
                </div>

                {/* Batsman Rows */}
                {inning.bat.map(renderBattingDetails)}
              </div>

              <div className="space-y-1 mt-4">
                <div className="font-semibold">Total Runs & Wickets:</div>
                <div>Runs: {inning.runs}</div>
                <div>Wickets: {inning.wickets}</div>
                <div>Overs: {inning.overs}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

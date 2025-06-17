'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function MatchPlayersOverlay({ actualMatchData }) {
  const homePlayers = actualMatchData.players?.[0]?.home_team || [];
  const awayPlayers = actualMatchData.players?.[1]?.away_team || [];

  const renderRole = (player) => (
    <div className="flex items-center gap-2 ml-3">
      {player.captain && (
        <span
          className="text-sm text-red-800 bg-red-100 rounded-full px-2 py-0.5 font-bold border border-red-300"
          title="Captain"
        >
          C
        </span>
      )}
      {player.wicket_keeper && (
        <span
          className="text-sm text-blue-800 bg-blue-100 rounded-full px-2 py-0.5 font-bold border border-blue-300"
          title="Wicket Keeper"
        >
          W
        </span>
      )}
    </div>
  );

  const renderPlayer = (player) => (
    <div
      key={player.player_id}
      className="flex justify-between items-center py-3 px-4 border-b border-white/20"
    >
      <span className="text-black text-lg">
        {player.position}. {player.player_name}
      </span>
      {renderRole(player)}
    </div>
  );

  return (
    <motion.div
      initial={{ x: '-100vw', opacity: 0 }}
      animate={{ x: '-50%', opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      className="fixed top-1/2 left-1/2 transform -translate-y-1/2 bg-red-500/40 p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-red-300 w-[95vw] max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b border-white/30 pb-2 text-black/90">
            {actualMatchData.home_club_name}
          </h2>
          <div className="space-y-2">{homePlayers.map(renderPlayer)}</div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 border-b border-white/30 pb-2 text-black/90">
            {actualMatchData.away_club_name}
          </h2>
          <div className="space-y-2">{awayPlayers.map(renderPlayer)}</div>
        </div>
      </div>
    </motion.div>
  );
}

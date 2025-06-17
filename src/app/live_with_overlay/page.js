'use client';

import { useState, useEffect } from 'react';
import MatchOverlayDetails from '../components/Overlay';
import MatchPlayersOverlay from '../components/MatchPlayersOverlay';
import FinalMatchDetailsOverlay from '../components/MatchTotalOverlay';
import { motion, AnimatePresence } from 'framer-motion';

export default function CricketBroadcastOverlay() {
  const [videoUrl, setVideoUrl] = useState('');
  const [matchData, setMatchData] = useState(null);
  const [actualMatchData, setActualMatchData] = useState(null);
  const [playersOverlay, setPlayersOverlay] = useState(false);
  const [matchTotalOverlay, setMatchTotalOverlay] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const videoUrlParam = params.get('videoUrl');
    const matchId = params.get('matchId');

    if (videoUrlParam) setVideoUrl(videoUrlParam);

    async function fetchMatchData() {
      try {
        const response = await fetch(`/api/fetchMatchData?matchId=${matchId}`);
        const data = await response.json();
        const match = data.match_details[0];
        setActualMatchData(match);

        setMatchData({
          ground: match.ground_name || '',
          matchDate: match.match_date || '',
          umpires: [match.umpire_1_name, match.umpire_2_name, match.umpire_3_name].filter(Boolean).join(' & ') || '',
          scorers: [match.scorer_1_name, match.scorer_2_name].filter(Boolean).join(' & ') || '',
          homeSafeName: match.home_club_name?.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '') || '',
          homeTeam: match.home_club_name && match.home_team_name ? `${match.home_club_name} - ${match.home_team_name}` : '',
          awaySafeName: match.away_club_name?.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_]/g, '') || '',
          awayTeam: match.away_club_name && match.away_team_name ? `${match.away_club_name} - ${match.away_team_name}` : '',
          homeScore: match.innings?.[0] ? `${match.innings[0].runs || ''}/${match.innings[0].wickets || ''} (${match.innings[0].overs || ''})` : '',
          awayScore: match.innings?.[1] ? `${match.innings[1].runs || ''}/${match.innings[1].wickets || ''} (${match.innings[1].overs || ''})` : '',
          matchStatus: match.result_description,
          toss: match.toss || ''
        });
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    }

    if (matchId) { 
      fetchMatchData(); // Initial call
      const interval = setInterval(fetchMatchData, 3000); // Poll every 3 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, []);

  // Poll overlay state every 2 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/overlay');
        const data = await res.json();
        setPlayersOverlay(data.showOverlay);
        setMatchTotalOverlay(data.matchTotalOverlay);
      } catch (err) {
        console.error('Failed to fetch overlay state', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderVideo = () => {
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0];
      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`}
          width="100%"
          height="100%"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      );
    } else {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  return (
    <div className="main-container" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {renderVideo()}

      <AnimatePresence>
        {matchData && playersOverlay && actualMatchData?.players && (
          <motion.div
            key="players"
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <MatchPlayersOverlay actualMatchData={actualMatchData} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {matchData && matchTotalOverlay && actualMatchData?.innings && (
          <motion.div
            key="matchTotal"
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <FinalMatchDetailsOverlay finalMatchData={actualMatchData} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {matchData && !playersOverlay && !matchTotalOverlay && (
          <motion.div
            key="basicOverlay"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 right-0 z-10"
          >
            <MatchOverlayDetails matchData={matchData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

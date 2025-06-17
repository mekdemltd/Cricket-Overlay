// src/app/api/fetchMatchData/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const apiToken = process.env.CRICKET_PLAY_API; // API token from .env
  
    if (!matchId || !apiToken) {
      return new Response(
        JSON.stringify({ error: 'Missing matchId or apiToken' }),
        { status: 400 }
      );
    }
  
    const apiUrl = `https://play-cricket.com/api/v2/match_detail.json?match_id=${matchId}&api_token=${apiToken}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch match data');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
  }
  
// /app/api/fetchMatches/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const siteId = searchParams.get('site_id');
  const season = searchParams.get('season');
  const apiToken = process.env.CRICKET_PLAY_API; // Get from environment variable
  
  if (!siteId || !apiToken) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  const url = `https://play-cricket.com/api/v2/matches.json?site_id=${siteId}&api_token=${apiToken}${
    season ? `&season=${season}` : ""
  }`;
  

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

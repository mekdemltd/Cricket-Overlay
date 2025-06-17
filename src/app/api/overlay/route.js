// app/api/overlay/route.ts
import { NextResponse } from 'next/server'

let overlayState = {
  showOverlay: false,
  matchTotalOverlay: false
}

export async function GET() {
  return NextResponse.json(overlayState)
}

export async function POST(request) {
  const body = await request.json()

  if (typeof body.showOverlay === 'boolean') {
    overlayState.showOverlay = body.showOverlay        
  }

  if (typeof body.matchTotalOverlay === 'boolean') {
    overlayState.matchTotalOverlay = body.matchTotalOverlay    
  }

  return NextResponse.json({ status: 'ok', ...overlayState })
}

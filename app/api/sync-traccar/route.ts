// app/api/sync-traccar/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const traccarUrl = process.env.TRACCAR_URL
  const traccarToken = process.env.TRACCAR_TOKEN

  if (!traccarUrl || !traccarToken) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing TRACCAR_URL or TRACCAR_TOKEN',
      },
      { status: 500 }
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing Supabase server configuration',
      },
      { status: 500 }
    )
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const headers = {
    Authorization: `Bearer ${traccarToken}`,
    Accept: 'application/json',
  }

  // -----------------------------------------
  // 1. GET DEVICES FROM TRACCAR
  // -----------------------------------------

  let devicesRes: Response

  try {
    devicesRes = await fetch(
      `${traccarUrl}/api/devices`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Could not connect to Traccar',
        details:
          error instanceof Error
            ? error.message
            : String(error),
        traccarUrl,
      },
      { status: 502 }
    )
  }

  const devicesBody = await devicesRes.text()

  if (!devicesRes.ok) {
    return NextResponse.json(
      {
        success: false,
        error: 'Traccar devices API failed',
        status: devicesRes.status,
        body: devicesBody.slice(0, 1000),
      },
      { status: 502 }
    )
  }

  let devices: any[]

  try {
    devices = JSON.parse(devicesBody)
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Traccar returned invalid JSON for devices',
        body: devicesBody.slice(0, 1000),
      },
      { status: 502 }
    )
  }

  // -----------------------------------------
  // 2. GET POSITIONS FROM TRACCAR
  // -----------------------------------------

  let positionsRes: Response

  try {
    positionsRes = await fetch(
      `${traccarUrl}/api/positions`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Could not connect to Traccar positions API',
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 502 }
    )
  }

  const positionsBody = await positionsRes.text()

  if (!positionsRes.ok) {
    return NextResponse.json(
      {
        success: false,
        error: 'Traccar positions API failed',
        status: positionsRes.status,
        body: positionsBody.slice(0, 1000),
      },
      { status: 502 }
    )
  }

  let positions: any[]

  try {
    positions = JSON.parse(positionsBody)
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Traccar returned invalid JSON for positions',
        body: positionsBody.slice(0, 1000),
      },
      { status: 502 }
    )
  }

  // -----------------------------------------
  // 3. MATCH TRACCAR DEVICES TO IMEI
  // -----------------------------------------

  const deviceMap = new Map<number, string>()

  for (const device of devices) {
    if (device?.id && device?.uniqueId) {
      deviceMap.set(
        Number(device.id),
        String(device.uniqueId)
      )
    }
  }

  // -----------------------------------------
  // 4. UPDATE SUPABASE ANIMALS
  // -----------------------------------------

  const results: any[] = []

  for (const position of positions) {
    const imei = deviceMap.get(
      Number(position.deviceId)
    )

    if (!imei) {
      results.push({
        deviceId: position.deviceId,
        skipped: true,
        reason: 'No matching animal for Traccar device',
      })

      continue
    }

    const timestamp =
      position.deviceTime ||
      position.fixTime ||
      position.serverTime

    const { error } = await supabase
      .from('animals')
      .update({
        last_lat: position.latitude,
        last_lng: position.longitude,
        last_seen: timestamp
          ? new Date(timestamp).toISOString()
          : null,
      })
      .eq('imei', imei)

    results.push({
      imei,
      latitude: position.latitude,
      longitude: position.longitude,
      updated: !error,
      error: error?.message ?? null,
    })
  }

  return NextResponse.json({
    success: true,
    devicesInTraccar: devices.length,
    positionsInTraccar: positions.length,
    updated: results.filter(
      result => result.updated
    ).length,
    skipped: results.filter(
      result => result.skipped
    ).length,
    results,
  })
}
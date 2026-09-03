import { NextRequest, NextResponse } from 'next/server';
import { dbManager } from '@/lib/db/adapter';

export async function GET() {
  return NextResponse.json({
    success: true,
    activeDriver: dbManager.getDriverType(),
    adapterName: dbManager.getAdapter().name,
    availableDrivers: ['memory', 'firestore', 'inhouse']
  });
}

export async function POST(req: NextRequest) {
  try {
    const { driver, firebaseConfig, inHouseUrl, inHouseKey } = await req.json();
    if (!['memory', 'firestore', 'inhouse'].includes(driver)) {
      return NextResponse.json({ success: false, error: 'Driver must be memory, firestore, or inhouse.' }, { status: 400 });
    }

    dbManager.setDriver(driver, {
      firebase: firebaseConfig,
      inHouseUrl,
      inHouseKey
    });

    return NextResponse.json({
      success: true,
      message: `Database switched to ${driver}`,
      activeDriver: dbManager.getDriverType(),
      adapterName: dbManager.getAdapter().name
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

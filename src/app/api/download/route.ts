import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const platformSchema = z.enum(['windows', 'mac', 'linux']);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platformParam = searchParams.get('platform');
  
  // Validate platform
  const result = platformSchema.safeParse(platformParam);
  
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
  }
  
  const platform = result.data;
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

  // Increment download count in Supabase
  try {
    await supabase.from('downloads').insert({
      platform,
      version,
    });
  } catch (error) {
    // Log the error but don't fail the download
    console.error('Failed to record download:', error);
  }

  // Determine redirect URL
  let downloadUrl = '';
  switch (platform) {
    case 'windows':
      downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS || '#';
      break;
    case 'mac':
      downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_MAC || '#';
      break;
    case 'linux':
      downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_LINUX || '#';
      break;
  }

  return NextResponse.redirect(new URL(downloadUrl, request.url));
}

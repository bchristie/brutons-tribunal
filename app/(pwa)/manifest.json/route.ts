import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function generateVersion(): string {
  // In Vercel, use deployment-specific env variables
  if (process.env.VERCEL_DEPLOYMENT_ID) {
    return `1.0.${process.env.VERCEL_DEPLOYMENT_ID}`;
  }
  
  // Locally, generate a hash based on current timestamp and NODE_ENV
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${timestamp}-${process.env.NODE_ENV || 'development'}`)
    .digest('hex')
    .substring(0, 6);
  
  return `1.0.${timestamp}-${hash}`;
}

export async function GET() {
  try {
    // Read the manifest template
    const templatePath = join(process.cwd(), 'app/(pwa)/manifest.json/manifest.template.json');
    const template = await readFile(templatePath, 'utf-8');
    
    // Replace version placeholder
    const version = generateVersion();
    const manifest = template.replace('__VERSION__', version);
    
    return new NextResponse(manifest, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating manifest:', error);
    return NextResponse.json(
      { error: 'Failed to generate manifest' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function generateVersion(): string {
  // In Vercel, use deployment-specific env variables
  if (process.env.VERCEL_DEPLOYMENT_ID) {
    return process.env.VERCEL_DEPLOYMENT_ID;
  }
  
  // Locally, generate a hash based on current timestamp and NODE_ENV
  const timestamp = Date.now();
  const hash = createHash('sha256')
    .update(`${timestamp}-${process.env.NODE_ENV || 'development'}`)
    .digest('hex')
    .substring(0, 6);
  
  return `${timestamp}-${hash}`;
}

export async function GET() {
  try {
    // Read the service worker template
    const templatePath = join(process.cwd(), 'app/(pwa)/sw.js/sw.template.js');
    const template = await readFile(templatePath, 'utf-8');
    
    // Replace version placeholder
    const version = generateVersion();
    const serviceWorker = template.replace(/__VERSION__/g, version);
    
    return new NextResponse(serviceWorker, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Service-Worker-Allowed': '/',
      },
    });
  } catch (error) {
    console.error('Error generating service worker:', error);
    return new NextResponse(
      '// Service worker generation failed',
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/javascript',
        }
      }
    );
  }
}

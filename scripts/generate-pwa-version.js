#!/usr/bin/env node

/**
 * Generate a unique build ID for PWA cache busting
 * This runs during the build process to ensure the service worker
 * updates when new versions are deployed
 */

const fs = require('fs');
const path = require('path');

// Generate build ID from timestamp + short random string
const timestamp = Date.now();
const random = Math.random().toString(36).substring(2, 8);
const buildId = `${timestamp}-${random}`;

console.log(`Generating PWA build ID: ${buildId}`);

// Path to the manifest file
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');

try {
  // Read existing manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update version - use build ID as patch version
  const currentVersion = manifest.version || '1.0.0';
  const [major, minor] = currentVersion.split('.');
  manifest.version = `${major}.${minor}.${buildId}`;
  
  // Write updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`✓ Updated PWA manifest version to: ${manifest.version}`);
  
  // Create/update build info file that can be imported
  const buildInfoPath = path.join(__dirname, '..', 'app', '(pwa)', '_lib', 'build-info.ts');
  const buildInfoDir = path.dirname(buildInfoPath);
  
  // Ensure directory exists
  if (!fs.existsSync(buildInfoDir)) {
    fs.mkdirSync(buildInfoDir, { recursive: true });
  }
  
  const buildInfoContent = `// Auto-generated during build - do not edit manually
export const BUILD_INFO = {
  id: '${buildId}',
  version: '${manifest.version}',
  timestamp: ${timestamp},
  date: '${new Date(timestamp).toISOString()}',
} as const;
`;
  
  fs.writeFileSync(buildInfoPath, buildInfoContent);
  console.log(`✓ Generated build info at: ${buildInfoPath}`);
  
  // Update service worker with new version
  const swPath = path.join(__dirname, '..', 'public', 'sw.js');
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Replace cache name versions with new build ID
  swContent = swContent.replace(
    /const CACHE_NAME = 'bt-pwa-v[^']+';/,
    `const CACHE_NAME = 'bt-pwa-v${buildId}';`
  );
  swContent = swContent.replace(
    /const DATA_CACHE_NAME = 'bt-pwa-data-v[^']+';/,
    `const DATA_CACHE_NAME = 'bt-pwa-data-v${buildId}';`
  );
  
  fs.writeFileSync(swPath, swContent);
  console.log(`✓ Updated service worker cache names to: v${buildId}`);
  
} catch (error) {
  console.error('Error updating PWA build ID:', error);
  process.exit(1);
}

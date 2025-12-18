/**
 * Seed script to log deployment events to audit log
 * Runs during build process to track deployments
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

export async function seedDeployment(prismaClient?: PrismaClient) {
  const prisma = prismaClient || new PrismaClient();
  
  try {
    console.log('🚀 Logging deployment to audit log...');

    // Find system user (or create one if needed)
    let systemUser = await prisma.user.findFirst({
      where: {
        email: 'system@brutons-tribunal.internal',
      },
    });

    if (!systemUser) {
      console.log('Creating system user...');
      systemUser = await prisma.user.create({
        data: {
          email: 'system@brutons-tribunal.internal',
          name: 'System',
        },
      });
    }

    // Get deployment info
    const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
    const isProduction = environment === 'production';
    
    // Get git info
    let commitHash = process.env.VERCEL_GIT_COMMIT_SHA || null;
    let commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE || null;
    let commitAuthor = process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || null;
    let branch = process.env.VERCEL_GIT_COMMIT_REF || null;

    // If not on Vercel, try to get from local git
    if (!commitHash) {
      try {
        commitHash = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
        commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();
        commitAuthor = execSync('git log -1 --pretty=%an', { encoding: 'utf-8' }).trim();
        branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
      } catch (error) {
        console.warn('Could not fetch git info:', error);
      }
    }

    const deploymentId = process.env.VERCEL_DEPLOYMENT_ID || 
                        process.env.VERCEL_URL || 
                        `local-${commitHash || Date.now()}`;
    
    const deploymentUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    // Use commit hash as unique identifier for upsert
    // This prevents duplicate entries when running seed multiple times locally
    const uniqueId = commitHash || `unknown-${Date.now()}`;

    // Upsert audit log entry (update if commit already logged, create if new)
    const existingLog = await prisma.auditLog.findFirst({
      where: {
        action: 'DEPLOYMENT',
        entityId: uniqueId,
      },
    });

    if (existingLog) {
      // Update existing deployment log
      await prisma.auditLog.update({
        where: { id: existingLog.id },
        data: {
          metadata: {
            environment,
            deploymentId,
            deploymentUrl,
            gitCommitSha: commitHash,
            gitCommitMessage: commitMessage,
            gitCommitAuthor: commitAuthor,
            gitBranch: branch,
            timestamp: new Date().toISOString(),
            vercelRegion: process.env.VERCEL_REGION,
            nodeVersion: process.version,
          },
        },
      });
      console.log(`✓ Updated deployment log: ${environment} (${commitHash?.substring(0, 7) || 'unknown'})`);
    } else {
      // Create new deployment log
      await prisma.auditLog.create({
        data: {
          action: 'DEPLOYMENT',
          entityType: 'System',
          entityId: uniqueId,
          performedById: systemUser.id,
          metadata: {
            environment,
            deploymentId,
            deploymentUrl,
            gitCommitSha: commitHash,
            gitCommitMessage: commitMessage,
            gitCommitAuthor: commitAuthor,
            gitBranch: branch,
            timestamp: new Date().toISOString(),
            vercelRegion: process.env.VERCEL_REGION,
            nodeVersion: process.version,
          },
        },
      });
      console.log(`✓ Deployment logged: ${environment} (${commitHash?.substring(0, 7) || 'unknown'})`);
    }

    
    if (isProduction) {
      console.log(`  Branch: ${branch}`);
      console.log(`  Commit: ${commitMessage}`);
      console.log(`  Author: ${commitAuthor}`);
    }

  } catch (error) {
    console.error('Error logging deployment:', error);
    // Don't fail the build if deployment logging fails
  }
}

// Allow running this file directly
if (require.main === module) {
  const prisma = new PrismaClient();
  
  seedDeployment(prisma)
    .then(() => {
      console.log('✅ Deployment seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error seeding deployment:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

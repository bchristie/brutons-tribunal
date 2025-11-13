import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws'; // Required for the adapter's WebSocket communication

// 1. Setup for Vercel/Node environment
neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL as string;

// 2. Instantiate the Adapter
// This replaces Prisma's default TCP driver with a faster, serverless-optimized one.
const adapter = new PrismaNeon({ connectionString }); 

// 3. Define the Singleton Pattern
const prismaClient = new PrismaClient({ adapter });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In development, store the client on the global object to prevent
// connection pool exhaustion from Next.js HMR (Hot Module Replacement)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = globalForPrisma.prisma || prismaClient;
}

// In production, each serverless function instance gets its own client.
export const prisma = globalForPrisma.prisma || prismaClient;

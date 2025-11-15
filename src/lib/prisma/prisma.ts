import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws'; // Required for the adapter's WebSocket communication

// Check if we should use Neon adapter or regular PostgreSQL
const useNeonAdapter = process.env.DATABASE_PROVIDER !== 'postgresql';
const connectionString = process.env.DATABASE_URL as string;

// Create Prisma Client based on provider
const createPrismaClient = () => {
  if (useNeonAdapter) {
    // 1. Setup for Vercel/Neon environment
    neonConfig.webSocketConstructor = ws;
    
    // 2. Instantiate the Neon Adapter
    // This replaces Prisma's default TCP driver with a faster, serverless-optimized one.
    const adapter = new PrismaNeon({ connectionString }); 
    
    // 3. Create Prisma Client with Neon adapter
    return new PrismaClient({ adapter });
  } else {
    // Use standard PostgreSQL connection (no adapter needed)
    return new PrismaClient();
  }
};

const prismaClient = createPrismaClient();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In development, store the client on the global object to prevent
// connection pool exhaustion from Next.js HMR (Hot Module Replacement)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = globalForPrisma.prisma || prismaClient;
}

// In production, each serverless function instance gets its own client.
export const prisma = globalForPrisma.prisma || prismaClient;

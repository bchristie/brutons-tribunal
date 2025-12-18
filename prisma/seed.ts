import { PrismaClient } from "@prisma/client";
import { seedPermissions } from "./seed-permissions";
import { seedUpdates } from "./seed-updates";
import { seedDeployment } from "./seed-deployment";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed permissions and roles
  await seedPermissions(prisma);

  // Seed sample updates
  await seedUpdates(prisma);

  // Log deployment
  await seedDeployment(prisma);

  console.log("🌱 Database seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
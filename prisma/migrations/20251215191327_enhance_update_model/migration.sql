-- AlterTable
ALTER TABLE "updates" ADD COLUMN     "eventDate" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "updates_featured_idx" ON "updates"("featured");

-- CreateIndex
CREATE INDEX "updates_eventDate_idx" ON "updates"("eventDate");

-- CreateIndex
CREATE INDEX "updates_expiresAt_idx" ON "updates"("expiresAt");
